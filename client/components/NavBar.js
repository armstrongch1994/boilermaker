import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../store';

// inside the NavBar params you would normlly see props being passed in, but all were doing is destructuring our props object to get handleClick and isLoggedIn, which are both given to use but mapstateTo props and match dispatch to props
const Navbar = ({ handleClick, isLoggedIn }) => (
  // navBar is given handleClick and isLoggedIn by our connect function
  <div>
    <h1>BOILERMAKER</h1>
    <nav>
      {isLoggedIn ? (
        <div>
          {/* The navbar will show these links after you log in */}
          <Link to="/home">Home</Link>
          <a href="#" onClick={handleClick}>
            Logout
          </a>
        </div>
      ) : (
        <div>
          {/* The navbar will show these links before you log in */}
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </div>
      )}
    </nav>
    <hr />
  </div>
);

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    // these keys inside of our object are going to be keys on our props object
    // so if we do props.isLoggedIn => we will get !!state.user.id which is checking to see if we the state.user part of our state has an id property
    // this is basically saying 'is there a user or not'
    // we are using the presence of an id to mean whether we have a user or not
    // if there is an id were logged in, if there isnt an id were not logged in
    // so again were creating a property based on our redux state and giving our component access to that property so that our component can display a certain view based on whether or not we have a user logged in
    isLoggedIn: !!state.user.id,
  };
};

// now handleClick is also going to be a key on our props object
// and when its called were going to dispatch logout() which is one of our thunks from our store that we've imported
const mapDispatch = dispatch => {
  return {
    handleClick() {
      dispatch(logout());
    },
  };
};

export default connect(
  mapState,
  mapDispatch
)(Navbar);

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
};

/* 
- we are pulling in the link componnet from react router dom which on the front end look like <a href> tags, but when they are clicked on javascript will do an intercept and figure out which component should be brought into view

- were also imporing our logout action creator

- and then we have the navbar functional component 


- high level overview
    - we have these react components, which is saying if you give me an object with handleClick and isLogged i will spit out an html view with some data
    - the data lives in our redux state 
    - components can also have local state, along side the redux state => it just depends on what you need from a particular componnet 
    - a useful rule of thumb for what data to keep in state and what data to make local state is, 
        - UI state (so when a user clicks a button or inputting in a form friend) state where youre interacting with that page in some way belongs in reacts local state 
        - but the data that it prepresents, so when youre trying to submit a form, or the toggle button means youve changed a users preferences for the app belongs in the redux state 



    - what is connect doing: 
        - we have changing state living in redux 
        - we have react components that take props and spit out html
            - and we need a way to connect the two 
            - aka a way for the react component to get the state from redux (mapStateToProps) and a way for the react component to put information back into redux (map dispatch to props)
            - dispatch is a function that can send stuff to redux 
        - and connect is bascially saying 'given these two specifications (mapState and mapDispatch) wrap them around this component and if the redux state changes, this component will automatically re-render 
        - and if the react component dispatches /activates one of these functions we will dispatch back up to the store 

        

*/
