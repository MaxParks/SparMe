from flask import Blueprint, jsonify
from flask_login import login_required, current_user
from app.models import db, User, Session, Gym
from datetime import date, timedelta

dashboard_routes = Blueprint('dashboard_routes', __name__)

@dashboard_routes.route('/', methods=['GET'])
@login_required
def get_user_dashboard():

    user = current_user

  # Get all users
    all_users = User.query.all()
    users_data = [user.to_dict() for user in all_users]

    # Get all Gyms
    all_gyms = Gym.query.all()
    gyms_data = [gym.to_dict() for gym in all_gyms]

    # Get sparring sessions for the current user
    user_sessions = Session.query.filter(
    (Session.owner_id == user.id) | (Session.partner_id == user.id)).all()
    sessions_data = [session.to_dict() for session in user_sessions]

    dashboard_data = {
        'id': user.id,
        'firstName': user.firstName,
        'lastName': user.lastName,
        'email': user.email,
        'allUsers': users_data,
        'sessions': sessions_data,
        'allGyms': gyms_data
    }

    return jsonify(dashboard_data), 200
