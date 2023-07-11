from app.models import db, User, Gym, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime


def seed_gyms():
    gym1 = Gym(
        owner=User.query.filter_by(email='demo@aa.io').first(),
        name='Gracie Barra New York',
        city='New York',
        martial_art='BJJ',
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    gym2 = Gym(
        owner=User.query.filter_by(email='alice@aa.io').first(),
        name='Wildcard Boxing',
        city='Los Angeles',
        martial_art='Boxing',
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    gym3 = Gym(
        owner=User.query.filter_by(email='marnie@aa.io').first(),
        name='UFC Gym Las Vegas',
        city='Las Vegas',
        martial_art='MMA',
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    gym4 = Gym(
        owner=User.query.filter_by(email='demo@aa.io').first(),
        name='Dstroy',
        city='San Francisco',
        martial_art='MMA',
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    gym5 = Gym(
        owner=User.query.filter_by(email='charlie@aa.io').first(),
        name='Elite MMA',
        city='Los Angeles',
        martial_art='MMA',
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    gym6 = Gym(
        owner=User.query.filter_by(email='david@aa.io').first(),
        name='HardKnocks',
        city='Miami',
        martial_art='Boxing',
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    # Add gyms to the session
    db.session.add(gym1)
    db.session.add(gym2)
    db.session.add(gym3)
    db.session.add(gym4)
    db.session.add(gym5)
    db.session.add(gym6)

    # Commit the changes to the database
    db.session.commit()

# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_gyms():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.gyms RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM gyms"))

    db.session.commit()
