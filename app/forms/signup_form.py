from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Email, ValidationError
from app.models import User


def user_exists(form, field):
    # Checking if user exists
    email = field.data
    user = User.query.filter(User.email == email).first()
    if user:
        raise ValidationError('Email address is already in use.')


# def username_exists(form, field):
#     # Checking if username is already in use
#     username = field.data
#     user = User.query.filter(User.username == username).first()
#     if user:
#         raise ValidationError('Username is already in use.')


class SignUpForm(FlaskForm):
    # username = StringField(
    #     'username', validators=[DataRequired(), username_exists])
    firstName = StringField('firstName', validators=[DataRequired(message='First name is required.')])
    lastName = StringField('lastName', validators=[DataRequired(message='Last name is required.')])
    email = StringField('email', validators=[DataRequired(message='Email is required.'), Email(), user_exists])
    password = StringField('password', validators=[DataRequired(message='Password is required.')])
    experience = StringField('experience', validators=[DataRequired(message='Experience is required.')])
    city = StringField('city', validators=[DataRequired(message='City name is required.')])
    weight = StringField('weight', validators=[DataRequired(message='Weight is required.')])
    height = StringField('height', validators=[DataRequired(message='Height is required.')])
