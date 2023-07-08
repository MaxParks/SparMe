from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, User, Session, Gym, UserGym
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

    gym_data = gym.to_dict()
    members = [user_gym.to_dict() for user_gym in gym.user_gyms]
    sessions = [sessions.to_dict() for sessions in gym.sessions]

    # Check if the current user is the owner of the gym
    if current_user.id == gym.owner_id:
        owner_data = current_user.to_dict()
        owner_data['is_owner'] = True
        members.append(owner_data)

    gym_data['members'] = members
    gym_data['sessions'] = sessions

    return jsonify(gym_data), 200


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

@gym_routes.route('/join_gym', methods=['POST'])
@login_required
def join_gym():
    # Retrieve the user ID and gym ID from the request
        user_id = current_user.id
        gym_id = request.json['gym_id']

        # Retrieve the user and gym objects from the database
        user = User.query.get(user_id)
        gym = Gym.query.get(gym_id)

        if not gym:
            return {"message": "Gym not found", "statusCode": 404}, 404

        # Check if the user is already associated with the gym
        if UserGym.query.filter_by(user_id=user_id, gym_id=gym_id).first():
            return {"message": "User is already associated with the gym", "statusCode": 400}, 400

        # Create a new UserGym object and associate the user and gym
        user_gym = UserGym(user_id=user_id, gym_id=gym_id)

        # Save the UserGym object to the database
        db.session.add(user_gym)
        db.session.commit()

        return {"message": "Successfully joined the gym", "statusCode": 200}, 200



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
