from flask_wtf import FlaskForm
from wtforms import StringField, IntegerField
from wtforms.validators import DataRequired, ValidationError
from app.models import Review
from datetime import datetime

class ReviewForm(FlaskForm):
    session_id = StringField('session', validators=[DataRequired(message='A Session is required.')])
    rating = StringField('rating',validators=[DataRequired(message='A Rating is required.')])
    review_text = StringField('review_text',validators=[DataRequired(message='A Summary is required.')])

class UpdateReviewForm(FlaskForm):
    rating = StringField('rating',validators=[DataRequired(message='A Rating is required.')])
    review_text = StringField('review_text',validators=[DataRequired(message='A Summary is required.')])
