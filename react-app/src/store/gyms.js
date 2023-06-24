// Constants
const LOAD_GYMS = 'gyms/loadGyms';
const LOAD_GYM = 'gym/loadGym';
const ADD_GYM = 'gyms/addGym';
const UPDATE_GYM = 'gyms/updateGym';
const DELETE_GYM = 'gyms/deleteGym';

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
  payload: data
});

export const updateGym = data => ({
  type: UPDATE_GYM,
  payload: data
});

export const deleteGym = id => ({
  type: DELETE_GYM,
  payload: id
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

export const createGymThunk = gymData => async dispatch => {
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

export const updateGymThunk = (id, gymData) => async dispatch => {
  const response = await fetch(`/api/gyms/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(gymData)
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(updateGym(data));
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

// Initial state
const initialState = {
  gyms: [],
  gym: null
};

// Reducer
export default function gymsReducer(state = initialState, action){
  switch (action.type) {
    case LOAD_GYMS:
      return {
        ...state,
        gyms: action.payload
      };
    case LOAD_GYM:
      return {
        ...state,
        gym: action.payload
      };
    case ADD_GYM:
      return {
        ...state,
        gyms: [...state.gyms, action.payload]
      };
    case UPDATE_GYM:
      return {
        ...state,
        gyms: state.gyms.map(gym =>
          gym.id === action.payload.id ? action.payload : gym
        )
      };
    case DELETE_GYM:
      return {
        ...state,
        gyms: state.gyms.filter(gym => gym.id !== action.payload)
      };
    default:
      return state;
  }
};
