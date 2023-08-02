from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, User, Message
from datetime import datetime
from app.forms import MessageForm

message_routes = Blueprint('message_routes', __name__)

def validation_errors_to_error_messages(validation_errors):
    """
    Simple function that turns the WTForms validation errors into a simple list
    """
    errorMessages = []
    for field in validation_errors:
        for error in validation_errors[field]:
            errorMessages.append(f'{field} : {error}')
    return errorMessages

# Get a message by ID
@message_routes.route('/<int:id>', methods=['GET'])
@login_required
def get_message(id):
    message = Message.query.get(id)

    if not message:
        return {"message": "Message not found", "statusCode": 404}, 404

    message_data = message.to_dict()

    return jsonify(message_data), 200

# Get messages the current user sent or received

@message_routes.route('/', methods=['GET'])
@login_required
def get_message_page():

    user = current_user

    # Get all messages for the current user
    user_messages = Message.query.filter(
    (Message.sender_id == user.id) | (Message.receiver_id == user.id)).all()
    messages_data = [message.to_dict() for message in user_messages]

    message_data = {
        'id': user.id,
        'firstName': user.firstName,
        'lastName': user.lastName,
        'email': user.email,
        'messages': messages_data
    }

    return jsonify(message_data), 200

@message_routes.route('/conversation/<int:user_id>', methods=['GET'])
@login_required
def get_user_messages(user_id):

    user = current_user

    # Get all messages between the current user and the other user
    user_messages = Message.query.filter(
    ((Message.sender_id == user.id) & (Message.receiver_id == user_id)) |
    ((Message.sender_id == user_id) & (Message.receiver_id == user.id))).all()

    messages_data = [message.to_dict() for message in user_messages]

    message_data = {
        'id': user.id,
        'firstName': user.firstName,
        'lastName': user.lastName,
        'email': user.email,
        'messages': messages_data
    }

    return jsonify(message_data), 200

# Create a Message

@message_routes.route('/', methods=['POST'])
@login_required
def create_message():

    form = MessageForm()
    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():

        receiver_id = form.data['receiver_id']

        receiver = User.query.get(receiver_id)

        if not receiver:
            return {'errors': ['Invalid receiver name']}, 400

        message = Message(
            sender_id=current_user.id,
            receiver_id=receiver.id,
            message_text=form.data['message_text'],
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )

        db.session.add(message)
        db.session.commit()
        return jsonify(message.to_dict()), 201
    return {'errors': validation_errors_to_error_messages(form.errors)}, 400

# Update a Message
@message_routes.route('/<int:id>', methods=['PUT'])
@login_required
def update_message(id):
    message = Message.query.get(id)
    if not message:
        return {"message": "Message not found", "statusCode": 404}, 404

    if current_user.id != message.sender_id:
        return {"message": "Unauthorized", "statusCode": 403}, 403

    form = MessageForm()

    form['csrf_token'].data = request.cookies['csrf_token']

    if form.validate_on_submit():

        message.message_text = form.data['message_text']
        message.updated_at = datetime.utcnow()

        db.session.commit()

        return jsonify(message.to_dict()), 200

    return {'errors': validation_errors_to_error_messages(form.errors)}, 400

# Delete a Message
@message_routes.route('/<int:id>', methods=['DELETE'])
@login_required
def delete_message(id):
    message = Message.query.get(id)
    if not message:
        return {"message": "Message not found", "statusCode": 404}, 404

    if current_user.id != message.sender_id:
        return {"message": "Unauthorized", "statusCode": 403}, 403

    db.session.delete(message)
    db.session.commit()
    return {"message": "Message deleted successfully", "statusCode": 204}, 204
