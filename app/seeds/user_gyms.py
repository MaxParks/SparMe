from app.models import db, User, Gym, UserGym, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

def seed_user_gyms():
    # Find users and gyms
    demo_user = User.query.filter_by(email='demo@aa.io').first()
    alice_user = User.query.filter_by(email='alice@aa.io').first()

    gym_a = Gym.query.filter_by(name='Gym A').first()
    gym_b = Gym.query.filter_by(name='Gym B').first()

    # Create associations
    demo_user_gym = UserGym(
        user_id=demo_user.id,
        gym_id=gym_a.id
    )

    alice_user_gym = UserGym(
        user_id=alice_user.id,
        gym_id=gym_b.id
    )

    # Add to session
    db.session.add(demo_user_gym)
    db.session.add(alice_user_gym)

    # Commit to database
    db.session.commit()

def undo_user_gyms():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.user_gyms RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM user_gyms"))

    db.session.commit()
