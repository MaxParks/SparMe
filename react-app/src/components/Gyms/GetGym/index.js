import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getGymThunk } from "../../../store/gyms";
import OpenModalButton from "../../OpenModalButton";
// import UpdateSessionModal from "../UpdateSessionModal";
// import DeleteSessionModal from "../DeleteSessionModal";
import "./Gym.css";

function Gym() {
  const dispatch = useDispatch();
  const { id } = useParams();

  const [loaded, setLoaded] = useState(false);
  const gymData = useSelector((state) => state.gyms);
  const sessionUser = useSelector((state) => state.session.user);

  const userIsOwner =
    sessionUser && gymData && sessionUser.id === gymData.owner_id;

  useEffect(() => {
    dispatch(getGymThunk(id)).then(() => setLoaded(true));
  }, [dispatch, id]);

  if (!gymData) {
    return null;
  }

  return (
    loaded && (
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
        {/* {sessionUser && (
          <ul className="dropdown-content">
            <li>
              <OpenModalButton
                buttonText="Update"
                modalComponent={<UpdateSessionModal id={id} />}
                key={`update-${id}`}
                className="session-button"
              />
            </li>
            <li>
              <OpenModalButton
                buttonText="Delete"
                modalComponent={<DeleteSessionModal id={id} />}
                key={`delete-${id}`}
                className="session-button"
              />
            </li>
          </ul>
        )} */}
      </div>
    )
  );

}

export default Gym;
