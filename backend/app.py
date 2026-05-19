from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from werkzeug.security import generate_password_hash

from config import Config
from models import db, User

app = Flask(__name__)

app.config.from_object(Config)

# Initialize database
db.init_app(app)

# Enable CORS
CORS(
    app,
    resources={r"/*": {"origins": "*"}},
    supports_credentials=True
)

# JWT
JWTManager(app)

# Import routes
from routes.auth import auth_bp
from routes.projects import project_bp
from routes.tasks import tasks_bp

# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(project_bp)
app.register_blueprint(tasks_bp)

# Home route
@app.route('/')
def home():
    return {"message": "Team Task Manager API Running"}

# Create admin automatically
with app.app_context():

    db.create_all()

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

        print("Admin created successfully")

    else:
        print("Admin already exists")

# Run app
if __name__ == '__main__':
    app.run(debug=True)