from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from werkzeug.security import generate_password_hash

from config import Config
from models import db, User

app = Flask(__name__)

app.config.from_object(Config)

db.init_app(app)

CORS(
    app,
    resources={r"/*": {"origins": "*"}},
    supports_credentials=True
)

JWTManager(app)

# IMPORT ROUTES
from routes.auth import auth_bp
from routes.projects import project_bp
from routes.tasks import tasks_bp

app.register_blueprint(auth_bp)
app.register_blueprint(project_bp)
app.register_blueprint(tasks_bp)

@app.route('/')
def home():
    return {"message": "Team Task Manager API Running"}

# CREATE TABLES + ADMIN
with app.app_context():

    db.create_all()

    # CHECK ADMIN
    admin = User.query.filter_by(
        email="admin@gmail.com"
    ).first()

    # CREATE ADMIN IF NOT EXISTS
    if not admin:

        admin = User(
            name="Admin",
            email="admin@gmail.com",
            password=generate_password_hash("123456"),
            role="admin"
        )

        db.session.add(admin)
        db.session.commit()

        print("Admin created")

if __name__ == '__main__':
    app.run(debug=True)