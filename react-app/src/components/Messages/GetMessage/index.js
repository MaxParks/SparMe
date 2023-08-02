import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { getConversationThunk, createMessageThunk } from '../../../store/messages';
import './Message.css'

const GetMessage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const conversation = useSelector((state) => state.messages.conversation);
  const currentUser = useSelector((state) => state.session.user);

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
      {conversation?.map((message, idx) => (
        <div className={`message-block ${message.sender.id === currentUser.id ? 'current-user' : ''}`} key={idx}>
          <p>{message.created_at}<br></br>{message.sender.firstName}: {message.message_text}</p>
          <br></br>
          <br></br>
        </div>
      ))}
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
