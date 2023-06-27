import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getSessionThunk } from "../../../store/sessions";
import OpenModalButton from "../../OpenModalButton";
import { getGymThunk} from "../../../store/gyms";
import { getUserById } from "../../../store/session";
import UpdateSessionModal from "../UpdateSessionModal";
import DeleteSessionModal from "../DeleteSessionModal"
import ProfileButton from "../../Navigation/ProfileButton";
import { useParams } from "react-router-dom";
import './Session.css';

function Session({ isLoaded }) {
  const dispatch = useDispatch();
  const { id } = useParams();

  const sessionData = useSelector((state) => state.sessions);
  const sessionUser = useSelector((state) => state.session.user);

  const [modalButtonsVisible, setModalButtonsVisible] = useState(false);

  const userIsOwner = sessionUser.id === sessionData.owner_id;

  useEffect(() => {
    dispatch(getSessionThunk(id));
  }, [dispatch, id]);

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
        <ProfileButton user={sessionUser} />
      </div>

      <div className="session-details">
        <div>
          <p>Session Details:</p>
          <p>{sessionData && sessionData.details}</p>
        </div>
        <br />
        <div>
          <p>Owner/Partner:</p>
          <p>
            {sessionData && sessionData.owner_id} ---{" "}
            {sessionData && sessionData.partner_id}
          </p>
        </div>
      </div>

      <div className="session-info">
        <div>
          <p>Gym:</p>
          <p>{sessionData && sessionData.gym_id}</p>
        </div>
        <div>
          <p>Type:</p>
          <p>{sessionData && sessionData.session_type}</p>
        </div>
        <div>
          <p>Session Date:</p>
          <p>{sessionData && sessionData.session_date}</p>
        </div>
      </div>

      <br />
    </div>
  );
}

export default Session;
