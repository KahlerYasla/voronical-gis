from app.configs.extensions import db
from app.models.user import User

from app.utils.logger import Logger

from sqlalchemy.orm import Session
from sqlalchemy.sql import text

class AuthService:
    def create_user(self, username, password, role):
        user = User(user_name=username, password=password, user_role=role)
        db.session.add(user)
        db.session.commit()
        return user

    def login(self, username, password, role):
        user: User = User.query.filter_by(user_name=username, password=password, user_role=role).first()
        Logger._("type of user: ", "b")
        print(type(user))
        print(user)
        return user

    def get_user(self, username):
        user = User.query.filter_by(username=username).first()
        return user
    