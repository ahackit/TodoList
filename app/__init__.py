import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Api
from flask_jwt import JWT, jwt_required

from config import config

db = SQLAlchemy()
api = Api()    
jwt = JWT()


from .secure_check import authenticate, identity




def create_app(config_name):
    
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_object(config['default'])
    config[config_name].init_app(app)
    
    db.init_app(app)
    # , authenticate, identity
    jwt = JWT(app, authenticate, identity)

    
    from .core import core as core_blueprint

    app.register_blueprint(core_blueprint)

    from .api import api as api_blueprint
    api = Api(api_blueprint)

    from .api.tasks import TaskListAPI, TaskListDelete, TaskListComplete, TasksAPI
    api.add_resource(TaskListAPI, '/tasks/<string:desc>')
    api.add_resource(TaskListDelete, '/tasks/delete/<string:desc>')
    api.add_resource(TaskListComplete, '/tasks/complete/<string:desc>')
    api.add_resource(TasksAPI, '/tasks')

    app.register_blueprint(api_blueprint, url_prefix='/api')
 


    return app


    

