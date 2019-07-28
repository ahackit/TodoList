from . import db
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash


class User(db.Model):
    __tablename__ = 'users_l'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(64), unique=True, index=True)
    password_hash = db.Column(db.String(128))

    def __init__(self, username, password):
        self.username = username
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Tasks(db.Model):
    __tablename__ = 'tasks_l'
    task_id = db.Column(db.Integer, primary_key=True)
    task_desc = db.Column(db.String(250))

    def __init__(self, task_desc):
        self.task_desc = task_desc

    def json(self):
        return {'task_id': self.task_id, 'task_name': self.task_desc}


class Completed_Tasks(db.Model):
    __tablename__ = 'completed_tasks_l'
    completed_id = db.Column(db.Integer, primary_key=True)
    task_desc = db.Column(db.String(250))
    complete_dtm = db.Column(db.DateTime,
                             nullable=True,
                             default=datetime.utcnow)

    def __init__(self, task_desc):
        self.task_desc = task_desc

    def json(self):
        return {'task_id': self.task_id, 'task_name': self.task_desc}