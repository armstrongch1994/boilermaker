import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router-dom';
import history from './history';
import store from './store';
import App from './app';

// establishes socket connection
import './socket';

// we use the Reactdom library to stick our components onto the dom at a certain point
// this is where the code starts in our bundle.js located in the public folder
// this is basically telling the dom to take this react component stick it into the dom where the app id is
// and now the reactDOM is responsible for every time the tree updates, the reactDOM is listening to it and it will compare the old virtual dom to the new virtual dom, figure out the minimum number of changes it needs to make to cause the real dom to look that way and then it updates the real dom

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <App />
    </Router>
  </Provider>,
  document.getElementById('app')
);

// import React from 'react';
// import { render } from 'react-dom';
// import store from './store/index.js';
// import { Provider } from 'react-redux';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import history from './history';
// import Home from './templates/Home';
// import NotFound from './templates/NotFound';
// import {Login, Signup, UserHome} from './components'
// import './socket'

// render(
//   <Provider store={store}>
//     <Router history={history}>
//       <Switch>
//         <Route exact path="/" component={Home} />
//         <Route path="*" component={NotFound} />
//         <Route path="/login" component={Login}/>
//         <Route path="/signup" component={Signup}/>
//         {isLoggedIn && (
//           <Switch>
//             <Route path="/home" component={UserHome}/>
//           </Switch>
//         )}
//         <Route component={Login} />
//       </Switch>
//     </Router>
//   </Provider>,
//   document.getElementById('app')
// );

/* 
we know this is the entry point where our code is getting compiled by looking at webpack.config.js
redux overview
  - the provider is passing our entire react app our store- so that everything has access to our store 

Router 
  - this is coming from react router dom 
  - the router needs a history so it knows where to store where we've been and how to go forward and what states were at
  - we are require the history from another module -> that functionaltiy is broken down in that file
  - finally we have our vanilla react component called <app/> inside of our provider and router 
*/
