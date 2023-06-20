from app.models import db, User, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime


# Adds a demo user, you can add other users here if you want
def seed_users():
    demo = User(
        firstName='Demo',
        lastName='User',
        email='demo@aa.io',
        password='password',
        experience='3',
        city='New York',
        weight=180.5,
        height= 5.11,
        created_at=datetime.utcnow()
        )

    marnie = User(
        firstName='Marnie',
        lastName='Vulg',
        email='marnie@aa.io',
        password='password',
        experience=2,
        city='Los Angeles',
        weight=160.2,
        height=5.7,
        created_at=datetime.utcnow()
    )

    alice = User(
        firstName='Alice',
        lastName='Cowle',
        email='alice@aa.io',
        password='password',
        experience=4,
        city='Chicago',
        weight=200.0,
        height=6.0,
        created_at=datetime.utcnow()
    )

    bob = User(
        firstName='Bob',
        lastName='Jones',
        email='bob@aa.io',
        password='password',
        experience=1,
        city='Agoura Hills',
        weight=130.0,
        height=5.7,
        created_at=datetime.utcnow()
    )

    db.session.add(demo)
    db.session.add(marnie)
    db.session.add(alice)
    db.session.add(bob)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_users():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.users RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM users"))

    db.session.commit()
