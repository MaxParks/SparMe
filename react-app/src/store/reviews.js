// Constants
const LOAD_REVIEWS = 'reviews/loadReviews';
const LOAD_REVIEW = 'review/loadReview';
const ADD_REVIEW = 'reviews/addReview';
const UPDATE_REVIEW = 'reviews/updateReview';
const DELETE_REVIEW = 'reviews/deleteReview';

// Action creators
export const loadReviews = data => ({
  type: LOAD_REVIEWS,
  payload: data
});

export const loadReview = data => ({
  type: LOAD_REVIEW,
  payload: data
});

export const addReview = data => ({
  type: ADD_REVIEW,
  payload: data
});

export const updateReview = (reviewId, data) => ({
  type: UPDATE_REVIEW,
  data: {
    id: reviewId,
    ...data,
  },
});

export const deleteReview = id => ({
  type: DELETE_REVIEW,
  payload: id
});

// Thunks
export const getReviewsThunk = () => async dispatch => {
    const response = await fetch('/api/reviews/');

    if (response.ok) {
      const arrayData = await response.json();
      const data = arrayData.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {});
      dispatch(loadReviews(data));
      return data;
    }
  };

export const getReviewThunk = id => async dispatch => {
  const response = await fetch(`/api/reviews/${id}`);

  if (response.ok) {
    const data = await response.json();
    dispatch(loadReview(data));
    return data;
  }
};

export const createReviewThunk = (session_id, rating, review_text) => async (dispatch) => {
  const reviewData = {
    session_id,
    rating,
    review_text,
  };

  const response = await fetch('/api/reviews/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reviewData),
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(addReview(data));
    return data;
  }
};

export const updateReviewThunk = (reviewId, reviewData) => async dispatch => {
  const response = await fetch(`/api/reviews/${reviewId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(reviewData)
  });

  if (response.ok) {
    const data = await response.json();
    dispatch(updateReview(reviewId, data));
    return data;
  }
};

export const deleteReviewThunk = id => async dispatch => {
  const response = await fetch(`/api/reviews/${id}`, {
    method: 'DELETE'
  });

  if (response.ok) {
    dispatch(deleteReview(id));
  }
};

// Initial state
const initialState = {
    reviews: {},
};

// Reducer
export default function reviewsReducer(state = initialState, action){
  switch (action.type) {
    case LOAD_REVIEWS: {
        return {
          ...state,
          reviews: {
            ...state.reviews,
            ...action.payload
          }
        }
      }
    case LOAD_REVIEW:
      return {
        ...state,
        ...action.payload
      };
      case ADD_REVIEW: {
        return {
          ...state,
          reviews: {
            ...state.reviews,
            [action.payload.id]: action.payload,
          }
        };
      }
      case UPDATE_REVIEW: {
        return {
          ...state,
          reviews: {
            ...state.reviews,
            [action.data.id]: action.data,
          }
        };
      }
      case DELETE_REVIEW: {
        const newState = { ...state };
        delete newState.reviews[action.payload];
        return newState;
      }
    default:
      return state;
  }
};
