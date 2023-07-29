import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getSessionThunk } from "../../../store/sessions";
import OpenModalButton from "../../OpenModalButton";
import { useParams } from "react-router-dom";
import UpdateSessionModal from "../UpdateSessionModal";
import DeleteSessionModal from "../DeleteSessionModal";
import "./Session.css";

function formatDateAndTime(dateString) {
  const dateObj = new Date(dateString);

  const optionsDate = { year: "numeric", month: "2-digit", day: "2-digit" };
  const optionsTime = { hour: "2-digit", minute: "2-digit" };

  const formattedDate = dateObj.toLocaleDateString(undefined, optionsDate);
  const formattedTime = dateObj.toLocaleTimeString(undefined, optionsTime);

  return { formattedDate, formattedTime };
}

function Session() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const [loaded, setLoaded] = useState(false);
  const sessionData = useSelector((state) => state.sessions);
  const sessionUser = useSelector((state) => state.session.user);
  const { formattedDate, formattedTime } = formatDateAndTime(
    sessionData.session_date
  );

  const userIsOwner =
    sessionUser && sessionData && sessionUser.id === sessionData.owner_id;

  useEffect(() => {
    dispatch(getSessionThunk(id)).then(() => setLoaded(true));
  }, [dispatch, id]);

  if (!sessionData) {
    return null;
  }

  const currentDate = new Date();
  const sessionDate = new Date(sessionData.session_date);
  const isPastSession = sessionDate < currentDate;

  return (
    loaded && (
      <div className="session-container">
        <img
        className="background-image"
        src={require("./mma gloves.jpg").default}
        alt="Background"
      />
        <div className="session-details">
          <div>
            <p className="session-details-title">Session Details:</p>
            <p className="session-details-content">{sessionData.details}</p>
          </div>
          <br />
          <div>
            <p className="session-details-title">Owner/Partner:</p>
            <p className="session-details-content">
              {sessionData.owner.firstName} {sessionData.owner.lastName} ---{" "}
              {sessionData.partner.firstName} {sessionData.partner.lastName}
            </p>
          </div>
        </div>

        <div className="session-info">
          <div>
            <p className="session-info-title1">Gym:</p>
            <p className="session-info-content">{sessionData.gym.name}</p>
          </div>
          <div>
            <p className="session-info-title1">Type:</p>
            <p className="session-info-content">{sessionData.session_type}</p>
          </div>
          <div>
            <p className="session-info-title1">Session Date:</p>
            <p className="session-info-content">
              {formattedDate} {formattedTime}
            </p>
          </div>
        </div>

        <div className="session-header">
          <div className="session-title">
            {userIsOwner && !isPastSession && (
              <ul className="dropdown-content">
                <li>
                  <OpenModalButton
                    buttonText="Update"
                    modalComponent={<UpdateSessionModal id={id} />}
                    key={`update-${id}`}
                    className="update-button"
                  />
                </li>
                <li>
                  <OpenModalButton
                    buttonText="Delete"
                    modalComponent={<DeleteSessionModal id={id} />}
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

export default Session;
