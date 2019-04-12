import axios from 'axios';
import history from '../history';

/* Action Types  */

const GET_USER = 'GET_USER';
const REMOVE_USER = 'REMOVE_USER';

/* Initial State */

const defaultUser = {};

/* Action Creators */

const getUser = user => ({
  type: GET_USER,
  user,
});

const removeUser = () => ({
  type: REMOVE_USER,
});

/* THUNK CREATORS  */
// thunks are things that we dispatch to redux but they dont end up in the reducer, they get intercepted by the thunk middleware and invoked
// this means that we can do a bunch of side effects in them, we can talk to our backend, check stuff in local storage etc.
// thunks are not technically state updating logic, even though the result of them may update the state
// The thunk middleware we are using passed in dispatch as a parameter and then we do an asynchronous call that gets information about the user and then that is dispatched to the store
// note: we have this auth/me route becuase the browser has amnesia, and everytime we refresh the page the browser forgets who is logged in => so the program we have on the front end is going to invoke this thunk and its gonna look up who is current logged in, and get info about the currently logged in user
// dependency injection: dispach is passed into thunks by the thunk middleware which means we dont have to pull in a store that we can call dispatch on manually ourselves and thats great bc that means that this file could be used with other redux stores
// so essentially by making a function able to accept a dispatch, we dont tie it to any particular dispatch
export const me = () => async dispatch => {
  try {
    const res = await axios.get('/auth/me');
    dispatch(getUser(res.data || defaultUser));
  } catch (error) {
    console.log(error);
  }
};
// in our auth thunk were passing in an email string, password and a method: method being something like 'login' or 'signup'
// inside our thunk we attempt to login or signup by hitting the appropriate route with the use of that method parameter and the email and password creditials
// if this works we will move on to the next try catch
// the next try catch says 'okay they successfully authenticated either login or signup => so lets dispatch that action to redux, the state will update and then we will navigate to home

// this interesting part of this thunk is that we have two try catches
// this first is specifically for the authentication (aka communicating with the backend)
// if that fails we will let redux know and we will change our user state to be an object with an error property
// the return statement here is important bc it means the next try catch will not even be attempted

// if the first try catch succeed we do another try catch where we attempt to update redux => and if that fails we catch our error

export const auth = (email, password, method) => async dispatch => {
  let res;
  try {
    res = await axios.post(`/auth/${method}`, { email, password });
  } catch (authError) {
    return dispatch(getUser({ error: authError }));
  }

  try {
    dispatch(getUser(res.data));
    history.push('/home');
  } catch (dispatchOrHistoryError) {
    console.error(dispatchOrHistoryError);
  }
};
// the logout thunk just says to the server : log me out
// if thats successful we dispatch the removeUser action creator which whipes out the user in the redux state
// then we do history.push() which in short is going to navigate our react app to a different page
// note: there is a way to pass in history into the redux thunks (this is used a file that we imported) and its using redux's 'with extra argument' API
export const logout = () => async dispatch => {
  try {
    await axios.post('/auth/logout');
    dispatch(removeUser());
    history.push('/login');
  } catch (error) {
    console.error(error);
  }
};

// below is our reducer function
// it takes in state and action and updates the state based on the action
// if its a GET_USER: the new state should be that user
// it its REMOVE_USER: the user should be the old state which is default state
// anything else: dont worry about it just return whatever state we had already => by returning the existing state were saying nothing changes and react should not re-render the component (bc the state didnt change)
//
export default function(state = defaultUser, action) {
  switch (action.type) {
    case GET_USER:
      return action.user;
    case REMOVE_USER:
      return defaultUser;
    default:
      return state;
  }
}

/* redux review 

- main diff between a thunk and a regular action creator is that it takes dispatch as a paramter, and its a nested function 
- action creators produce an action in redux and thunks are a function that take dispatch and using dispatch can create an action (they dispatch and action creator)


- good rule of thumb with async functions is that you always need a try/catch block. and if you have two distinct things that can fail youll need to use two separate try catch statements 
*/
