import React, { useState,useEffect } from "react";
import {getGymsThunk} from "../../../store/gyms"
import { createSessionThunk} from "../../../store/sessions";
import { getDashboardThunk } from "../../../store/dashboard";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../../context/Modal";
import { useHistory } from "react-router-dom";
import './CreateSessionModal.css'

function CreateSessionModal(isLoaded) {
  const dispatch = useDispatch();
  const [gym, setGym] = useState(null);
  const [partner, setPartner] = useState(null);
  const [session_type, setSessionType] = useState("");
  const [session_date, setSessionDate] = useState("");
  const [details, setDetails] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();
  const history = useHistory();

  const allUsers = useSelector((state) => state.dashboard.allUsers);
  const currentUser = useSelector((state) => state.session.user);
  const allGyms = useSelector((state) => {
    const ownedGyms = state.gyms.owned_gyms || [];
    const associatedGyms = state.gyms.associated_gyms || [];

    // Combine and deduplicate gyms
    return [...ownedGyms, ...associatedGyms].reduce((acc, gym) => {
        if (!acc.find((g) => g.id === gym.id)) {
            acc.push(gym);
        }
        return acc;
    }, []);
});


let filteredUsers = [];
if (allUsers) {
  filteredUsers = allUsers.filter((user) => user.id !== currentUser.id);
}


  useEffect(() => {
    dispatch(getDashboardThunk());
    dispatch(getGymsThunk());
  }, [dispatch]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!gym) {
      errors.gym = "Gym is a required field.";
    }
    if (!partner) {
      errors.partner = "Partner is a required field.";
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

    const selectedDate = new Date(session_date);
    const currentDate = new Date();

    if (selectedDate < currentDate) {
      errors.session_date = "Please select a future date and time.";
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    setErrors({});

    console.log(session_date);
    const data = await dispatch(createSessionThunk(gym.id,partner.id,details,session_date,session_type,));

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
          {errors.gym && <li>{errors.gym}</li>}
          {errors.partner && <li>{errors.partner}</li>}
          {errors.details && <li>{errors.details}</li>}
          {errors.session_date && <li>{errors.session_date}</li>}
          {errors.session_type && <li>{errors.session_type}</li>}
          {errors.general && errors.general.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>

        <div className="form-field">
        <select
  id="gym_id"
  value={gym ? gym.id : ""}
  onChange={(e) => {
    const selectedGym = allGyms.find((gym) => gym.id === Number(e.target.value));
    setGym(selectedGym);
  }}
>
  <option value="">Select Gym</option>
  {allGyms.map((gym) => (
    <option key={gym.id} value={gym.id}>
      {gym.name}
    </option>
  ))}
</select>
          </div>
        <div className="form-field">
  <select
    id="partner_id"
    value={partner ? partner.id : ""}
    onChange={(e) => {
      const selectedPartner = filteredUsers.find((user) => user.id === Number(e.target.value));
      setPartner(selectedPartner);
    }}
  >
    <option value="">Select Partner</option>
    {filteredUsers.map((user) => (
      <option key={user.id} value={user.id}>
        {user.firstName} {user.lastName}
      </option>
    ))}
  </select>
</div>
        <div className="form-field">
          <textarea
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
            type="datetime-local"
            id="session_date"
            name="session_date"
            value={session_date}
            onChange={(e) => setSessionDate(e.target.value)}
          />
        </div>

        <div className="form-field">
          <select
            id="session_type"
            name="session_type"
            value={session_type}
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
