import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import session from './session'
// import gyms from './gyms'
// import sessions from './sessions'
import dashboard from './dashboard'
// import messages from './messages'
// import reviews from './reviews'

const rootReducer = combineReducers({
  session,
  // gyms,
  // sessions,
  // messages,
  // reviews,
  dashboard
});


let enhancer;

if (process.env.NODE_ENV === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require('redux-logger').default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;
