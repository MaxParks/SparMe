from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField, DateField, DateTimeField
from wtforms.validators import DataRequired, ValidationError
from app.models import Session
from datetime import datetime

class SessionForm(FlaskForm):
    gym_id = StringField('gym_id', validators=[DataRequired(message='A Gym is required.')])
    session_type = StringField('session_type',validators=[DataRequired(message='A type is required.')])
    session_date = DateTimeField('session_date', validators=[DataRequired(message='A session date is required.')])
    details = StringField('details', validators=[DataRequired(message='Details are required.')])
