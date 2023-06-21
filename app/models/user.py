from .db import db, environment, SCHEMA, add_prefix_for_prod
from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import UserMixin

class User(db.Model, UserMixin):
    __tablename__ = 'users'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    firstName = db.Column(db.String(255), nullable=False)
    lastName = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False)
    experience = db.Column(db.Integer, nullable=False)
    city = db.Column(db.String(255), nullable=False)
    weight = db.Column(db.Float, nullable=False)
    height = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)

    # Relationships
    owned_sessions = db.relationship('Session', foreign_keys='Session.owner_id', back_populates='owner')
    sessions_as_partner = db.relationship('Session', foreign_keys='Session.partner_id', back_populates='partner')
    owned_gyms = db.relationship('Gym', back_populates='owner')
    owned_user_gyms = db.relationship('UserGym', back_populates='user_owner', cascade='all, delete-orphan')
    sent_messages = db.relationship('Message', foreign_keys='Message.sender_id', back_populates='sender', lazy='dynamic')
    received_messages = db.relationship('Message', foreign_keys='Message.receiver_id', back_populates='receiver', lazy='dynamic')
    user_reviews = db.relationship('Review', back_populates='reviewer')

    @property
    def password(self):
        raise AttributeError('Password is not readable')

    @password.setter
    def password(self, password):
        self.hashed_password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.hashed_password, password)

    def to_dict(self):
        return {
            'id': self.id,
            'firstName': self.firstName,
            'lastName': self.lastName,
            'email': self.email,
            'experience': self.experience,
            'city': self.city,
            'weight': self.weight,
            'height': self.height,
            'created_at': self.created_at.strftime('%m/%d/%Y'),
            'sessions_as_owner': [session.id for session in self.owned_sessions],
            'sessions_as_partner': [session.id for session in self.sessions_as_partner],
            'owned_gyms': [gym.id for gym in self.owned_gyms],
            'owned_user_gyms': [user_gym.id for user_gym in self.owned_user_gyms],
            'sent_messages': [message.id for message in self.sent_messages],
            'received_messages': [message.id for message in self.received_messages],
            'reviews': [review.id for review in self.user_reviews]
        }
