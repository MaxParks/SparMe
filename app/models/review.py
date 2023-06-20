from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime

class Review(db.Model):
    __tablename__ = 'reviews'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    reviewer_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('users.id')), nullable=False)
    session_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod('sessions.id')), nullable=False)
    rating = db.Column(db.Integer)
    review_text = db.Column(db.String(800))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)

    # Relationships
    reviewer = db.relationship('User', back_populates='user_reviews')
    session = db.relationship('Session', back_populates='reviews')

    def to_dict(self):
        return {
            'id': self.id,
            'reviewer_id': self.reviewer_id,
            'session_id': self.session_id,
            'rating': self.rating,
            'review_text': self.review_text,
            'created_at': self.created_at.strftime('%m/%d/%Y'),
            'updated_at': self.updated_at.strftime('%m/%d/%Y'),
            'reviewer': self.reviewer.to_dict(),
            'session': self.session.to_dict()
        }
