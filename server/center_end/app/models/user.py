from sqlalchemy import Column, Integer, String, Float
from geoalchemy2 import Geometry
from shapely import wkb
from app.configs.extensions import db

class User(db.Model):
    __tablename__ = 'users'

    user_id = Column(Integer, primary_key=True)
    user_name = Column(String(255))
    user_role = Column(String(255))
    password = Column(String(255))

    def __repr__(self):
        return f'<User id={self.user_id} name={self.user_name}>'
    
    def format_to_json(self):
        return {
            'userId': self.user_id,
            'userName': self.user_name,
            'userRole': self.user_role
        }
