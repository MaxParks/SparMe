import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getDashboardThunk } from "../../store/dashboard";
import OpenModalButton from "../OpenModalButton";
import "./Dashboard.css";
import GetStartedModal from "./GetStarted";
import boxingGlove from "./boxinggloves.png"

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
  const [userIndex, setUserIndex] = useState(0);

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


  const upcomingSessions = dashboardData.sessions
    ? Object.values(dashboardData.sessions).filter(
        (session) => new Date(session.session_date) >= currentDate
      )
    : [];

    const loadMoreUsers = () => {
      setUserIndex(userIndex + 5);
    }

    const collapseUsers = () => {
      setUserIndex(0);
    }

  return (
    <div className="dashboard-container">
      <img
        className="background-image"
        src={require("./boxing background.jpg").default}
        alt="Background"
      />

      <div className="dashboard-section-container">
      <OpenModalButton
        buttonText="Get Started"
        modalComponent={<GetStartedModal />}
        className="get-started"
      />
      <br></br>
        <div className="dashboard-section">
          <h2 className="dashboard-section-title">People:</h2>
        </div>
        <div className="dashboard-task-list">
        {dashboardData.allUsers &&
            // Display only up to the current index of users
            Object.values(dashboardData.allUsers).slice(0, userIndex + 5).map((user) => (
              <div key={user.id} className="dashboard-user-item">
  <Link to={`/users/${user.id}`} className="dashboard-user-link">
    <span className="user-info">{user.firstName} {user.lastName}</span>
  </Link>
</div>

            ))}
        </div>
        {dashboardData.allUsers && dashboardData.allUsers.length > userIndex + 5 && (
  <div className="button-container">
    <button className="load-more-button" onClick={loadMoreUsers}>Load More People</button>
  </div>
)}
<br></br>
{userIndex > 0 && (
          <div className="button-container">
            <button className="collapse-users-button" onClick={collapseUsers}>Collapse Users</button>
          </div>
        )}
      </div>
      <div className="dashboard-section-container">
        <div className="dashboard-section">
          <h2 className="dashboard-section-title">Upcoming Spars:</h2>
        </div>
        <div>
        {upcomingSessions.length === 0 ? (
  <div className="dashboard-no-upcoming-spar">
    <span>No Upcoming Spars at the moment</span>
  </div>
) : (
  upcomingSessions.map((session) => {
    const { formattedDate, formattedTime } = formatDateAndTime(session.session_date);
    return (
      <div key={session.id} className="session-link">
        <Link to={`/sessions/${session.id}`} className="dashboard-session-link">
        <img src={boxingGlove} alt="Boxing Glove" className="boxing-glove"/>
        <br></br>
          <span className="dashboard-session-info">
            {session.partner.firstName} {session.partner.lastName}
            {" and "}
            {session.owner.firstName} {session.owner.lastName}
            <br></br>
            {formattedDate}  {formattedTime}
          </span>
        </Link>
      </div>
    );
  })
)}

        </div>
      </div>
    </div>
  );
}

export default Dashboard;
