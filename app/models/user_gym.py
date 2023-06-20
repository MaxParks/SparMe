from .db import db, environment, SCHEMA, add_prefix_for_prod

class UserGym(db.Model):
    __tablename__ = 'user_gym'

    if environment == "production":
        __table_args__ = {'schema': SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    gym_id = db.Column(db.Integer, db.ForeignKey('gyms.id'), nullable=False)

    # Relationships
    user_owner = db.relationship('User', back_populates='owned_user_gyms', foreign_keys=[user_id])
    gym = db.relationship('Gym', back_populates='user_gyms')

    def to_dict(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'gym_id': self.gym_id,
            'user': self.user_owner.to_dict(),
            'gym': self.gym.to_dict()
        }
