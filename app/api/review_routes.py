from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, User, Session, Review
from datetime import datetime
from app.forms import review_form

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

# Create a review
@review_routes.route('/', methods=['POST'])
@login_required
def create_review():
    form = review_form()
    form['csrf_token'].data = request.cookies['csrf_token']
    if form.validate_on_submit():
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

    form = review_form()
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
