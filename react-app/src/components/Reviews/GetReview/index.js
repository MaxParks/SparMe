import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from "react";
import OpenModalButton from "../../OpenModalButton";
import { useParams } from 'react-router-dom';
import { getReviewThunk } from '../../../store/reviews';
import UpdateReviewModal from '../UpdateReviewModal';
import DeleteReviewModal from '../DeleteReviewModal';
import "./GetReview.css";

function formatDateAndTime(dateString) {
    const dateObj = new Date(dateString);

    const optionsDate = { year: "numeric", month: "2-digit", day: "2-digit" };
    const optionsTime = { hour: "2-digit", minute: "2-digit" };

    const formattedDate = dateObj.toLocaleDateString(undefined, optionsDate);
    const formattedTime = dateObj.toLocaleTimeString(undefined, optionsTime);

    return { formattedDate, formattedTime };
  }

  function Star({ filled }) {
    return <span>{filled ? '⭐' : '☆'}</span>
  }

  function ReviewDetail() {
    const dispatch = useDispatch();
    const { id } = useParams();
    const review = useSelector(state => state.reviews);
    const sessionUser = useSelector((state) => state.session.user);
    const [loaded, setLoaded] = useState(false);
    const history = useHistory();

    const userIsOwner =
    sessionUser && review && sessionUser.id === review.reviewer_id;

    useEffect(() => {
      dispatch(getReviewThunk(id)).then(() => setLoaded(true));
    }, [dispatch, id]);

    if (!review) {
      return null;
    }

    const { formattedDate, formattedTime } = formatDateAndTime(
      review.session?.session_date
    );

    return (
      loaded && (
          <div className="reviews-container">
          <img
            className="background-image"
            src={require("./try this 1.jpg").default}
            alt="Background"
          />
          <div className="user-reviews">
            <h2 className="section-title">Review:</h2>
            <div key={review.id} className="review-item">
                <span className="name">Session:</span><br/>
                {review.session.owner?.firstName} {review.session.owner?.lastName}
                ---{" "}
                <span>
                  {review.session.partner?.firstName} {review.session.partner?.lastName}
                </span>{" "}
                --- {review.session.gym?.name} --- {review.session.session_type} ---{" "}
                {formattedDate} - {formattedTime}
                <br/><br/>
                <span className="name">Review:</span><br/>
                {review.reviewer?.firstName} {review.reviewer?.lastName}{" "}
                --- Rating: {Array(5).fill().map((_, i) => <Star filled={i < review.rating} />)} --- Review: {review.review_text}
            </div>
          </div>
          <div className="session-header">
          <div className="session-title">
            {userIsOwner && (
              <ul className="dropdown-content">
                <li>
                  <OpenModalButton
                    buttonText="Update"
                    modalComponent={<UpdateReviewModal id={id} />}
                    key={`update-${id}`}
                    className="update-button"
                  />
                </li>
                <li>
                  <OpenModalButton
                    buttonText="Delete"
                    modalComponent={<DeleteReviewModal id={id} />}
                    key={`delete-${id}`}
                    className="cancel-button"
                 />
                </li>
              </ul>
            )}
          </div>
        </div>
        </div>
      )
    );
  }

  export default ReviewDetail;
