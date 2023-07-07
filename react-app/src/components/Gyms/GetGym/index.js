import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { getGymThunk, joinGymThunk } from "../../../store/gyms";
import OpenModalButton from "../../OpenModalButton";
import UpdateGymModal from "../UpdateGymModal";
import DeleteGymModal from "../DeleteGymModal";
import "./Gym.css";

function Gym() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const history = useHistory();

  const gymData = useSelector((state) => state.gyms);
  const sessionUser = useSelector((state) => state.session.user);
  const gymMembers = gymData?.members;
  const userIsOwner =
    sessionUser &&
    gymData &&
    gymData.owner_id &&
    sessionUser.id === gymData.owner_id;
  const userIsMember =
    sessionUser &&
    gymData &&
    gymData.user_gyms &&
    gymData.user_gyms.some((userGym) => userGym.gym_id === gymData.id);

  useEffect(() => {
    dispatch(getGymThunk(id));
  }, [dispatch, id]);

  const joinGym = async () => {
    if (!userIsOwner && !userIsMember) {
      await dispatch(joinGymThunk(id));
      history.push(`/gyms/`);
    }
  };

  if (!gymData) {
    return <div>Loading...</div>; // Add a loading state
  }

  return (
    <div className="gym-container">
      <div className="gym-item1">
        <p className="gym-title">Gym:</p>
        <p className="gym-info">{gymData.name}</p>
      </div>
      <div className="gym-item1">
        <p className="gym-title">City:</p>
        <p className="gym-info">{gymData.city}</p>
      </div>
      <div className="gym-item1">
        <p className="gym-title">Martial Art:</p>
        <p className="gym-info">{gymData.martial_art}</p>
      </div>
      {!userIsOwner && !userIsMember && (
        <button className="join-gym-button" onClick={joinGym}>
          Join Gym
        </button>
      )}
      {userIsOwner && (
        <ul className="dropdown-content">
          <li>
            <OpenModalButton
              buttonText="Update"
              modalComponent={<UpdateGymModal id={id} />}
              key={`update-${id}`}
              className="session-button"
            />
          </li>
          <li>
            <OpenModalButton
              buttonText="Delete"
              modalComponent={<DeleteGymModal id={id} />}
              key={`delete-${id}`}
              className="session-button"
            />
          </li>
        </ul>
      )}
      <div>
  <h2>Members:</h2>
  <ul>
    <li>
      <strong>Owner: </strong>
      {`${gymData.owner?.firstName} ${gymData.owner?.lastName}`}
    </li>
    {gymMembers &&
      gymMembers.map((member) => (
        member.id !== gymData.owner_id && (
          <li key={member.id}>
            {`${member.user.firstName} ${member.user.lastName}`}
          </li>
        )
      ))}
      {/* <h2>Upcoming Sparring Sessions:</h2>
  <ul>
    {gymData.sessions &&
      gymData.sessions.map((session) => (
        <li key={session.id}>
          <a href={`/sessions/${session.id}`}>
            {session.id} {session.details}
          </a>
        </li>
      ))}
  </ul> */}
  </ul>
</div>
    </div>
  );
}

export default Gym;
