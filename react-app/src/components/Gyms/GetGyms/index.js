import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getGymsThunk } from "../../../store/gyms";
import './GetGyms.css'
import OpenModalButton from "../../OpenModalButton";
import CreateGymModal from "../AddGymModal";

function Gyms() {
  const dispatch = useDispatch();

  const gymsData = useSelector((state) => state.gyms);
  const sessionUser = useSelector((state) => state.session.user);

  useEffect(() => {
    dispatch(getGymsThunk());
  }, [dispatch]);

  const ownedGyms = gymsData.owned_gyms || [];
  const associatedGyms = gymsData.associated_gyms || [];

  const userGyms = [...ownedGyms, ...associatedGyms].reduce(
    (acc, gym) => {
      if (!acc.find((g) => g.id === gym.id)) {
        acc.push(gym);
      }
      return acc;
    },
    []
  );

  const allGyms = gymsData.gyms || [];

  return (
    <div className="gyms-container">
      <img
        className="background-image"
        src={require("./boxing gym.jpg").default}
        alt="Background"
      />
        <OpenModalButton
        buttonText="Create a Gym"
        modalComponent={<CreateGymModal />}
        className="session-button"
      />
      <div className="user-gyms">
        <h2 className="section-title">My Gyms:</h2>
        {userGyms.map((gym) => (
          <div key={gym.id} className="gym-item">
            <Link to={`/gyms/${gym.id}`} className="gym-link">
              <span className="name">{gym.name}</span> ---{" "}
              <span>{gym.city}</span> --- {gym.martial_art}
            </Link>
          </div>
        ))}
      </div>
      <div className="other-gyms">
        <h2 className="section-title">All Gyms:</h2>
        {allGyms.map((gym) => (
          <div key={gym.id} className="gym-item">
            <Link to={`/gyms/${gym.id}`} className="gym-link">
              <span className="name">{gym.name}</span> ---{" "}
              <span>{gym.city}</span> --- {gym.martial_art}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Gyms;
