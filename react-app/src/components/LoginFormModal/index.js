import React, { useState } from "react";
import { login } from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useHistory } from "react-router-dom";
// import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(email, password));
    if (data) {
      setErrors(data);
    } else {
        closeModal()
        history.push("/user/dashboard");
    }
  };

  return (
    <>
    <p>Welcome to SparMe</p>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <ul className="error-list">
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <label>
          Email
          <input
            type="text"
            id="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Log In</button>
        <div className="login-demo-button">
          <button
            className="demo-button"
            onClick={async (e) => {
              e.preventDefault();
              const demoUserEmail = "demo@aa.io";
              const demoUserPassword = "password";
              const data = await dispatch(
                login(demoUserEmail, demoUserPassword)
              );
              if (data) {
                setErrors(data);
              } else {
                closeModal();
                history.push("/user/dashboard");
              }
            }}
          >
            Demo User
          </button>
        </div>
      </form>
    </>
  );
}

export default LoginFormModal;
