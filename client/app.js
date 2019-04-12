import React from 'react';

//  note how were importing Navbar from the components/index file -> not from the actual navbar module
import { Navbar } from './components';
import Routes from './routes';

const App = () => {
  return (
    <div>
      <Navbar />
      <Routes />
    </div>
  );
};

export default App;

/**
 * so we have our navbar component that we are just importing
 * we have a front end routes component which is just going to be differnet front end routes that we can navigate to
 * we use this routes compoent because react is a single page application so when you first navigate to a react page youre making a single http request and getting back multiple views, so whenever you click a link youre changing the url in the browser but youre not making another http request
 *
 *
 * so some of our urls is just javascript manipulating the page and some of our urls are actually http requests to the backend
 */
