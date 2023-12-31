import React, { useState } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import AboutModalContent from "./aboutMe";

import "./LandingPage.css";

function LandingPage({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  const openAboutModal = () => {
    setIsAboutModalOpen(true);
  };

  const closeAboutModal = () => {
    setIsAboutModalOpen(false);
  };

  return (
    <div className="page-container">
      <img
        className="background-image"
        src={require("./sparring.jpg").default}
        alt="Background"
      />
      <div className="box-container">
        <div className="header-container">
        <img
        className="SparMe-logo"
        src={require("./sparmepicture.png").default}
        alt="SparMe Logo"
      />
      <br></br>
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
              <p className="landing-page-description">
                Want to learn, want to get better, want good sparring sessions? SparMe
                is here, look no further!
              </p>
              <div className="cta-buttons">
                <OpenModalButton
                  buttonText="Start Here"
                  modalComponent={<SignupFormModal />}
                  className="button-get-started"
                />
                <OpenModalButton
                  buttonText="About SparMe"
                  modalComponent={<AboutModalContent />}
                  className="button-about"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
