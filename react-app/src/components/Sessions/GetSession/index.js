import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getSessionThunk } from "../../../store/sessions";
import OpenModalButton from "../../OpenModalButton";
import { useParams } from "react-router-dom";
import UpdateSessionModal from "../UpdateSessionModal";
import DeleteSessionModal from "../DeleteSessionModal";
import ProfileButton from "../../Navigation/ProfileButton";
import './Session.css';

function formatDateAndTime(dateString) {
  const dateObj = new Date(dateString);

  const optionsDate = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const optionsTime = { hour: '2-digit', minute: '2-digit' };

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
  const { formattedDate, formattedTime } = formatDateAndTime(sessionData.session_date);

  const userIsOwner = sessionUser && sessionData && sessionUser.id === sessionData.owner_id;

  useEffect(() => {
    dispatch(getSessionThunk(id)).then(() => setLoaded(true));
  }, [dispatch, id]);

  if (!sessionData) {
    return null;
  }

  return loaded && (
    <div className="session-container">
      <div className="session-details">
        <div>
          <p>Session Details:</p>
          <p>{sessionData.details}</p>
        </div>
        <br />
        <div>
          <p>Owner/Partner:</p>
          <p>
            {sessionData.owner.firstName} {sessionData.owner.lastName} --- {sessionData.partner.firstName} {sessionData.partner.lastName}
          </p>
        </div>
      </div>

      <div className="session-info">
        <div>
          <p>Gym:</p>
          <p>{sessionData.gym.name}</p>
        </div>
        <div>
          <p>Type:</p>
          <p>{sessionData.session_type}</p>
        </div>
        <div>
          <p>Session Date:</p>
          <p>{formattedDate} {formattedTime}</p>
        </div>
      </div>

      <div className="session-header">
        <div className="session-title">
          {userIsOwner && (
            <ul className="dropdown-content">
              <li>
                <OpenModalButton
                  buttonText="Update"
                  modalComponent={<UpdateSessionModal id={id} />}
                  key={`update-${id}`}
                  className="session"
                />
              </li>
              <li>
                <OpenModalButton
                  buttonText="Delete"
                  modalComponent={<DeleteSessionModal id={id} />}
                  key={`delete-${id}`}
                  className="session"
                />
              </li>
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default Session;
