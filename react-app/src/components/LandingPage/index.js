import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";

// import "./LandingPage.css";

function LandingPage({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <div className="page-container" style={{ backgroundColor: "#EEEBEA" }}>
      <div className="header-container">
        <NavLink
          exact
          to="/"
          style={{ fontWeight: "medium", fontSize: "32px" }}
        >
          SparMe
        </NavLink>
        <div className="header-button-container">
          <OpenModalButton
            buttonText="Log In"
            modalComponent={<LoginFormModal />}
            className="button-login"
          />

          <OpenModalButton
            buttonText="Sign Up"
            modalComponent={<SignupFormModal />}
            className="button-get-started"
          />
        </div>
      </div>
      <div className="hero-container">
        <div className="flex-split">
          <div className="left-side">
            <h3 className="landing-page-title">
              Welcome to SparMe, the sparring session app!
            </h3>
            <p style={{ fontSize: "16px", color: "black" }}>
              Want to learn, Want to get better, Want good sparring sessions? SparMe
              is here look no further!
            </p>
            <div className="cta-buttons">
              <OpenModalButton
                buttonText="Start Here"
                modalComponent={<SignupFormModal />}
                className="button-get-started"
              />
              <button className="button-transparent">About SparMe</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
