import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { getGymThunk, joinGymThunk, leaveGymThunk } from "../../../store/gyms";
import OpenModalButton from "../../OpenModalButton";
import UpdateGymModal from "../UpdateGymModal";
import DeleteGymModal from "../DeleteGymModal";
import "./Gym.css";

function formatDateAndTime(dateString) {
  const dateObj = new Date(dateString);

  const optionsDate = { year: "numeric", month: "2-digit", day: "2-digit" };
  const optionsTime = { hour: "2-digit", minute: "2-digit" };

  const formattedDate = dateObj.toLocaleDateString(undefined, optionsDate);
  const formattedTime = dateObj.toLocaleTimeString(undefined, optionsTime);

  return { formattedDate, formattedTime };
}

function Gym() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const history = useHistory();

  const gymData = useSelector((state) => state.gyms);
  const sessionUser = useSelector((state) => state.session.user);
  const gymMembers = gymData?.members;
  const gymSessions = gymData?.sessions;
  const userIsOwner =
    sessionUser &&
    gymData &&
    gymData.owner_id &&
    sessionUser.id === gymData.owner_id;

  const userIsMember =
  sessionUser &&
  gymData &&
  gymData.members &&
  gymData.members.some((member) => member.user && member.user.id === sessionUser.id);
  const [showDetailsMap, setShowDetailsMap] = useState({});

console.log('userIsOwner:', userIsOwner);
console.log('userIsMember:', userIsMember);
console.log('gymData:', gymData);


  const toggleDetails = (sessionId) => {
    setShowDetailsMap((prevShowDetailsMap) => {
      const newState = { ...prevShowDetailsMap };
      newState[sessionId] = !newState[sessionId];
      return newState;
    });
  };

  useEffect(() => {
    dispatch(getGymThunk(id));
  }, [dispatch, id]);

  const joinGym = async () => {
    if (!userIsOwner && !userIsMember) {
      await dispatch(joinGymThunk(id));
      history.push(`/gyms/`);
    }
  };

  const leaveGym = async () => {
    await dispatch(leaveGymThunk(id));
    history.push(`/gyms/`);
  };

  if (!gymData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="session-container">
      <img
        className="background-image"
        src={require("./boxing gym.jpg").default}
        alt="Background"
      />
      <div className="session-details">
  <div className="details-box">
    <p className="session-details-title">Gym:</p>
    <p className="session-details-content">{gymData.name}</p>
  </div>
  <br></br>
  <div className="details-box">
    <p className="session-details-title">City:</p>
    <p className="session-details-content">{gymData.city}</p>
  </div>
  <br></br>
  <div className="details-box">
    <p className="session-details-title">Martial Art:</p>
    <p className="session-details-content">{gymData.martial_art}</p>
  </div>
</div>

      {!userIsOwner && !userIsMember && (
        <button className="update-button" onClick={joinGym}>
          Join Gym
        </button>
      )}
      <br></br>
      {userIsMember && !userIsOwner && (
  <button className="cancel-button" onClick={leaveGym}>
    Leave Gym
  </button>
)}
      {userIsOwner && (
        <ul className="dropdown-content">
          <li>
            <OpenModalButton
              buttonText="Update"
              modalComponent={<UpdateGymModal id={id} />}
              key={`update-${id}`}
              className="update-button"
            />
          </li>
          <li>
            <OpenModalButton
              buttonText="Delete"
              modalComponent={<DeleteGymModal id={id} />}
              key={`delete-${id}`}
              className="cancel-button"
            />
          </li>
        </ul>
      )}

    <div className="gym-members-container">
      <h1 className="session-info-title">Members:</h1>
      <div className="gym-sessions-container">
        <ul>
          <p>
            <strong>Owner: </strong>
            {`${gymData.owner?.firstName} ${gymData.owner?.lastName}`}
          </p>
          {gymMembers &&
            gymMembers.map(
              (member) =>
                member.id !== gymData.owner_id && (
                  <p key={member.id}>
                    {`${member.user.firstName} ${member.user.lastName}`}
                  </p>
                )
            )}
        </ul>
        <br></br>
        </div>
      </div>

      <h1 className="session-info-title">Sessions:</h1>
{ (userIsOwner || userIsMember) ? (
  <div className="gym-sessions-container1">
    {gymSessions &&
      gymSessions.map((session) => {
        const { formattedDate, formattedTime } = formatDateAndTime(
          session.session_date
        );

        const showDetails = showDetailsMap[session.id] || false;

        return (
          <div className="session-item" key={session.id}>
            <a href={`/sessions/${session.id}`}>Session {session.id}</a>
            <br></br>
            <button onClick={() => toggleDetails(session.id)}>
              {showDetails ? "Hide Details" : "Show Details"}
            </button>
            {showDetails && (
              <div>
                <p>
                  Owner: {session.owner.firstName} {session.owner.lastName}
                </p>
                <p>
                  Partner: {session.partner.firstName}{" "}
                  {session.partner.lastName}
                </p>
                <p>Session Type: {session.session_type}</p>
                <p>
                  Session Date: {formattedDate} {formattedTime}
                </p>
                <p>Details: {session.details}</p>
              </div>
            )}
          </div>
        );
      })}
  </div>
) : (
  <p className="not-session-item">You can only see Sessions if you are the Owner or a Member of this gym</p>
)}


    </div>
  );
}

export default Gym;
