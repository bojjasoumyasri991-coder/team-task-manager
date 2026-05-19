from flask import Blueprint, request, jsonify

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from models import db, Project, User

project_bp = Blueprint('projects', __name__)

# ================= CREATE PROJECT =================
@project_bp.route('/projects', methods=['POST'])
@jwt_required()
def create_project():

    # GET CURRENT USER
    user_id = get_jwt_identity()

    user = User.query.get(user_id)

    # ROLE CHECK
    if user.role != "admin":
        return jsonify({
            "message": "Access denied. Admin only."
        }), 403

    data = request.get_json()

    project = Project(
        name=data['name'],
        description=data['description']
    )

    db.session.add(project)

    db.session.commit()

    return jsonify({
        "message": "Project created successfully"
    })


# ================= GET ALL PROJECTS =================
@project_bp.route('/projects', methods=['GET'])
@jwt_required()
def get_projects():

    projects = Project.query.all()

    output = []

    for project in projects:

        output.append({
            "id": project.id,
            "name": project.name,
            "description": project.description
        })

    return jsonify(output)


# ================= DELETE PROJECT =================
@project_bp.route('/projects/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_project(id):

    # GET CURRENT USER
    user_id = get_jwt_identity()

    user = User.query.get(user_id)

    # ADMIN ONLY
    if user.role != "admin":
        return jsonify({
            "message": "Access denied. Admin only."
        }), 403

    project = Project.query.get(id)

    if not project:
        return jsonify({
            "message": "Project not found"
        }), 404

    db.session.delete(project)

    db.session.commit()

    return jsonify({
        "message": "Project deleted successfully"
    })