from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired, ValidationError
from app.models import Gym
from datetime import datetime

class GymForm(FlaskForm):
    name = StringField('name', validators=[DataRequired(message='A name is required.')])
    city = StringField('city', validators=[DataRequired(message='A city is required.')])
    martial_art = StringField('martial_art',validators=[DataRequired(message='A Martial Art is required.')])
