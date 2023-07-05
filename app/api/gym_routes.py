from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, User, Session, Gym
from datetime import datetime
from app.forms import GymForm

gym_routes = Blueprint('gym_routes', __name__)

def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages

# Get a Gym by ID
@gym_routes.route('/<int:id>', methods=['GET'])
@login_required
def get_gym(id):
    gym = Gym.query.get(id)

    if not gym:
        return {"message": "Gym not found", "statusCode": 404}, 404

    return jsonify(gym.to_dict()), 200

# Get all gyms and also all owned or associated with the current user
@gym_routes.route('/', methods=['GET'])
@login_required
def get_user_gyms():
    user = current_user

    owned_gyms = Gym.query.filter_by(owner_id=user.id).all()
    associated_gyms = Gym.query.join(Gym.user_gyms).filter_by(user_id=user.id).all()

    all_gyms = Gym.query.all()

    owned_gyms_data = [gym.to_dict() for gym in owned_gyms]
    associated_gyms_data = [gym.to_dict() for gym in associated_gyms]
    all_gyms_data = [gym.to_dict() for gym in all_gyms]

    gyms_data = {
        'owned_gyms': owned_gyms_data,
        'associated_gyms': associated_gyms_data,
        'gyms': all_gyms_data
    }

    return jsonify(gyms_data), 200

# Create a Gym
@gym_routes.route('/', methods=['POST'])
@login_required
def create_gym():
    form = GymForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        gym = Gym(
            owner_id=current_user.id,
            name=form.data['name'],
            city=form.data['city'],
            martial_art=form.data['martial_art']
        )
        db.session.add(gym)
        db.session.commit()
        return jsonify(gym.to_dict()), 201
    return {'errors': validation_errors_to_error_messages(form.errors)}, 400

# Update a Gym
@gym_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_gym(id):
    gym = Gym.query.get(id)
    if not gym:
        return {"message": "Gym not found", "statusCode": 404}, 404

    if current_user.id != gym.owner_id:
        return {"message": "Unauthorized", "statusCode": 403}, 403

    form = GymForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():
        gym.name = form.data['name']
        gym.city = form.data['city']
        gym.martial_art = form.data['martial_art']
        db.session.commit()
        return jsonify(gym.to_dict()), 200

    return {'errors': validation_errors_to_error_messages(form.errors)}, 400

# Delete a Gym
@gym_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_gym(id):
    gym = Gym.query.get(id)
    if not gym:
        return {"message": "Gym not found", "statusCode": 404}, 404

    if current_user.id != gym.owner_id:
        return {"message": "Unauthorized", "statusCode": 403}, 403

    db.session.delete(gym)
    db.session.commit()
    return {"message": "Gym deleted successfully", "statusCode": 204}, 204
