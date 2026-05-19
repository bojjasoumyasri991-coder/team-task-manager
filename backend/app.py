from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from config import Config
from models import db

app = Flask(__name__)

app.config.from_object(Config)

db.init_app(app)

CORS(app)
JWTManager(app)

# Import routes
from routes.auth import auth_bp
from routes.projects import project_bp
from routes.tasks import tasks_bp

app.register_blueprint(auth_bp)
app.register_blueprint(project_bp)
app.register_blueprint(tasks_bp)

@app.route('/')
def home():
    return {"message": "Team Task Manager API Running"}
from werkzeug.security import generate_password_hash
from models import User

with app.app_context():
    existing_admin = User.query.filter_by(
        email="admin@gmail.com"
    ).first()

    if not existing_admin:
        admin = User(
            name="Admin",
            email="admin@gmail.com",
            password=generate_password_hash("admin123"),
            role="admin"
        )

        db.session.add(admin)
        db.session.commit()

        print("Admin created")

if __name__ == '__main__':
    with app.app_context():
        db.create_all()

    app.run(debug=True)