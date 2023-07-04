import React, { useState, useEffect } from "react";
import { updateSessionThunk, getSessionThunk } from "../../../store/sessions";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../../context/Modal";
import { useHistory } from "react-router-dom";

function UpdateSessionModal({ id }) {
  const dispatch = useDispatch();
  const [gym, setGym] = useState({});
  const [sessionType, setSessionType] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  const [details, setDetails] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();
  const history = useHistory();

  const session = useSelector((state) => state.sessions);
  const allGyms = useSelector((state) => state.dashboard.allGyms);

  useEffect(() => {
    if (!session) {
      dispatch(getSessionThunk(id));
    }
  }, [dispatch, id, session]);

  useEffect(() => {
    if (session) {
      setGym(session.gym);
      setDetails(session.details);
      setSessionDate(formatSessionDate(session.session_date));
    }
  }, [session]);

  const formatSessionDate = (dateString) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() - 7);
    const formattedDate = date.toISOString().slice(0, 16);
    return formattedDate;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!gym) {
      errors.gym = "Gym is a required field.";
    }
    if (!details) {
      errors.details = "Details is a required field.";
    }
    if (!sessionDate) {
      errors.sessionDate = "Session date is a required field.";
    }
    if (!sessionType) {
      errors.sessionType = "Session type is a required field.";
    }

    const selectedDate = new Date(sessionDate);
    const currentDate = new Date();

    if (selectedDate < currentDate) {
      errors.sessionDate = "Please select a future date and time.";
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    setErrors({});

    const updatedSession = {
      gym_id: gym && gym.id,
      partner_id: session.partner_id,
      details,
      session_date: sessionDate,
      session_type: sessionType,
    };

    const data = await dispatch(updateSessionThunk(id, updatedSession));

    if (Array.isArray(data)) {
      setErrors({ general: data });
    } else if (data && data.id) {
      dispatch(getSessionThunk(id));
      closeModal();
      history.push(`/sessions/${id}`);
    } else {
      closeModal();
    }
  };

  return (
    <div>
      <h2>Update Session</h2>
      <form onSubmit={handleSubmit}>
        <ul className="error-list">
          {errors.gym && <li>{errors.gym}</li>}
          {errors.details && <li>{errors.details}</li>}
          {errors.sessionDate && <li>{errors.sessionDate}</li>}
          {errors.sessionType && <li>{errors.sessionType}</li>}
          {errors.general && errors.general.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>

        <div className="form-field">
          <input
            type="text"
            id="gymId"
            placeholder={`Gym: ${session.gym.name}`}
            disabled
          />
        </div>
        <div className="form-field">
          <input
            type="text"
            id="partner"
            placeholder={`Partner: ${session.partner.firstName} ${session.partner.lastName}`}
            disabled
          />
        </div>
        <div className="form-field">
          <textarea
            type="text"
            id="details"
            placeholder="Session details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </div>
        <div className="form-field">
          <input
            type="datetime-local"
            id="sessionDate"
            value={sessionDate}
            onChange={(e) => setSessionDate(e.target.value)}
          />
        </div>
        <div className="form-field">
          <select
            id="sessionType"
            name="sessionType"
            value={sessionType}
            onChange={(e) => setSessionType(e.target.value)}
          >
            <option value = ""> Select Session Type </option>
            <option value = "Boxing"> Boxing </option>
            <option value = "MMA"> MMA </option>
            <option value = "BJJ"> BJJ </option>
            </select>

        </div>
        <div className="button-container">
          <button type="submit" className="update-button">
            Update
          </button>
          <button type="button" className="cancel-button" onClick={closeModal}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateSessionModal;
