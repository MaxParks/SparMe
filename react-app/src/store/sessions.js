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

export const updateSession = data => ({
  type: UPDATE_SESSION,
  payload: data
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

export const createSessionThunk = sessionData => async dispatch => {
  const response = await fetch('/api/sessions/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(sessionData)
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(addSession(data));
    return data;
  }
};

export const updateSessionThunk = (id, sessionData) => async dispatch => {
  const response = await fetch(`/api/sessions/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(sessionData)
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(updateSession(data));
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
const initialState = {
  sessions: [],
  session: null
};

// Reducer
export default function sessionsReducer(state = initialState, action){
  switch (action.type) {
    case LOAD_SESSIONS:
      return {
        ...state,
        sessions: action.payload
      };
      case LOAD_SESSION:
      return {
        ...state,
        session: action.payload
      };
    case ADD_SESSION:
      return {
        ...state,
        sessions: [...state.sessions, action.payload]
      };
    case UPDATE_SESSION:
      return {
        ...state,
        sessions: state.sessions.map(session =>
          session.id === action.payload.id ? action.payload : session
        )
      };
    case DELETE_SESSION:
      return {
        ...state,
        sessions: state.sessions.filter(session => session.id !== action.payload)
      };
    default:
      return state;
  }
};
