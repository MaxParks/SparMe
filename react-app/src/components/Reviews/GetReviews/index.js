import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getReviewsThunk } from "../../../store/reviews";
import "./GetReviews.css";

function Star({ filled }) {
  return (
    <span>{filled ? "★" : "☆"}</span>
  );
}


function formatDateAndTime(dateString) {
    const dateObj = new Date(dateString);

    const optionsDate = { year: "numeric", month: "2-digit", day: "2-digit" };
    const optionsTime = { hour: "2-digit", minute: "2-digit" };

    const formattedDate = dateObj.toLocaleDateString(undefined, optionsDate);
    const formattedTime = dateObj.toLocaleTimeString(undefined, optionsTime);

    return { formattedDate, formattedTime };
  }

function Reviews() {
  const dispatch = useDispatch();

  const reviewData = useSelector((state) => state.reviews);
  const reviewUser = useSelector((state) => state.session.user);


    useEffect(() => {
        dispatch(getReviewsThunk());
      }, [dispatch]);

      if (!reviewData || !reviewData.reviews) {
        return null;
      }

  return (
    <div className="reviews-container">
      <img
        className="background-image"
        src={require("./try this 1.jpg").default}
        alt="Background"
      />
      <div className="user-reviews">
        <h2 className="section-title">My Reviews:</h2>
        {Object.values(reviewData.reviews).map((review) => {
    const { formattedDate, formattedTime } = formatDateAndTime(
        review.session.session_date
      );
  return (
    <div key={review.id} className="review-item">
        <span className="name">
          Session:</span>{" "}
          <br></br>
          {review.session.owner?.firstName} {review.session.owner?.lastName}

        ---{" "}
        <span>
          {review.session.partner?.firstName} {review.session.partner?.lastName}
        </span>{" "}
        --- {review.session.gym?.name} --- {review.session.session_type} ---{" "}
        {formattedDate} - {formattedTime}
        <br></br>
        <br></br>
        <span className="name">
          Review:</span>{" "}
          <br></br>
        {review.reviewer?.firstName} {review.reviewer?.lastName}{" "}
        --- Rating: {Array(5).fill().map((_, i) => <Star filled={i < review.rating} />)} --- Review: {review.review_text}
    </div>
  );
})}

      </div>
    </div>
  );
}

export default Reviews;
