from app.models import db, User, Gym, UserGym, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime

def seed_user_gyms():
    # Find users and gyms
    demo_user = User.query.filter_by(email='demo@aa.io').first()
    marnie_user = User.query.filter_by(email='marnie@aa.io').first()
    alice_user = User.query.filter_by(email='alice@aa.io').first()
    bob_user = User.query.filter_by(email='bob@aa.io').first()
    charlie_user = User.query.filter_by(email='charlie@aa.io').first()
    david_user = User.query.filter_by(email='david@aa.io').first()
    elizabeth_user = User.query.filter_by(email='elizabeth@aa.io').first()

    gym_1 = Gym.query.filter_by(name='Gracie Barra New York').first()
    gym_2 = Gym.query.filter_by(name='Wildcard Boxing').first()
    gym_3 = Gym.query.filter_by(name='UFC Gym Las Vegas').first()
    gym_4 = Gym.query.filter_by(name='Dstroy').first()
    gym_5 = Gym.query.filter_by(name='Elite MMA').first()
    gym_6 = Gym.query.filter_by(name='HardKnocks').first()

    # Create associations
    demo_user_gym = UserGym(
        user_id=demo_user.id,
        gym_id=gym_1.id
    )
    marnie_user_gym = UserGym(
        user_id=marnie_user.id,
        gym_id=gym_1.id
    )

    alice_user_gym = UserGym(
        user_id=alice_user.id,
        gym_id=gym_3.id
    )

    bob_user_gym = UserGym(
        user_id=bob_user.id,
        gym_id=gym_4.id
    )

    charlie_user_gym = UserGym(
        user_id=charlie_user.id,
        gym_id=gym_5.id
    )

    david_user_gym = UserGym(
        user_id=david_user.id,
        gym_id=gym_6.id
    )

    elizabeth_user_gym = UserGym(
        user_id=elizabeth_user.id,
        gym_id=gym_1.id
    )

    # Add to session
    db.session.add(demo_user_gym)
    db.session.add(marnie_user_gym)
    db.session.add(alice_user_gym)
    db.session.add(bob_user_gym)
    db.session.add(charlie_user_gym)
    db.session.add(david_user_gym)
    db.session.add(elizabeth_user_gym)

    # Commit to database
    db.session.commit()

def undo_user_gyms():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.user_gyms RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM user_gyms"))

    db.session.commit()
