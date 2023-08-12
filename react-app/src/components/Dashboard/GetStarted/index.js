import React from 'react';
import { useHistory } from 'react-router-dom';
import { useModal } from '../../../context/Modal';

function GetStartedModal() {
  const history = useHistory();
  const { closeModal } = useModal();

  // Function to navigate and then close the modal
  const navigateAndCloseModal = (path) => {
    history.push(path);
    closeModal();
  };

  return (
    <div>
      <h2>To get started:</h2>

      <h3>1. Join or Create a Gym <br></br>
      <button onClick={() => navigateAndCloseModal(`/gyms`)}>Gyms</button></h3>

      <h3>2. Look at the list of users and message someone about training <br></br> </h3>

      <h3>3. Set up a Sparring Session <br></br>
      <button onClick={() => navigateAndCloseModal(`/sessions`)}>Sessions</button></h3>

      <h3>Congratulations! After these steps, you're all set.</h3>
    </div>
  );
}

export default GetStartedModal;
