from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, User, Session, Review
from datetime import datetime
from app.forms import ReviewForm,UpdateReviewForm

review_routes = Blueprint('review_routes', __name__)

# Helper function
def validation_errors_to_error_messages(validation_errors):
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages

# Get a review by ID
@review_routes.route('/<int:id>', methods=['GET'])
@login_required
def get_review(id):
    review = Review.query.get(id)
    if not review:
        return {"message": "Review not found", "statusCode": 404}, 404
    return jsonify(review.to_dict()), 200

# Get all reviews by current user
@review_routes.route('/', methods=['GET'])
@login_required
def get_user_reviews():
    user_reviews = Review.query.filter_by(reviewer_id=current_user.id).all()
    user_reviews_data = [review.to_dict() for review in user_reviews]
    return jsonify(user_reviews_data), 200

# Get all partner reviews for the current user
@review_routes.route('/partner', methods=['GET'])
@login_required
def get_partner_reviews():
    # Get all sessions that the current user was a part of
    user_sessions = Session.query.filter(
        (Session.owner_id == current_user.id) | (Session.partner_id == current_user.id)
    ).all()

    # Get all reviews for these sessions, excluding reviews made by the current user
    partner_reviews = Review.query.filter(
        Review.session_id.in_([session.id for session in user_sessions]),
        Review.reviewer_id != current_user.id
    ).all()

    partner_reviews_data = [review.to_dict() for review in partner_reviews]
    return jsonify(partner_reviews_data), 200

@review_routes.route('/partner/<int:user_id>', methods=['GET'])
@login_required
def get_partner_reviews2(user_id):
    # Find the user by the provided ID
    user = User.query.get(user_id)
    if not user:
        return {"message": "User not found", "statusCode": 404}, 404

    # Get all sessions that the specified user was a part of
    user_sessions = Session.query.filter(
        (Session.owner_id == user_id) | (Session.partner_id == user_id)
    ).all()

    # Get all reviews for these sessions, excluding reviews made by the user
    partner_reviews = Review.query.filter(
        Review.session_id.in_([session.id for session in user_sessions]),
        Review.reviewer_id != user_id
    ).all()

    partner_reviews_data = [review.to_dict() for review in partner_reviews]
    return jsonify(partner_reviews_data), 200

# Create a review
@review_routes.route('/', methods=['POST'])
@login_required
def create_review():
    form = ReviewForm()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
        # Check if the user has already reviewed this session
        existing_review = Review.query.filter_by(session_id=form.data['session_id'], reviewer_id=current_user.id).first()

        if existing_review:
            return {'errors': ['You have already reviewed this session.']}, 400
        review = Review(
            reviewer_id=current_user.id,
            session_id=form.data['session_id'],
            rating=form.data['rating'],
            review_text=form.data['review_text'],
        )
        db.session.add(review)
        db.session.commit()
        return jsonify(review.to_dict()), 201
    return {'errors': validation_errors_to_error_messages(form.errors)}, 400

# Update a review
@review_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_review(id):
    review = Review.query.get(id)
    if not review:
        return {"message": "Review not found", "statusCode": 404}, 404

    if current_user.id != review.reviewer_id:
        return {"message": "Unauthorized", "statusCode": 403}, 403

    form = UpdateReviewForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        review.rating = form.data['rating']
        review.review_text = form.data['review_text']
        db.session.commit()
        return jsonify(review.to_dict()), 200

    return {'errors': validation_errors_to_error_messages(form.errors)}, 400

# Delete a review
@review_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_review(id):
    review = Review.query.get(id)
    if not review:
        return {"message": "Review not found", "statusCode": 404}, 404

    if current_user.id != review.reviewer_id:
        return {"message": "Unauthorized", "statusCode": 403}, 403

    db.session.delete(review)
    db.session.commit()
    return {"message": "Review deleted successfully", "statusCode": 204}, 204
