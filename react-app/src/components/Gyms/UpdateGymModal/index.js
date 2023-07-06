import React, { useState,useEffect } from "react";
import { updateGymThunk, getGymThunk } from "../../../store/gyms";
import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../../context/Modal";
import { useHistory } from "react-router-dom";

function UpdateGymModal({ id }) {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [martial_art, setMartialArt] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();
  const history = useHistory();

  const gym = useSelector((state) => state.gyms);

  useEffect(() => {
    if (!gym) {
      dispatch(getGymThunk(id));
    }
  }, [dispatch, id, gym]);

  useEffect(() => {
    if (gym) {
      setName(gym.name);
      setCity(gym.city);
      setMartialArt(gym.martial_art)
    }
  }, [gym]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!name) {
      errors.name = "Gym Name is a required field.";
    }
    if (!city) {
      errors.city = "City is a required field.";
    }
    if (!martial_art) {
      errors.martial_art = "Martial Arts is a required field.";
    }


    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    setErrors({});

    const updatedGym = {
        name,
        city,
        martial_art,
      };

    const data = await dispatch(updateGymThunk(id, updatedGym));

    if (Array.isArray(data)) {
      setErrors({ general: data });
    } else if (data && data.id) {
      dispatch(getGymThunk(id));
      closeModal();
      history.push(`/gyms/${data.id}`);
    } else {
      closeModal();
    }
  };


  return (
    <div>
      <h2>Update Gym</h2>
      <form onSubmit={handleSubmit}>
        <ul className="error-list">
          {errors.name && <li>{errors.name}</li>}
          {errors.city && <li>{errors.city}</li>}
          {errors.martial_art && <li>{errors.martial_art}</li>}
          {errors.general && errors.general.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>

        <div className="form-field">
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        <div className="form-field">
          <input
            type="text"
            id="city"
            name="city"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <div className="form-field">
          <select
            id="martial_art"
            name="martial_art"
            value={martial_art}
            onChange={(e) => setMartialArt(e.target.value)}
          >
            <option value = ""> Select Martial Art </option>
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

export default UpdateGymModal;
