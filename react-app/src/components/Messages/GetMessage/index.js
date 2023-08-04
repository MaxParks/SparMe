import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { getConversationThunk, createMessageThunk } from '../../../store/messages';
import OpenModalButton from "../../OpenModalButton";
import UpdateMessageModal from '../UpdateMessageModal';
import DeleteMessageModal from '../DeleteMessageModal';
import './Message.css'

function formatDateAndTime(dateString) {
  const dateObj = new Date(dateString);

  dateObj.setHours(dateObj.getHours() - 7);

  const optionsDate = { year: "numeric", month: "2-digit", day: "2-digit" };
  const optionsTime = { hour: "2-digit", minute: "2-digit" };

  const formattedDate = dateObj.toLocaleDateString(undefined, optionsDate);
  const formattedTime = dateObj.toLocaleTimeString(undefined, optionsTime);

  return `${formattedDate} ${formattedTime}`;
}


const GetMessage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const conversation = useSelector((state) => state.messages.conversation);
  const currentUser = useSelector((state) => state.session.user);

  const [modalOpen, setModalOpen] = useState(false);
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    dispatch(getConversationThunk(id));
  }, [dispatch, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!content) {
      errors.content = "Content is a required field.";
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    const data = await dispatch(createMessageThunk(id, content));

    if (Array.isArray(data)) {
      setErrors({ general: data });
    } else if (data && data.id) {
      setContent("");
      await dispatch(getConversationThunk(id));
      history.push(`/messages/${id}`);
    }
  };

  return (
    <div className="conversation-container">
      <img
        className="background-image"
        src={require("./messagebackground.jpg").default}
        alt="Background"
      />
 {conversation?.map((message, idx) => {
  const formattedDateTime = formatDateAndTime(message.created_at);
    return (
      <div
        className={`message-block ${message.sender && message.sender.id === currentUser?.id ? 'current-user' : ''}`}
        key={idx}
      >
    <p>{formattedDateTime}<br></br>{message.sender?.firstName}: {message.message_text}</p>

        {message.sender && message.sender.id === currentUser?.id ? (
  <div className="message-actions">
    <OpenModalButton
      buttonText="Update"
      modalComponent={
        <UpdateMessageModal
          messageId={message.id}
          messageContent={message.message_text}
          onSuccessfulUpdate={() => dispatch(getConversationThunk(id))}
          setModalOpen={setModalOpen}
        />
      }
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      className="update-button"
    />
    <OpenModalButton
      buttonText="Delete"
      modalComponent={
        <DeleteMessageModal
          id={message.id}
          onSuccessfulDelete={() => dispatch(getConversationThunk(id))}
        />
      }
      modalOpen={modalOpen}
      setModalOpen={setModalOpen}
      className="cancel-button"
    />
  </div>
) : null}
        <br></br>
        <br></br>
      </div>
    );
  })}

      <form onSubmit={handleSubmit}>
        <ul className="error-list">
          {errors.content && <li>{errors.content}</li>}
          {errors.general && errors.general.map((error, idx) => <li key={idx}>{error}</li>)}
        </ul>
        <div className="form-field">
          <textarea
            id="content"
            name="content"
            placeholder="Message..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="button-container1">
          <button type="submit">Send</button>
        </div>
      </form>
    </div>
  );
};

export default GetMessage;
