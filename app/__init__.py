import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Api
from flask_jwt import JWT, jwt_required
from .secure_check import authenticate, identity
from config import config

db = SQLAlchemy()
api = Api()
jwt = JWT()


def create_app(config_name):
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    config[config_name].init_app(app)

    db.init_app(app)
    jwt.init_app(app, authenticate, identity)
    api.init_app(api)
    
    from .core import core as core_blueprint
    app.register_blueprint(core_blueprint)

    
    from .api import api as api_blueprint
    app.register_blueprint(api_blueprint, url_prefix='/api')
    from .api.tasks import TaskListAPI, TaskListDelete, TaskListComplete, TasksAPI
    api.add_resource(TaskListAPI, '/tasks/<string:desc>')
    api.add_resource(TaskListDelete, '/tasks/delete/<string:desc>')
    api.add_resource(TaskListComplete, '/tasks/complete/<string:desc>')
    api.add_resource(TasksAPI, '/tasks')


    return app


    

