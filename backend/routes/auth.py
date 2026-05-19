from flask import Blueprint, request, jsonify
from models import db, User
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token

auth_bp = Blueprint(
    'auth',
    __name__,
    url_prefix='/auth'
)

# ================= SIGNUP =================
@auth_bp.route('/register', methods=['POST'])
def signup():

    data = request.json

    if User.query.filter_by(email=data['email']).first():
        return jsonify({
            "message": "Email already exists"
        }), 400

    hashed_password = generate_password_hash(
        data['password']
    )

    user = User(
        name=data['name'],
        email=data['email'],
        password=hashed_password,
        role=data.get('role', 'member')
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "message": "User registered successfully"
    })


# ================= LOGIN =================
@auth_bp.route('/login', methods=['POST'])
def login():

    data = request.json

    user = User.query.filter_by(
        email=data['email']
    ).first()

    if not user:
        return jsonify({
            "message": "User not found"
        }), 404

    if not check_password_hash(
        user.password,
        data['password']
    ):
        return jsonify({
            "message": "Invalid password"
        }), 401

    token = create_access_token(
        identity=str(user.id)
    )

    return jsonify({
        "token": token,
        "role": user.role,
        "name": user.name
    })