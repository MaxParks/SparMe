from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired
from app.models import Message
from datetime import datetime

class MessageForm(FlaskForm):
    receiver_id = StringField('receiver_id', validators=[DataRequired(message='A Receiver is required.')])
    message_text = StringField('message_text', validators=[DataRequired(message='A message text is required.')])

class UpdateMessageForm(FlaskForm):
    message_text = StringField('message_text', validators=[DataRequired(message='A message text is required.')])
