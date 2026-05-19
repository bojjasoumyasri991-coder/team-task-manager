from flask import Blueprint, request, jsonify

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from models import db, Task, User

from datetime import datetime

tasks_bp = Blueprint('tasks', __name__)

# ================= CREATE TASK =================
@tasks_bp.route('/tasks', methods=['POST'])
@jwt_required()
def create_task():

    user_id = get_jwt_identity()

    user = User.query.get(user_id)

    # ADMIN ONLY
    if user.role != "admin":
        return jsonify({
            "message": "Access denied"
        }), 403

    data = request.get_json()

    due_date = None

    if data.get("due_date"):

        due_date = datetime.strptime(
            data["due_date"],
            "%Y-%m-%d"
        )

    task = Task(
        title=data['title'],
        status=data['status'],
        project_id=data['project_id'],
        assigned_to=data['assigned_to'],
        due_date=due_date
    )

    db.session.add(task)

    db.session.commit()

    return jsonify({
        "message": "Task created successfully"
    })


# ================= GET TASKS =================
@tasks_bp.route('/tasks', methods=['GET'])
@jwt_required()
def get_tasks():

    tasks = Task.query.all()

    output = []

    for task in tasks:

        overdue = False

        if (
            task.due_date and
            task.status != "Completed" and
            datetime.utcnow().date() > task.due_date
        ):
            overdue = True

        output.append({
            "id": task.id,
            "title": task.title,
            "status": task.status,
            "project_id": task.project_id,
            "assigned_to": task.assigned_to,

            "due_date":
                task.due_date.strftime("%Y-%m-%d")
                if task.due_date
                else None,

            "overdue": overdue
        })

    return jsonify(output)


# ================= UPDATE TASK =================
@tasks_bp.route('/tasks/<int:id>', methods=['PUT'])
@jwt_required()
def update_task(id):

    user_id = get_jwt_identity()

    user = User.query.get(user_id)

    # ADMIN ONLY
    if user.role != "admin":
        return jsonify({
            "message": "Access denied"
        }), 403

    task = Task.query.get(id)

    if not task:
        return jsonify({
            "message": "Task not found"
        }), 404

    data = request.get_json()

    task.status = data.get(
        "status",
        task.status
    )

    db.session.commit()

    return jsonify({
        "message": "Task updated successfully"
    })


# ================= DELETE TASK =================
@tasks_bp.route('/tasks/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_task(id):

    user_id = get_jwt_identity()

    user = User.query.get(user_id)

    # ADMIN ONLY
    if user.role != "admin":
        return jsonify({
            "message": "Access denied"
        }), 403

    task = Task.query.get(id)

    if not task:
        return jsonify({
            "message": "Task not found"
        }), 404

    db.session.delete(task)

    db.session.commit()

    return jsonify({
        "message": "Task deleted successfully"
    })