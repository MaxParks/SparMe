import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { getSessionsThunk } from "../../../store/sessions";
import './GetSessions.css';

function Sessions() {
  const dispatch = useDispatch();

  const sessionData = useSelector((state) => state.sessions);
  const sessionUser = useSelector((state) => state.session.user);

  const userIsOwner = sessionUser && sessionData && sessionUser.id === sessionData.owner_id;

  useEffect(() => {
    dispatch(getSessionsThunk());
  }, [dispatch]);

  const currentDate = new Date();
  const upcomingSessions = [];
  const previousSessions = [];

  if (sessionData.sessions) {
    Object.values(sessionData.sessions).forEach((session) => {
      if (new Date(session.session_date) >= currentDate) {
        upcomingSessions.push(session);
      } else {
        previousSessions.push(session);
      }
    });
  }

  return (
    <div className="sessions-list">
      <div className="upcoming-sessions">
        <h2 className="section-title">Upcoming Sparring Sessions:</h2>
        {upcomingSessions.map((session) => (
          <div key={session.id} className="session-item">
            <Link to={`/sessions/${session.id}`} className="session-link">
              <span className="name">
                {session.owner?.firstName} {session.owner?.lastName}
              </span>{" "}
              ---{" "}
              <span>
                {session.partner?.firstName} {session.partner?.lastName}
              </span>{" "}
              --- {session.gym?.name} --- {session.session_type} ---{" "}
              {session.session_date}
            </Link>
          </div>
        ))}
      </div>
      <div className="previous-sessions">
        <h2 className="section-title">Previous Sparring Sessions:</h2>
        {previousSessions.map((session) => (
          <div key={session.id} className="session-item">
            <Link to={`/sessions/${session.id}`} className="session-link">
              <span className="name">
                {session.owner?.firstName} {session.owner?.lastName}
              </span>{" "}
              ---{" "}
              <span className="name">
                {session.partner?.firstName} {session.partner?.lastName}
              </span>{" "}
              --- {session.gym?.name} --- {session.session_type} ---{" "}
              {session.session_date}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sessions;
