// Constants
const LOAD_GYMS = 'gyms/loadGyms';
const LOAD_GYM = 'gym/loadGym';
const ADD_GYM = 'gyms/addGym';
const UPDATE_GYM = 'gyms/updateGym';
const DELETE_GYM = 'gyms/deleteGym';
const JOIN_GYM = 'gyms/joinGym';
const LOAD_GYM_MEMBERS = 'gyms/LOAD_GYM_MEMBERS';
const LOAD_GYM_SESSIONS = 'gyms/LOAD_GYM_SESSIONS';

// Action creators
export const loadGyms = data => ({
  type: LOAD_GYMS,
  payload: data
});

export const loadGym = data => ({
  type: LOAD_GYM,
  payload: data
});

export const addGym = data => ({
  type: ADD_GYM,
  payload: data,
  userGyms: data.user_gyms
});

export const updateGym = (gymId, data) => ({
  type: UPDATE_GYM,
  data: {
    id: gymId,
    ...data,
  },
});

export const deleteGym = id => ({
  type: DELETE_GYM,
  payload: id
});

export const joinGym = data => ({
  type: JOIN_GYM,
  payload: data
});

export const loadGymMembers = (gymId, members) => ({
  type: LOAD_GYM_MEMBERS,
  payload: {
    gymId,
    members,
  },
});

export const loadGymSessions = (gymId, sessions) => ({
  type: LOAD_GYM_SESSIONS,
  payload: {
    gymId,
    sessions,
  },
});


// Thunks
export const getGymsThunk = () => async dispatch => {
  const response = await fetch('/api/gyms/');

  if (response.ok) {
    const data = await response.json();
    dispatch(loadGyms(data));
    return data;
  }
};

export const getGymThunk = id => async dispatch => {
  const response = await fetch(`/api/gyms/${id}`);

  if (response.ok) {
    const data = await response.json();
    dispatch(loadGym(data));
    return data;
  }
};

export const createGymThunk = (name, city, martial_art) => async dispatch => {
  const gymData = {
    name,
    city,
    martial_art
  };

  const response = await fetch('/api/gyms/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(gymData)
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(addGym(data));
    return data;
  }
};

export const updateGymThunk = (gymId, gymData) => async dispatch => {
  const response = await fetch(`/api/gyms/${gymId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(gymData)
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(updateGym(gymId, data));
    return data;
  }
};

export const deleteGymThunk = id => async dispatch => {
  const response = await fetch(`/api/gyms/${id}`, {
    method: 'DELETE'
  });

  if (response.ok) {
    dispatch(deleteGym(id));
  }
};

export const joinGymThunk = id => async dispatch => {
  const response = await fetch(`/api/gyms/join_gym`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ gym_id: id })
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(joinGym(data));
    return data;
  }
};

export const getGymMemberThunk = (id) => async (dispatch) => {
  try {
    const response = await fetch(`/api/gyms/${id}`);
    if (!response.ok) {
      throw new Error('Failed to get gym');
    }
    const data = await response.json();
    dispatch(loadGym(data));
    dispatch(loadGymMembers(data.id, data.members));
    return data;
  } catch (error) {
    console.error(error);
  }
};

export const getGymSessionThunk = (id) => async (dispatch) => {
  try {
    const response = await fetch(`/api/gyms/${id}`);
    if (!response.ok) {
      throw new Error('Failed to get gym');
    }
    const data = await response.json();
    dispatch(loadGym(data));
    dispatch(loadGymSessions(data.id, data.sessions));
    return data;
  } catch (error) {
    console.error(error);
  }
};

// Initial state
const initialState = {
  gyms: [],
  userGyms: [],
};

// Reducer
export default function gymsReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_GYMS:
      return {
        ...state,
        ...action.payload
      };
    case LOAD_GYM:
      return {
        ...state,
        ...action.payload
      };
    case ADD_GYM:
      return {
        ...state,
        gyms: [...state.gyms, action.payload],
        userGyms: [...state.userGyms, ...action.userGyms]
      };
    case UPDATE_GYM:
      return {
        ...state,
        [action.data.id]: action.data,
      };
    case DELETE_GYM:
      const newState = { ...state };
      delete newState[action.payload];
      return newState;
    case JOIN_GYM:
      return {
        ...state,
        userGyms: [...state.userGyms, action.payload]
      };
    case LOAD_GYM_MEMBERS:
      return {
        ...state,
        [action.payload.gymId]: {
          ...state[action.payload.gymId],
          members: action.payload.members,
        },
      };
      case LOAD_GYM_SESSIONS:
      return {
        ...state,
        [action.payload.gymId]: {
          ...state[action.payload.gymId],
          sessions: action.payload.sessions,
        },
      };
    default:
      return state;
  }
}
