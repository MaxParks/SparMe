from app.models import db, User, Review, Session, environment, SCHEMA
from sqlalchemy.sql import text
from datetime import datetime


def seed_reviews():
    reviewer1 = User.query.filter_by(email='demo@aa.io').first()
    reviewer2 = User.query.filter_by(email='marnie@aa.io').first()
    reviewer3 = User.query.filter_by(email='alice@aa.io').first()
    reviewer4 = User.query.filter_by(email='bob@aa.io').first()
    reviewer5 = User.query.filter_by(email='charlie@aa.io').first()
    reviewer6 = User.query.filter_by(email='david@aa.io').first()
    reviewer7 = User.query.filter_by(email='elizabeth@aa.io').first()

    session1 = Session.query.filter_by(id=1).first()
    session2 = Session.query.filter_by(id=2).first()
    session3 = Session.query.filter_by(id=3).first()
    session4 = Session.query.filter_by(id=4).first()
    session5 = Session.query.filter_by(id=5).first()

    review1 = Review(
        reviewer_id=reviewer1.id,
        session_id=session1.id,
        rating=4,
        review_text='She was a good sparring partner, will train with her again.',
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    review2 = Review(
        reviewer_id=reviewer2.id,
        session_id=session2.id,
        rating=2,
        review_text='Bad he hurt me.',
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    review3 = Review(
        reviewer_id=reviewer3.id,
        session_id=session3.id,
        rating=5,
        review_text='Amazing training partner.',
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    review4 = Review(
        reviewer_id=reviewer4.id,
        session_id=session4.id,
        rating=1,
        review_text='Terrible , dont train with this monster.',
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    review5 = Review(
        reviewer_id=reviewer2.id,
        session_id=session1.id,
        rating=5,
        review_text='He was a good teacher will try to train again.',
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )

    db.session.add(review1)
    db.session.add(review2)
    db.session.add(review3)
    db.session.add(review4)
    db.session.add(review5)
    db.session.commit()


# Uses a raw SQL query to TRUNCATE or DELETE the users table. SQLAlchemy doesn't
# have a built in function to do this. With postgres in production TRUNCATE
# removes all the data from the table, and RESET IDENTITY resets the auto
# incrementing primary key, CASCADE deletes any dependent entities.  With
# sqlite3 in development you need to instead use DELETE to remove all data and
# it will reset the primary keys for you as well.
def undo_reviews():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.reviews RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM reviews"))

    db.session.commit()
