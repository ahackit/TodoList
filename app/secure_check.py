from . import db
from .models import models

if User.query.filter_by(username='austin').first():
    print('user found')
    pass
else:
    user = User('austin', 'mycrazypassword')
    db.session.add(user)
    db.session.commit()


def authenticate(username, password):
    user = User.query.filter_by(username='austin').first()
    print('calling from authenticate')
    if user.check_password(password):
        return user


def identity(payload):
    user_id = payload['identity']
    print('calling from identity')
    print(user_id)
    return User.query.filter_by(id=user_id).first()