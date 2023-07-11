from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Session(db.Model):
    __tablename__ = 'sessions'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    owner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    partner_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    gym_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('gyms.id')), nullable=False)
    session_type = db.Column(db.String(100), nullable=False)
    session_date = db.Column(db.DateTime, nullable=False)
    details = db.Column(db.String(800), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)

    # Relationships
    owner = db.relationship('User', foreign_keys=[owner_id], back_populates='owned_sessions')
    partner = db.relationship('User', foreign_keys=[partner_id], back_populates='sessions_as_partner')
    gym = db.relationship('Gym', back_populates='sessions')
    reviews = db.relationship('Review', back_populates='session', cascade="all, delete")

    def to_dict(self):
        return {
            'id': self.id,
            'owner_id': self.owner_id,
            'partner_id': self.partner_id,
            'gym_id': self.gym_id,
            'session_type': self.session_type,
            'session_date': self.session_date.isoformat() if self.session_date else None,
            'details': self.details,
            'created_at': self.created_at.strftime('%m/%d/%Y') if self.created_at else None,
            'updated_at': self.updated_at.strftime('%m/%d/%Y') if self.updated_at else None,
            'owner': self.owner.to_dict() if self.owner else None,
            'partner': self.partner.to_dict() if self.partner else None,
            'gym': self.gym.to_dict() if self.gym else None,
            'reviews': [review.id for review in self.reviews] if self.reviews else None
        }
