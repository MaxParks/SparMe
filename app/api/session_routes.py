from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, User, Session, Gym
from datetime import datetime
from app.forms import SessionForm

session_routes = Blueprint('session_routes', __name__)

def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages

# Get a session by ID
@session_routes.route('/<int:id>', methods=['GET'])
@login_required
def get_session(id):
    session = Session.query.get(id)

    if not session:
        return {"message": "Session not found", "statusCode": 404}, 404

    session_data = session.to_dict()

    return jsonify(session_data), 200

# Get sessions the current user made or is a part of

@session_routes.route('/', methods=['GET'])
@login_required
def get_session_page():

    user = current_user

    # Get sparring sessions for the current user
    user_sessions = Session.query.filter(
    (Session.owner_id == user.id) | (Session.partner_id == user.id)).all()
    sessions_data = [session.to_dict() for session in user_sessions]

    session_data = {
        'id': user.id,
        'firstName': user.firstName,
        'lastName': user.lastName,
        'email': user.email,
        'sessions': sessions_data
    }

    return jsonify(session_data), 200

# Create a Session

@session_routes.route('/', methods=['POST'])
@login_required
def create_session():

    form = SessionForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():

        partner = User.query.filter_by(firstName=form.data['partner_first_name'], lastName=form.data['partner_last_name']).first()
        gym = Gym.query.filter_by(name=form.data['gym_name']).first()

        if not partner or not gym:
            return {'errors': ['Invalid partner name or gym name']}, 400

        session = Session(
            partner_id=partner.id,
            gym_id=gym.id,
            session_type=form.data['session_type'],
            session_date=form.data['session_date'],
            details=form.data['details']
        )
        db.session.add(session)
        db.session.commit()
        return jsonify(session.to_dict()), 201
    return {'errors': validation_errors_to_error_messages(form.errors)}, 400

# Update a Session
@session_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_session(id):
    session = Session.query.get(id)
    if not session:
        return {"message": "Session not found", "statusCode": 404}, 404

    if current_user.id != session.owner_id:
        return {"message": "Unauthorized", "statusCode": 403}, 403

    form = SessionForm()

    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():

        session.gym_id = form.data['gym_id']
        session.session_type = form.data['session_type']
        session.session_date = form.data['session_date']
        session.details = form.data['details']
        session.updated_at = datetime.utcnow()

        db.session.commit()

        return jsonify(session.to_dict()), 200

    return {'errors': validation_errors_to_error_messages(form.errors)}, 400

# Delete a Session
@session_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_session(id):
    session = Session.query.get(id)
    if not session:
        return {"message": "Session not found", "statusCode": 404}, 404

    if current_user.id != session.owner_id:
        return {"message": "Unauthorized", "statusCode": 403}, 403

    db.session.delete(session)
    db.session.commit()
    return {"message": "Session deleted successfully", "statusCode": 204}, 204
