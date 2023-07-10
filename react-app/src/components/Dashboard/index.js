import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getDashboardThunk } from "../../store/dashboard";
import ProfileButton from "../Navigation/ProfileButton";
import OpenModalButton from "../OpenModalButton";

import "./Dashboard.css";
import CreateSessionModal from "../Sessions/AddSessionModal";

function formatDateAndTime(dateString) {
  const dateObj = new Date(dateString);

  const optionsDate = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const optionsTime = { hour: '2-digit', minute: '2-digit' };

  const formattedDate = dateObj.toLocaleDateString(undefined, optionsDate);
  const formattedTime = dateObj.toLocaleTimeString(undefined, optionsTime);

  return { formattedDate, formattedTime };
}

function Dashboard() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const dashboardData = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(getDashboardThunk());
  }, [dispatch]);

  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  let greetingMessage = "Welcome back and good evening";
  if (currentHour < 12) {
    greetingMessage = "Welcome back and good morning";
  } else if (currentHour < 18) {
    greetingMessage = "Welcome back and good afternoon";
  }

  // Filter out past sessions
  const upcomingSessions = dashboardData.sessions
    ? Object.values(dashboardData.sessions).filter(
        (session) => new Date(session.session_date) >= currentDate
      )
    : [];

  return (
    <div className="dashboard-container">
      <img
        className="background-image"
        src={require("./boxing background.jpg").default}
        alt="Background"
      />
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard
        <br></br>
        {/* {`${greetingMessage}, ${sessionUser.firstName} ${sessionUser.lastName}`} */}
        </h1>
      </div>


      <div className="dashboard-section-container">
        <div className="dashboard-section">
          <h2 className="dashboard-section-title">People:</h2>
        </div>
        <div className="dashboard-task-list">
          {dashboardData.allUsers &&
            Object.values(dashboardData.allUsers).map((user) => (
              <div key={user.id} className="dashboard-user-item">
                <div className="dashboard-user-link">
                  <span className="user-info">{user.firstName} {user.lastName}</span>
                </div>
              </div>
            ))}
        </div>
      </div>

      <div className="dashboard-section-container">
        <div className="dashboard-section">
          <h2 className="dashboard-section-title">Upcoming Spars:</h2>
        </div>
        <div className="dashboard-task-list">
          {upcomingSessions.map((session) => {
            const { formattedDate, formattedTime } = formatDateAndTime(session.session_date);
            return (
              <div key={session.id} className="dashboard-upcoming-spar">
                <Link to={`/sessions/${session.id}`} className="dashboard-session-link">
                  <span className="dashboard-session-info">
                    {session.owner.firstName} {session.owner.lastName} ---{" "}
                    {session.partner.firstName} {session.partner.lastName} ---{" "}
                    {session.gym.name} --- {session.session_type} ---{" "}
                    {formattedDate}-{formattedTime}
                  </span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      <OpenModalButton
        buttonText="Create a Session"
        modalComponent={<CreateSessionModal />}
        className="dashboard-session"
      />
    </div>
  );
}

export default Dashboard;
