import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from 'react-router-dom'
import { signUp } from "../../store/session";
import "./SignupFormModal.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [experience, setExperience] = useState("");
  const [city, setCity] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();
  const history = useHistory();

  // Create an array from 0 to 10 for experience
const experienceOptions = Array.from({length: 11}, (_, i) => i);

// Create an array from 90 to 250 with step of 10 for weight
const weightOptions = Array.from({length: 17}, (_, i) => 90 + i * 10);

// Create an array from 4'10" to 7'0" with step of 1" for height
// Convert everything to inches for easy increment, we will convert back to feet and inches when displaying
const heightOptions = Array.from({length: 27}, (_, i) => 58 + i);
const heightDisplay = inches => `${Math.floor(inches / 12)}'${inches % 12}"`;

const handleSubmit = async (e) => {
  e.preventDefault();
  if (password === confirmPassword) {
    try {
      const data = await dispatch(
        signUp(firstName, lastName, email, password, experience, city, weight, height)
      );
      if (data && Array.isArray(data)) {
        setErrors(data);
    } else {
        closeModal();
        history.push("/user/dashboard");
      }
    } catch (err) {
      console.error(err);
      setErrors(["An error occurred while trying to sign up. Please try again."]);
    }
  } else {
    setErrors(["Confirm Password field must be the same as the Password field"]);
  }
};

  return (
    <div className="login-form-container">
      <h1>Sign Up</h1>
      <form className="login-form" onSubmit={handleSubmit}>
        <ul className="error-list">
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-field">
          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>

        <div className="form-field">
          <label htmlFor="experience">Experience (in years)</label>
          <select
            id="experience"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            required
          >
            <option value="" disabled>Select experience</option>
            {experienceOptions.map((experience, idx) => (
              <option key={idx} value={experience}>{experience}</option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="weight">Weight (in pounds)</label>
          <select
            id="weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          >
            <option value="" disabled>Select weight</option>
            {weightOptions.map((weight, idx) => (
              <option key={idx} value={weight}>{weight} lbs</option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="height">Height</label>
          <select
            id="height"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            required
          >
            <option value="" disabled>Select height</option>
            {heightOptions.map((height, idx) => (
              <option key={idx} value={height}>{heightDisplay(height)}</option>
            ))}
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="login-button">Sign Up</button>
        </div>
      </form>
    </div>
  );
}

export default SignupFormModal;
