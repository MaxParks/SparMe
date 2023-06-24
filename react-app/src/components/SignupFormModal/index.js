import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from 'react-router-dom'
import { signUp } from "../../store/session";
import "./SignupForm.css";

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
  const [isModalOpen, setIsModalOpen] = useState(true) // Track modal state
  const { closeModal } = useModal();
  const history = useHistory()

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      const data = await dispatch(
        signUp(firstName, lastName, email, password, experience, city, weight, height)
      );
      if (data) {
        setErrors(data.errors);
      } else {
        closeModal()
        history.push("/user/dashboard");
    }
  };
}

  return (
    <>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <label>
          Email
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {errors.includes("Email is required.") && (
            <span className="error-message">Email is required.</span>
          )}
        </label>
        <label>
          First Name
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          {errors.includes("First name is required.") && (
            <span className="error-message">First name is required.</span>
          )}
        </label>
        <label>
          Last Name
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          {errors.includes("Last name is required.") && (
            <span className="error-message">Last name is required.</span>
          )}
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errors.includes("Password is required.") && (
            <span className="error-message">Password is required.</span>
          )}
        </label>
        <label>
          Confirm Password
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {errors.includes("Confirm Password field must be the same as the Password field") && (
            <span className="error-message">Confirm Password field must be the same as the Password field.</span>
          )}
        </label>
        <label>
          Experience
          <input
            type="text"
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            required
          />
          {errors.includes("Experience is required.") && (
            <span className="error-message">Experience is required.</span>
          )}
        </label>
        <label>
          City
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
          {errors.includes("City is required.") && (
            <span className="error-message">City is required.</span>
          )}
        </label>
        <label>
          Weight
          <input
            type="text"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            required
          />
          {errors.includes("Weight is required.") && (
            <span className="error-message">Weight is required.</span>
          )}
        </label>
        <label>
          Height
          <input
            type="text"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            required
          />
          {errors.includes("Height is required.") && (
            <span className="error-message">Height is required.</span>
          )}
        </label>
        <button type="submit">Sign Up</button>
      </form>
    </>
  );
}

export default SignupFormModal;
