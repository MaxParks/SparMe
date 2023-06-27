import React, { useState, useEffect } from "react";
import { updateSessionThunk, getSessionThunk } from "../../../store/sessions";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../../context/Modal";
import { useHistory, useParams } from "react-router-dom";
// import './UpdateSessionModal.css'

function UpdateSessionModal({ id }) {
  const dispatch = useDispatch();
  const [gymId, setGymId] = useState("");
  const [sessionType, setSessionType] = useState("");
  const [sessionDate, setSessionDate] = useState("");
  const [details, setDetails] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();
  const history = useHistory();

  const session = useSelector(state => state.sessions);

  useEffect(() => {
    if (session) {
      setGymId(session.gym_id);
      setDetails(session.details);
      setSessionType(session.session_type);
      setSessionDate(session.session_date);

      const sessionDateFormatted = new Date(session.session_date).toISOString().split("T")[0];
    setSessionDate(sessionDateFormatted);
    }
  }, [session]);


  useEffect(() => {
    if(!session){
      dispatch(getSessionThunk(id));
    }
  }, [dispatch, id, session]);



  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!gymId) {
      errors.gymId = "Gym Id is a required field.";
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

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    setErrors({});


    const updatedSession = {
      gym_id: gymId,
      details,
      session_date: sessionDate,
      session_type: sessionType
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
          {errors.gymId && <li>{errors.gymId}</li>}
          {errors.details && <li>{errors.details}</li>}
          {errors.sessionDate && <li>{errors.sessionDate}</li>}
          {errors.sessionType && <li>{errors.sessionType}</li>}
          {errors.general && errors.general.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>

        <div className="form-field">
          <input
            type="text"
            id="gym Id"
            placeholder="Gym Id"
            value={gymId}
            onChange={(e) => setGymId(e.target.value)}
          />
        </div>
        <div className="form-field">
          <input
            type="text"
            id="details"
            placeholder="Session details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </div>
        <div className="form-field">
          <input
            type="date"
            id="session date"
            value={sessionDate}
            onChange={(e) => setSessionDate(e.target.value)}
          />
        </div>
        <div className="form-field">
          <input
            type="text"
            id="session type"
            value={sessionType}
            onChange={(e) => setSessionType(e.target.value)}
          />
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
