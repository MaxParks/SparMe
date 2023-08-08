from app.models import db, User, Gym, Session, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime, timedelta
from random import randint
import random

def seed_sessions():
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

    # Create a session
    demo_session = Session(
        owner_id=demo_user.id,
        partner_id=marnie_user.id,
        gym_id=gym_1.id,
        session_type="MMA",
        session_date=datetime.utcnow() + timedelta(days=random.randint(1, 10)) + timedelta(hours=random.randint(0, 23)) + timedelta(minutes=random.randint(0, 59)),
        details="Lets start with boxing then kickboxing and finally end with some good MMA with grappling",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    marnie_session = Session(
        owner_id=marnie_user.id,
        partner_id=elizabeth_user.id,
        gym_id=gym_2.id,
        session_type="Boxing",
        session_date=datetime.utcnow() + timedelta(days=random.randint(1, 10)) + timedelta(hours=random.randint(0, 23)) + timedelta(minutes=random.randint(0, 59)),
        details="Easy boxing session today",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    alice_session = Session(
        owner_id=alice_user.id,
        partner_id=demo_user.id,
        gym_id=gym_3.id,
        session_type="BJJ",
        session_date=datetime.utcnow() + timedelta(days=random.randint(1, 10)) + timedelta(hours=random.randint(0, 23)) + timedelta(minutes=random.randint(0, 59)),
        details="Trying to learn some new moves",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    bob_session = Session(
        owner_id=bob_user.id,
        partner_id=alice_user.id,
        gym_id=gym_4.id,
        session_type="Boxing",
        session_date=datetime.utcnow() + timedelta(days=random.randint(1, 10)) + timedelta(hours=random.randint(0, 23)) + timedelta(minutes=random.randint(0, 59)),
        details="Boxing session. Working on combinations.",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    charlie_session = Session(
        owner_id=charlie_user.id,
        partner_id=david_user.id,
        gym_id=gym_5.id,
        session_type="BJJ",
        session_date=datetime.utcnow() + timedelta(days=random.randint(1, 10)) + timedelta(hours=random.randint(0, 23)) + timedelta(minutes=random.randint(0, 59)),
        details="BJJ sparring session.",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    david_session = Session(
        owner_id=david_user.id,
        partner_id=elizabeth_user.id,
        gym_id=gym_6.id,
        session_type="MMA",
        session_date=datetime.utcnow() + timedelta(days=random.randint(1, 10)) + timedelta(hours=random.randint(0, 23)) + timedelta(minutes=random.randint(0, 59)),
        details="MMA session to work on all aspects",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    elizabeth_session = Session(
        owner_id=elizabeth_user.id,
        partner_id=demo_user.id,
        gym_id=gym_1.id,
        session_type="Boxing",
        session_date=datetime.utcnow() + timedelta(days=random.randint(1, 10)) + timedelta(hours=random.randint(0, 23)) + timedelta(minutes=random.randint(0, 59)),
        details="Teach me how to punch!",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    marnie_elizabeth_session = Session(
        owner_id=marnie_user.id,
        partner_id=elizabeth_user.id,
        gym_id=gym_1.id,
        session_type="MMA",
        session_date=datetime.utcnow() + timedelta(days=random.randint(1, 10)) + timedelta(hours=random.randint(0, 23)) + timedelta(minutes=random.randint(0, 59)),
        details="Training for upcoming MMA fight",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    alice_bob_session = Session(
        owner_id=alice_user.id,
        partner_id=bob_user.id,
        gym_id=gym_5.id,
        session_type="BJJ",
        session_date=datetime.utcnow() + timedelta(days=random.randint(1, 10)) + timedelta(hours=random.randint(0, 23)) + timedelta(minutes=random.randint(0, 59)),
        details="BJJ Training with Bob",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    charlie_marnie_session = Session(
        owner_id=charlie_user.id,
        partner_id=marnie_user.id,
        gym_id=gym_6.id,
        session_type="Boxing",
        session_date=datetime.utcnow() + timedelta(days=random.randint(1, 10)) + timedelta(hours=random.randint(0, 23)) + timedelta(minutes=random.randint(0, 59)),
        details="Boxing practice with Marnie",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    david_alice_session = Session(
        owner_id=david_user.id,
        partner_id=alice_user.id,
        gym_id=gym_3.id,
        session_type="BJJ",
        session_date=datetime.utcnow() + timedelta(days=random.randint(1, 10)) + timedelta(hours=random.randint(0, 23)) + timedelta(minutes=random.randint(0, 59)),
        details="BJJ sparring with Alice",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    past_session = Session(
    owner_id=demo_user.id,
    partner_id=elizabeth_user.id,
    gym_id=gym_2.id,
    session_type="MMA",
    session_date=datetime.utcnow() - timedelta(days=random.randint(1, 10)) - timedelta(hours=random.randint(0, 23)) - timedelta(minutes=random.randint(0, 59)),
    details="lets shoot for 2 hours of sparring",
    created_at=datetime.utcnow(),
    updated_at=datetime.utcnow()
)

    # Add sessions to the session
    db.session.add(demo_session)
    db.session.add(marnie_session)
    db.session.add(alice_session)
    db.session.add(bob_session)
    db.session.add(charlie_session)
    db.session.add(david_session)
    db.session.add(elizabeth_session)
    db.session.add(marnie_elizabeth_session)
    db.session.add(alice_bob_session)
    db.session.add(charlie_marnie_session)
    db.session.add(david_alice_session)
    db.session.add(past_session)

    # Commit to database
    db.session.commit()

def undo_sessions():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.sessions RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM sessions"))

    db.session.commit()
