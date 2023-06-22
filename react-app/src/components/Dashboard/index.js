import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getDashboardThunk } from "../../store/dashboard";
import ProfileButton from "../Navigation/ProfileButton";
import OpenModalButton from "../OpenModalButton";

// import "./Dashboard.css";

function Dashboard() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const dashboardData = useSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(getDashboardThunk());
  }, [dispatch]);

  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  let greetingMessage = "Good evening";
  if (currentHour < 12) {
    greetingMessage = "Good morning";
  } else if (currentHour < 18) {
    greetingMessage = "Good afternoon";
  }

  return (
    <div>
      <div className="header-container">
        <h1 className="header-title">Dashboard</h1>
        <ProfileButton user={sessionUser} />
      </div>

      <div className="dashboard-header">
        <h2 className="dashboard-date">
          {currentDate.toLocaleDateString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </h2>
        {/* <h3 className="dashboard-greeting">
          {`${greetingMessage}, ${sessionUser.firstName}`}
        </h3> */}
      </div>


        <div className="split-container">
          <div className="section-title-container">
            <h2 className="section-title">People:</h2>
          </div>
          </div>
          <div className="task-list">
            {dashboardData.allUsers &&
              Object.values(dashboardData.allUsers).map((user) => (
                <div key={user.id} className="user-item">
                  <div className="task-link">
                    {user.firstName}  {user.lastName}
                  </div>
                </div>
              ))}
          </div>

        <div className="split-container">
          <div className="section-title-container">
            <h2 className="section-title">Upcoming Spars:</h2>
          </div>
          {dashboardData.sessions &&
            Object.values(dashboardData.sessions).map((session) => (
              <div key={session.id}>
                {session.owner.firstName} {session.owner.lastName} --- {session.partner.firstName} {session.partner.lastName} --- {session.gym.name} --- {session.session_type} --- {session.session_date}
              </div>
            ))}
          </div>
        </div>
  );
}

export default Dashboard;
