import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getUserById } from "../../store/session";
import { getPartnerReviewsThunk2,resetReviews } from "../../store/reviews";
import { useParams } from "react-router-dom";
import OpenModalButton from "../../components/OpenModalButton";
import CreateMessage from "../../components/Messages/CreateMessage"
import './GetPerson.css'

function convertInchesToFeetAndInches(inches) {
    const feet = Math.floor(inches / 12);
    const remainingInches = inches % 12;
    return `${feet}' ${remainingInches}"`;
  }

function Star({ filled }) {
    return <span>{filled ? '⭐' : '☆'}</span>
  }

  function formatDateAndTime(dateString) {
    const dateObj = new Date(dateString);

    const optionsDate = { year: "numeric", month: "2-digit", day: "2-digit" };
    const optionsTime = { hour: "2-digit", minute: "2-digit" };

    const formattedDate = dateObj.toLocaleDateString(undefined, optionsDate);
    const formattedTime = dateObj.toLocaleTimeString(undefined, optionsTime);

    return { formattedDate, formattedTime };
  }

function Person() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const reviewData = useSelector((state) => state.reviews);
  const user = useSelector((state) => state.session.selectedUser);

  useEffect(() => {
    dispatch(getUserById(id));
    dispatch(resetReviews());
    dispatch(getPartnerReviewsThunk2(id)); // Pass the ID to the thunk
  }, [dispatch, id]);


  if (!user) {
    return <div>Loading...</div>;
  }


  return (
    <div className="background-container">
       <div className="person-container">
      <h1 className="person-name">{user.firstName} {user.lastName}</h1>
      <p className="person-details">City:<br></br> {user.city}</p>
      <p className="person-details">Experience:<br></br> {user.experience}</p>
      <p className="person-details">Height:<br></br> {convertInchesToFeetAndInches(user.height)}</p>
      <p className="person-details">Weight:<br></br> {user.weight}</p>
    </div>
    <div className="message-button">
    <OpenModalButton
            buttonText="Send Message"
            modalComponent={<CreateMessage />}
            className="dashboard-session"
          /></div>
      <div className="partner-reviews">
        <h2 className="section-title1">My Partner's Reviews:</h2>
        {Object.values(reviewData.partnerReviews).map((review) => {
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
        --- {Array(5).fill().map((_, i) => <Star filled={i < review.rating} />)} --- {review.review_text}
    </div>
  );
})}
      </div>
    </div>
  );
}

export default Person;
