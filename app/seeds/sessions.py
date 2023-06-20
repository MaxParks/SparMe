from app.models import db, User, Gym, Session, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime, timedelta
from random import randint

def seed_sessions():
    # Find users and gyms
    demo_user = User.query.filter_by(email='demo@aa.io').first()
    marnie_user = User.query.filter_by(email='marnie@aa.io').first()
    alice_user = User.query.filter_by(email='alice@aa.io').first()

    gym_a = Gym.query.filter_by(name='Gym A').first()
    gym_b = Gym.query.filter_by(name='Gym B').first()

    # Create a session
    demo_session = Session(
        owner_id=demo_user.id,
        partner_id=marnie_user.id,
        gym_id=gym_a.id,
        session_type="MMA Training",
        session_date=datetime.utcnow() + timedelta(days=randint(1, 10)),
        details="A Hard sparring session.",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    marnie_session = Session(
        owner_id=marnie_user.id,
        partner_id=demo_user.id,
        gym_id=gym_b.id,
        session_type="Boxing",
        session_date=datetime.utcnow() + timedelta(days=randint(1, 10)),
        details="Easy boxing session today",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    alice_session = Session(
        owner_id=alice_user.id,
        partner_id=demo_user.id,
        gym_id=gym_a.id,
        session_type="BJJ Training",
        session_date=datetime.utcnow() + timedelta(days=randint(1, 10)),
        details="Trying to learn some new moves",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    # Add sessions to the session
    db.session.add(demo_session)
    db.session.add(marnie_session)
    db.session.add(alice_session)

    # Commit to database
    db.session.commit()

def undo_sessions():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.sessions RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM sessions"))

    db.session.commit()
