from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Gym(db.Model):
    __tablename__ = 'gyms'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    city = db.Column(db.String(100))
    martial_art = db.Column(db.String(100))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)

    # Relationships
    owner = db.relationship('User', back_populates='owned_gyms')
    user_gyms = db.relationship('UserGym', back_populates='gym', cascade='all, delete-orphan')
    sessions = db.relationship('Session', back_populates='gym', cascade="all, delete-orphan")

    def to_dict(self):
        created_at = self.created_at.strftime('%m/%d/%Y') if self.created_at else None
        updated_at = self.updated_at.strftime('%m/%d/%Y') if self.updated_at else None

        return {
        'id': self.id,
        'owner_id': self.owner_id,
        'name': self.name,
        'city': self.city,
        'martial_art': self.martial_art,
        'created_at': created_at,
        'updated_at': updated_at,
        'owner': self.owner.to_resource_dict() if self.owner else None,
        'user_gyms': [user_gym.id for user_gym in self.user_gyms],
        'sessions': [session.id for session in self.sessions]
    }
