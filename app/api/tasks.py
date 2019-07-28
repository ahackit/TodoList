from flask import render_template, request, Blueprint
from flask_restful import Resource

from . import core
from .. import db, api, app
from ..models import Tasks, Completed_Tasks



class TaskListAPI(Resource):
    @jwt_required()
    def post(self, desc):
        print(desc)
        task = Tasks(task_desc=desc)
        db.session.add(task)
        db.session.commit()
        return task.json()


class TaskListDelete(Resource):
    @jwt_required()
    def delete(self, desc):
        task = Tasks.query.filter_by(task_id=desc).first()
        db.session.delete(task)
        db.session.commit()
        return {'note': 'delete success'}


class TaskListComplete(Resource):
    @jwt_required()
    def delete(self, desc):
        task = Tasks.query.filter_by(task_id=desc).first()
        completed_task = Completed_Tasks(task.task_desc)
        db.session.add(completed_task)
        db.session.commit()
        db.session.delete(task)
        db.session.commit()
        return {'note': 'complete success'}


class TasksAPI(Resource):
    @jwt_required()
    def get(self):
        return [task.json() for task in Tasks.query.all()]


