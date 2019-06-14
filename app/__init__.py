import os

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_restful import Api

app = Flask(__name__)
basedir = None

f = open(r'C:\Users\Austin\Google Drive\Code\Projects\ToDo\config.txt', 'r')
for row in f.readlines():
    key = row.split('|')[0]
    value = row.split('|')[1]
    if key == 'secret_key':
        app.config['SECRET_KEY'] = value
    elif key == 'dbpath':
        basedir = value

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(
    basedir, 'data.sqlite')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
Migrate(app, db)
api = Api(app)

from todo.core.views import core

app.register_blueprint(core)