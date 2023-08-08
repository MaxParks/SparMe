from app.models import db, User, Message,  environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime


def seed_messages():
    demo = User.query.filter_by(email='demo@aa.io').first()
    alice = User.query.filter_by(email='alice@aa.io').first()
    bob = User.query.filter_by(email='bob@aa.io').first()
    charlie = User.query.filter_by(email='charlie@aa.io').first()
    marnie = User.query.filter_by(email='marnie@aa.io').first()
    david = User.query.filter_by(email='david@aa.io').first()
    elizabeth = User.query.filter_by(email='elizabeth@aa.io').first()

    message1 = Message(
        sender_id=demo.id,
        receiver_id=alice.id,
        message_text='Hey Alice would you like to spar this weekend?',
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    message11 = Message(
        sender_id=alice.id,
        receiver_id=demo.id,
        message_text='I would love to what time are you thinking?',
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    message111 = Message(
        sender_id=demo.id,
        receiver_id=alice.id,
        message_text='How does 9am work at Gracie?',
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    message2 = Message(
        sender_id=bob.id,
        receiver_id=demo.id,
        message_text='Hey Demo I am new around here and want to find a BJJ training partner. Are you down?',
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    message3 = Message(
        sender_id=marnie.id,
        receiver_id=demo.id,
        message_text='Hi, I am Marnie. I would love to train with you.',
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    db.session.add(message1)
    db.session.add(message11)
    db.session.add(message111)
    db.session.add(message2)
    db.session.add(message3)
    db.session.commit()

# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_messages():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.messages RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM messages"))

    db.session.commit()
