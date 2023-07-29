import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../../context/Modal";
import { createReviewThunk } from "../../../store/reviews";
import { getSessionsThunk } from "../../../store/sessions";
import { useHistory } from "react-router-dom";
import './CreateReviewModal.css';

function formatDateAndTime(dateString) {
    const dateObj = new Date(dateString);

    const optionsDate = { year: "numeric", month: "2-digit", day: "2-digit" };
    const optionsTime = { hour: "2-digit", minute: "2-digit" };

    const formattedDate = dateObj.toLocaleDateString(undefined, optionsDate);
    const formattedTime = dateObj.toLocaleTimeString(undefined, optionsTime);

    return { formattedDate, formattedTime };
  }

function CreateReviewModal(isLoaded) {
  const dispatch = useDispatch();
  const [session, setSession] = useState(null);
  const [rating, setRating] = useState("");
  const [review_text, setReviewText] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();
  const history = useHistory();

  const allSessions = useSelector((state) => state.sessions.sessions);
  const allReviews = useSelector((state) => state.reviews.reviews);
  const currentUser = useSelector((state) => state.session.user);

  const sessionsNotReviewed = allSessions?.filter((session) => {
    // Get the session's date as a Date object
    const sessionDate = new Date(session.session_date);

    // Check if the session's date is in the past compared to the current date
    const isPastSession = sessionDate.getTime() < Date.now();

    // Check if the user has already reviewed this session
    const hasReviewed = Object.values(allReviews).some((review) => {
      return (
        review.session_id === session.id && review.reviewer_id === currentUser.id
      );
    });

    // Return true only if it's a past session and the user has not reviewed it yet
    return isPastSession && !hasReviewed;
  });



  useEffect(() => {
    dispatch(getSessionsThunk());
  }, [dispatch]);

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

    const data = await dispatch(createReviewThunk(session.id, rating, review_text));

    if (Array.isArray(data)) {
      setErrors({ general: data });
    } else if (data && data.id) {
      closeModal();
      history.push(`/reviews`);
    } else {
      closeModal();
    }
  };

  return (
    <div>
      <h2>Create Review</h2>
      <form onSubmit={handleSubmit}>
        <ul className="error-list">
          {errors.session && <li>{errors.session}</li>}
          {errors.rating && <li>{errors.rating}</li>}
          {errors.review_text && <li>{errors.review_text}</li>}
          {errors.general && errors.general.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>

        <div className="form-field">
        <select
  id="session_id"
  value={session ? session.id : ""}
  onChange={(e) => {
    const selectedSession = allSessions.find((session) => session.id === Number(e.target.value));
    setSession(selectedSession);
  }}
>
<option value="">Select Session</option>
  {sessionsNotReviewed?.map((session) => {
    const { formattedDate, formattedTime } = formatDateAndTime(
      session.session_date
    );
    return (
      <option key={session.id} value={session.id}>
       {session.owner.firstName} - {session.partner.firstName} - {session.gym.name} - {session.session_type} - {formattedDate} - {formattedTime}
      </option>
    );
  })}
</select>

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
            Create
          </button>
          <button type="button" className="cancel-button" onClick={closeModal}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateReviewModal;
