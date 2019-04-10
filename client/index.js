import React from 'react';
import { render } from 'react-dom';
import store from './reducers/index.js';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './templates/Home';
import NotFound from './templates/NotFound';
render(
  <Provider store={store}>
    <Router>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="*" component={NotFound} />
      </Switch>
    </Router>
  </Provider>,
  document.getElementById('app')
);
