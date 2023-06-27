import React, { useState } from "react";
import { createSessionThunk} from "../../../store/sessions";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../../context/Modal";
import { useHistory } from "react-router-dom";
// import './CreateSessionModal.css'

function CreateSessionModal(isLoaded) {
  const dispatch = useDispatch();
  const [gym_id, setGymId] = useState("");
  const [partner_id, setPartnerId] = useState("")
  const [session_type, setSessionType] = useState("");
  const [session_date, setSessionDate] = useState("");
  const [details, setDetails] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();
  const history = useHistory();



  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!gym_id) {
      errors.gym_id = "Gym Id is a required field.";
    }
    if (!partner_id) {
        errors.partner_id = "Partner Id is a required field.";
      }
    if (!details) {
      errors.details = "Details is a required field.";
    }
    if (!session_date) {
      errors.session_date = "Session date is a required field.";
    }
    if (!session_type) {
        errors.session_type = "Session type is a required field.";
      }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    setErrors({});


    const data = await dispatch(createSessionThunk(gym_id,partner_id,details,session_date,session_type,));

    if (Array.isArray(data)) {
      setErrors({ general: data });
    } else if (data && data.id) {
      closeModal();
      history.push(`/sessions/${data.id}`);
    } else {
      closeModal();
    }
  };


  return (
    <div>
      <h2>Create Session</h2>
      <form onSubmit={handleSubmit}>
        <ul className="error-list">
          {errors.gym_id && <li>{errors.gym_id}</li>}
          {errors.partner_id && <li>{errors.partner_id}</li>}
          {errors.details && <li>{errors.details}</li>}
          {errors.session_date && <li>{errors.session_date}</li>}
          {errors.session_type && <li>{errors.session_type}</li>}
          {errors.general && errors.general.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>

        <div className="form-field">
          <input
            type="text"
            id="gym Id"
            placeholder="Gym Id"
            value={gym_id}
            onChange={(e) => setGymId(e.target.value)}
          />
        </div>
        <div className="form-field">
          <input
            type="text"
            id="partner Id"
            placeholder="Partner Id"
            value={partner_id}
            onChange={(e) => setPartnerId(e.target.value)}
          />
        </div>
        <div className="form-field">
          <input
            type="text"
            id="details"
            name="details"
            placeholder="Session details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </div>
        <div className="form-field">
          <input
            type="date"
            id="session_date"
            name="session_date"
            value={session_date}
            onChange={(e) => setSessionDate(e.target.value)}
          />
        </div>
        <div className="form-field">
          <input
            type="text"
            id="session_type"
            name="session_type"
            placeholder="Session Type"
            value={session_type}
            onChange={(e) => setSessionType(e.target.value)}
          />
        </div>
        <div className="button-container">
          <button type="submit" className="update-button">
            Create
          </button>
          <button type="button" className="cancel-button" onClick={closeModal}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );

}

export default CreateSessionModal;
