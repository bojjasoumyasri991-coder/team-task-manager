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

if __name__ == '__main__':
    with app.app_context():
        db.create_all()

    app.run(debug=True)