import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getSessionThunk } from "../../../store/sessions";
import OpenModalButton from "../../OpenModalButton";
import { useParams } from "react-router-dom";
import UpdateSessionModal from "../UpdateSessionModal";
import DeleteSessionModal from "../DeleteSessionModal";
import ProfileButton from "../../Navigation/ProfileButton";
import './Session.css';

function Session() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const sessionData = useSelector((state) => state.sessions);
  const sessionUser = useSelector((state) => state.session.user);

  const userIsOwner = sessionUser && sessionData && sessionUser.id === sessionData.owner_id;

  useEffect(() => {
    dispatch(getSessionThunk(id));
  }, [dispatch, id]);

  if (!sessionData) {
    return null; // Render nothing until the session data is loaded
  }

  return (
    <div className="session-container">
      <div className="session-header">
        <div className="session-title">
          <h3>{sessionData.id}</h3>
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

      <div className="session-details">
        <div>
          <p>Session Details:</p>
          <p>{sessionData.details}</p>
        </div>
        <br />
        <div>
          <p>Owner/Partner:</p>
          <p>
            {sessionData.owner_id} --- {sessionData.partner_id}
          </p>
        </div>
      </div>

      <div className="session-info">
        <div>
          <p>Gym:</p>
          <p>{sessionData.gym_id}</p>
        </div>
        <div>
          <p>Type:</p>
          <p>{sessionData.session_type}</p>
        </div>
        <div>
          <p>Session Date:</p>
          <p>{sessionData.session_date}</p>
        </div>
      </div>

      <br />
    </div>
  );
}

export default Session;
