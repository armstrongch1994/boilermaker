import { createStore, applyMiddleware } from 'redux';
// import loggerMiddleware from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';

// import axios from 'axios';

const initialState = {
  state: {},
};

const CONSTANT = 'CONSTANT';

const useConstant = () => ({
  type: CONSTANT,
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CONSTANT:
      return state;
    default:
      return state;
  }
};

const store = createStore(
  reducer,
  applyMiddleware(thunkMiddleware, createLogger())
);

export default store;
