import React, { useEffect,useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getMessagesThunk } from '../../../store/messages';
import { Link } from 'react-router-dom';
import OpenModalButton from "../../OpenModalButton";
import CreateMessage from "../CreateMessage"
import './Messages.css'

const Messages = () => {
    const dispatch = useDispatch();
    const messages = useSelector(state => state.messages?.messages);
    const sessionUser = useSelector((state) => state.session.user);
    const [users, setUsers] = useState(new Map());

    useEffect(() => {
      dispatch(getMessagesThunk());
    }, [dispatch]);

    useEffect(() => {
      if (sessionUser && Array.isArray(messages)) {
        const newUsers = new Map();
        messages.forEach((message) => {
          if (message.sender && message.sender.id !== sessionUser.id) {
            newUsers.set(message.sender.id, `${message.sender.firstName} ${message.sender.lastName}`);
          } else if (message.receiver && message.receiver.id !== sessionUser.id) {
            newUsers.set(message.receiver.id, `${message.receiver.firstName} ${message.receiver.lastName}`);
          }
        });
        setUsers(newUsers);
      }
  }, [messages, sessionUser]);




      return (
        <div className="messages-container">
          <img
        className="background-image"
        src={require("./try this 1.jpg").default}
        alt="Background"
      />
      <br></br>
          <OpenModalButton
            buttonText="Send Message"
            modalComponent={<CreateMessage />}
            className="dashboard-session"
          />
          <h1>Messages:</h1>
          {[...users].map(([id, name]) => (
            <div className="user-div" key={id}>
              <Link className="user-link" to={`/messages/${id}`}>{name}</Link>
            </div>
          ))}
        </div>
      );

};

export default Messages;
