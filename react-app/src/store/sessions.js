// Constants
const LOAD_SESSIONS = 'sessions/loadSessions';
const LOAD_SESSION = 'session/loadSession';
const ADD_SESSION = 'sessions/addSession';
const UPDATE_SESSION = 'sessions/updateSession';
const DELETE_SESSION = 'sessions/deleteSession';

// Action creators
export const loadSessions = data => ({
  type: LOAD_SESSIONS,
  payload: data
});

export const loadSession = data => ({
    type: LOAD_SESSION,
    payload: data
  });

export const addSession = data => ({
  type: ADD_SESSION,
  payload: data
});

export const updateSession = (sessionId, data) => ({
  type: UPDATE_SESSION,
  data: {
    id: sessionId,
    ...data,
  },
});

export const deleteSession = id => ({
  type: DELETE_SESSION,
  payload: id
});

// Thunks
export const getSessionsThunk = () => async dispatch => {
  const response = await fetch('/api/sessions/');

  if (response.ok) {
    const data = await response.json();
    dispatch(loadSessions(data));
    return data;
  }
};

export const getSessionThunk = id => async dispatch => {
    const response = await fetch(`/api/sessions/${id}`);

    if (response.ok) {
      const data = await response.json();
      dispatch(loadSession(data));
      return data;
    }
  };

  export const createSessionThunk = (gym_id, partner_id, details, session_date, session_type) => async (dispatch) => {
    const sessionData = {
      gym_id,
      partner_id,
      details,
      session_date,
      session_type,
    };

    const response = await fetch('/api/sessions/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sessionData),
    });

    if (response.ok) {
      const data = await response.json();
      dispatch(addSession(data));
      return data;
    }
  };



export const updateSessionThunk = (sessionId, sessionData) => async dispatch => {
  const response = await fetch(`/api/sessions/${sessionId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(sessionData)
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(updateSession(sessionId, data));
    return data;
  }
};

export const deleteSessionThunk = id => async dispatch => {
  const response = await fetch(`/api/sessions/${id}`, {
    method: 'DELETE'
  });

  if (response.ok) {
    dispatch(deleteSession(id));
  }

};

// Initial state
const initialState = {};


// Reducer
export default function sessionsReducer(state = initialState, action){
  switch (action.type) {
    case LOAD_SESSIONS:
      return {
        ...state,
        ...action.payload
      };
      case LOAD_SESSION:
      return {
        ...state,
        ...action.payload
      };
    case ADD_SESSION:
      return {
        ...state,
        sessions: {
          [action.payload.id]: action.payload,
        }
      };
    case UPDATE_SESSION:
      return {
        ...state,
        [action.data.id]: action.data,
      };
    case DELETE_SESSION:
      const newState = { ...state };
      delete newState[action.payload];
      return newState;
    default:
      return state;
  }
};
