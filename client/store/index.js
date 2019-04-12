import { createStore, applyMiddleware, combineReducers } from 'redux';
// import loggerMiddleware from 'redux-logger';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import user from './user';
import { composeWithDevTools } from 'redux-devtools-extension';
// import axios from 'axios';

// const initialState = {
//   state: {},
// };

// const CONSTANT = 'CONSTANT';

// const useConstant = () => ({
//   type: CONSTANT,
// });

// const reducer = (state = initialState, action) => {
//   switch (action.type) {
//     case CONSTANT:
//       return state;
//     default:
//       return state;
//   }
// };
// const store = createStore(
//   reducer,
//   applyMiddleware(thunkMiddleware, createLogger())
// );

const reducer = combineReducers({ user });
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({ collapsed: true }))
);
// create store is initializing our store
const store = createStore(reducer, middleware);

export default store;
export * from './user';

/* 
redux overview 
  - createStore() is used to initialize our redux store which is where all of our app wide stateful data will live (stateful meaning data that changes over time)
 
- combine reducers is a way to split up the state updates into individual reducer functions and then fuse them together, it literally means combine reducers  


-apply middleware: allows redux to be enhanced with middleware, so essentially everytime an action is dispatched, maybe we want to intercept that action, do some special side effect and then pass the action down the chain or possibly dont 

- redux logger: example of such middleware. redux logger is going to log actions that are posted to redux 

-thunk middleware is going to let us do side effects (so stuff that isnt statue update logic but make network calls or talk to local storage )

- compose with dev tools from redux dev tools extension: this is a fool proof way of integrating with the redux dev tools extension in chrome 

- then the user reduce is what were using as our reducer
  - there is only one reducer in our combine reducer but the idea is that youre going to add to it 
  
- the store takes a primary reducer which handles all of the state updating logic, but it can also accept middlewares  
*/
