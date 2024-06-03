from sqlalchemy import Column, Integer, String, Float
from geoalchemy2 import Geometry
from shapely import wkb
from app.configs.extensions import db

class Market(db.Model):
    __tablename__ = 'markets'

    id = Column(Integer, primary_key=True)
    name = Column(String(255))
    geom = Column(Geometry('POINT', srid=4326))
    types = Column(String(255))
    rating = Column(Float)
    review_count = Column(Integer)

    def format_geom(self):
        # Assuming the geom column is of type WKBElement
        point = wkb.loads(bytes(self.geom.data))  # Convert WKB object to point
        return f"{point.y},{point.x}"

    def __repr__(self):
        return f'<Market id={self.id} name={self.name}>'
