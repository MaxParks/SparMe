// Constants
const LOAD_MESSAGES = 'messages/loadMessages';
const LOAD_MESSAGE = 'message/loadMessage';
const ADD_MESSAGE = 'messages/addMessage';
const UPDATE_MESSAGE = 'messages/updateMessage';
const DELETE_MESSAGE = 'messages/deleteMessage';
const LOAD_CONVERSATION = 'messages/loadConversation'; // <-- Add this line

// Action creators
export const loadMessages = data => ({
  type: LOAD_MESSAGES,
  payload: data
});

export const loadMessage = data => ({
  type: LOAD_MESSAGE,
  payload: data
});

export const addMessage = data => ({
  type: ADD_MESSAGE,
  payload: data
});

export const updateMessage = (messageId, data) => ({
  type: UPDATE_MESSAGE,
  data: {
    id: messageId,
    ...data,
  },
});

export const deleteMessage = id => ({
  type: DELETE_MESSAGE,
  payload: id
});

// Add this function
export const loadConversation = data => ({
  type: LOAD_CONVERSATION,
  payload: data,
});

// Thunks
export const getMessagesThunk = () => async dispatch => {
  const response = await fetch('/api/messages/');

  if (response.ok) {
    const data = await response.json();
    dispatch(loadMessages(data));
    return data;
  }
};

export const getConversationThunk = (otherUserId) => async dispatch => {
    const response = await fetch(`/api/messages/conversation/${otherUserId}`);

    if (response.ok) {
      const data = await response.json();
      dispatch(loadConversation(data.messages));  // Dispatch the messages array
      return data;
    }
};




export const getMessageThunk = id => async dispatch => {
  const response = await fetch(`/api/messages/${id}`);

  if (response.ok) {
    const data = await response.json();
    dispatch(loadMessage(data));
    return data;
  }
};

export const createMessageThunk = (receiver_id, message_text) => async dispatch => {
    const messageData = {
      receiver_id,
      message_text,
    };

    const response = await fetch('/api/messages/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
      });

  if (response.ok) {
    const data = await response.json();
    dispatch(addMessage(data));
    return data;
  }
};

export const updateMessageThunk = (messageId, messageData) => async dispatch => {
  const response = await fetch(`/api/messages/${messageId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(messageData)
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(updateMessage(messageId, data));
    return data;
  }
};

export const deleteMessageThunk = id => async dispatch => {
  const response = await fetch(`/api/messages/${id}`, {
    method: 'DELETE'
  });

  if (response.ok) {
    dispatch(deleteMessage(id));
  }
};

// Initial state
const initialState = {
    conversation: [],
};

// Reducer
export default function messagesReducer(state = initialState, action){
    switch (action.type) {
      case LOAD_MESSAGES:
        return {
          ...state,
          ...action.payload
        };
      case LOAD_MESSAGE:
        return {
          ...state,
          ...action.payload
        };
        case LOAD_CONVERSATION:
            return {
                ...state,
                conversation: action.payload
            };
      case ADD_MESSAGE:
        return {
          ...state,
          messages: {
            [action.payload.id]: action.payload,
          }
        };
      case UPDATE_MESSAGE:
        return {
          ...state,
          [action.data.id]: action.data,
        };
      case DELETE_MESSAGE:
        const newState = { ...state };
        delete newState[action.payload];
        return newState;
      default:
        return state;
    }
  };
