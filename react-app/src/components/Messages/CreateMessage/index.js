import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createMessageThunk,getConversationThunk } from "../../../store/messages";
import { getDashboardThunk } from "../../../store/dashboard";
import { useModal } from "../../../context/Modal";
import { useHistory } from "react-router-dom";
// import './CreateMessageModal.css';

function CreateMessageModal({ targetUser }) {
  const dispatch = useDispatch();
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();
  const history = useHistory();
  const [receiver, setReceiver] = useState(targetUser ? { ...targetUser, firstName: targetUser.name.split(' ')[0], lastName: targetUser.name.split(' ')[1] } : null);
  const [disableReceiver, setDisableReceiver] = useState(Boolean(targetUser));


  const allUsers = useSelector((state) => state.dashboard.allUsers);
  const currentUser = useSelector((state) => state.session.user);

  let filteredUsers = [];
  if (allUsers) {
    filteredUsers = allUsers.filter((user) => user.id !== currentUser.id);
  }

  useEffect(() => {
    dispatch(getDashboardThunk());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!receiver) {
      errors.receiver = "Receiver is a required field.";
    }
    if (!content) {
      errors.content = "Content is a required field.";
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    const data = await dispatch(createMessageThunk(receiver.id, content));

    if (Array.isArray(data)) {
        setErrors({ general: data });
      } else if (data && data.id) {
        closeModal();
        await dispatch(getConversationThunk(receiver.id));
        history.push(`/messages/${receiver.id}`);
      } else {
        closeModal();
      }
    };

  return (
    <div className="CreateMessageModal">
      <h2>Create Message</h2>
      <form onSubmit={handleSubmit}>
        <ul className="error-list">
          {errors.receiver && <li>{errors.receiver}</li>}
          {errors.content && <li>{errors.content}</li>}
          {errors.general && errors.general.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>

        <div className="form-field">
        <select
        id="receiver_id"
        value={receiver ? Number(receiver.id) : ""}
        onChange={(e) => {
          const selectedReceiver = filteredUsers.find((user) => user.id === Number(e.target.value));
          setReceiver(selectedReceiver);
        }}
        disabled={disableReceiver}
      >
            <option value="">Select User</option>
            {filteredUsers.map((user) => (
              <option key={user.id} value={user.id}>
                {user.firstName} {user.lastName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <textarea
            id="content"
            name="content"
            placeholder="Message content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="button-container">
          <button type="submit">Send</button>
          <button type="button" onClick={closeModal}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateMessageModal;
