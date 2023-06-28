import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getDashboardThunk } from "../../store/dashboard";
import ProfileButton from "../Navigation/ProfileButton";
import OpenModalButton from "../OpenModalButton";

import "./Dashboard.css";
import CreateSessionModal from "../Sessions/AddSessionModal";

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
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>

      </div>

      <div className="dashboard-date-container">
        <h3 className="dashboard-greeting">
          {`${greetingMessage}, ${sessionUser.firstName} ${sessionUser.lastName}`}
        </h3>
      </div>

      <div className="dashboard-section-container">
        <div className="dashboard-section">
          <h2 className="dashboard-section-title">People:</h2>
        </div>
        <div className="dashboard-task-list">
          {dashboardData.allUsers &&
            Object.values(dashboardData.allUsers).map((user) => (
              <div key={user.id} className="dashboard-user-item">
                <div className="dashboard-task-link">
                  <span className="user-info">{user.firstName}{user.lastName} (ID: {user.id})</span>
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
          {upcomingSessions.map((session) => (
            <div key={session.id} className="dashboard-upcoming-spars">
              <Link to={`/sessions/${session.id}`} className="dashboard-session-link">
                <span className="dashboard-session-info">
                  {session.owner.firstName} {session.owner.lastName} ---{" "}
                  {session.partner.firstName} {session.partner.lastName} ---{" "}
                  {session.gym.name} --- {session.session_type} ---{" "}
                  {session.session_date}
                </span>
              </Link>
            </div>
          ))}
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
