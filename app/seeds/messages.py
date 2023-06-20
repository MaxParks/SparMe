from app.models import db, User, Message,  environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime


def seed_messages():
    sender1 = User.query.filter_by(email='demo@aa.io').first()
    receiver1 = User.query.filter_by(email='alice@aa.io').first()
    sender2 = User.query.filter_by(email='bob@aa.io').first()
    receiver2 = User.query.filter_by(email='demo@aa.io').first()
    sender3 = User.query.filter_by(email='marnie@aa.io').first()
    receiver3 = User.query.filter_by(email='alice@aa.io').first()

    message1 = Message(
        sender_id=sender1.id,
        receiver_id=receiver1.id,
        message_text='Hey Alice would you like to spar this weekend?',
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    message2 = Message(
        sender_id=sender2.id,
        receiver_id=receiver2.id,
        message_text='Hey Demo I am new around here and want to find a BJJ training partner. Are you down?',
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    message3 = Message(
        sender_id=sender3.id,
        receiver_id=receiver3.id,
        message_text='Hi, I am Marnie. I would love to train with you.',
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    db.session.add(message1)
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
