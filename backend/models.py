from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


# ================= USER MODEL =================
class User(db.Model):

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    name = db.Column(
        db.String(100),
        nullable=False
    )

    email = db.Column(
        db.String(120),
        unique=True,
        nullable=False
    )

    password = db.Column(
        db.String(300),
        nullable=False
    )

    role = db.Column(
        db.String(20),
        default="member"
    )


# ================= PROJECT MODEL =================
class Project(db.Model):

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    name = db.Column(
        db.String(200),
        nullable=False
    )

    description = db.Column(
        db.Text,
        nullable=False
    )


# ================= TASK MODEL =================
class Task(db.Model):

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    title = db.Column(
        db.String(200),
        nullable=False
    )

    status = db.Column(
        db.String(50),
        default="Pending"
    )

    # DUE DATE
    due_date = db.Column(
        db.Date
    )

    # FOREIGN KEYS
    project_id = db.Column(
        db.Integer,
        db.ForeignKey('project.id')
    )

    assigned_to = db.Column(
        db.Integer,
        db.ForeignKey('user.id')
    )