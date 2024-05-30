from app import db

class Market(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100), nullable=False)

    def __repr__(self):
        return f"Market(name='{self.name}', location='{self.location}')"
    