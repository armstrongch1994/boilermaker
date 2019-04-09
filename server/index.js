const express = require('express');
const path = require('path');
const app = express();
const morgan = require('morgan');

//logging middleware
app.use(morgan('dev'));

//body parsing middleware
//requests frequently contain a body - if you want to use it in req.body, then youll need some middleware to parse the body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static middleware
// once your browser gets your index.html, it often needs to require static assets from your server - these invlude javascript files, css files and images
app.use(express.static(path.join(__dirname, '../public')));

// Require all of your routes that youve mounted on /api
app.use('/api', require('./api')); // this matches all requests to /api

//Because we generally want to build single page applications (or SPAs) our server should send its index.html for any requests that dont match one of our API routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

//error handleing middleware
app.use((err, req, res, next) => {
  console.error(err);
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal server error');
});

module.exports = app;
