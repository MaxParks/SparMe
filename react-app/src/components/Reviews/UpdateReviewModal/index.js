import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../../context/Modal";
import { updateReviewThunk,getReviewThunk } from "../../../store/reviews";
import { useHistory } from "react-router-dom";

function formatDateAndTime(dateString) {
    const dateObj = new Date(dateString);

    const optionsDate = { year: "numeric", month: "2-digit", day: "2-digit" };
    const optionsTime = { hour: "2-digit", minute: "2-digit" };

    const formattedDate = dateObj.toLocaleDateString(undefined, optionsDate);
    const formattedTime = dateObj.toLocaleTimeString(undefined, optionsTime);

    return { formattedDate, formattedTime };
  }

function UpdateReviewModal({ id }) {
  const dispatch = useDispatch();
  const [session, setSession] = useState(null);
  const [rating, setRating] = useState("");
  const [review_text, setReviewText] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();
  const history = useHistory();

  const review = useSelector((state) => state.reviews);
  const currentUser = useSelector((state) => state.session.user);

  const { formattedDate, formattedTime } = formatDateAndTime(
    review.session.session_date
  );


  useEffect(() => {
    if (!review) {
      dispatch(getReviewThunk(id));
    }
  }, [dispatch, id, session]);

  useEffect(() => {
    if (review) {
      setSession(review.session)
      setRating(review.rating);
      setReviewText(review.review_text);
    }
  }, [review]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!session) {
      errors.session = "Session is a required field.";
    }
    if (!rating) {
      errors.rating = "Rating is a required field.";
    }
    if (!review_text) {
      errors.review_text = "Review text is a required field.";
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    setErrors({});

    const updatedReview = {
        rating,
        review_text,
      };

    const data = await dispatch(updateReviewThunk(id, updatedReview));

    if (Array.isArray(data)) {
      setErrors({ general: data });
    } else if (data && data.id) {
      dispatch(getReviewThunk(id));
      closeModal();
      history.push(`/reviews/${id}`);
    } else {
      closeModal();
    }
  };

  return (
    <div>
      <h2>Update Review</h2>
      <form onSubmit={handleSubmit}>
        <ul className="error-list">
          {errors.session && <li>{errors.session}</li>}
          {errors.rating && <li>{errors.rating}</li>}
          {errors.review_text && <li>{errors.review_text}</li>}
          {errors.general && errors.general.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>

        <div className="form-field">
        <input
        type="text"
        id="session_id"
        placeholder={`Session: ${review.session.gym.name}-${review.session.owner.firstName}-${review.session.partner.firstName}-${formattedDate} ${formattedTime}`}
        disabled
        style={{ width: '400px' }}
        />

        </div>
        <div className="form-field">
          <input
            type="number"
            id="rating"
            name="rating"
            min="1"
            max="5"
            placeholder="Rating"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          />
        </div>
        <div className="form-field">
          <textarea
            type="text"
            id="review_text"
            name="review_text"
            placeholder="Review text"
            value={review_text}
            onChange={(e) => setReviewText(e.target.value)}
          />
        </div>
        <div className="button-container">
          <button type="submit" className="update-button">
            Update
          </button>
          <button type="button" className="cancel-button" onClick={closeModal}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateReviewModal;
