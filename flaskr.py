import os
from app import create_app, db
from flask_migrate import Migrate
# os.getenv('FLASK_CONFIG') or 
app = create_app('default')
migrate = Migrate(app, db)
