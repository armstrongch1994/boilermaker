const path = require('path');
const express = require('express');
const morgan = require('morgan');
const app = express();
const session = require('express-session');
const passport = require('passport');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const db = require('./db');
const { User } = require('./db');

//logging middleware
app.use(morgan('dev'));

//body parsing middleware
//requests frequently contain a body - if you want to use it in req.body, then youll need some middleware to parse the body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const dbStore = new SequelizeStore({ db: db });

dbStore.sync();
// session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'a wildly insecure secret',
    store: dbStore,
    resave: false,
    saveUninitialized: false,
  })
);

//using passport
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    let user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

//authentication router
// authentication router
app.use('/auth', require('./auth'));
// Require all of your routes that youve mounted on /api
app.use('/api', require('./api'));
// static middleware
// once your browser gets your index.html, it often needs to require static assets from your server - these invlude javascript files, css files and images
app.use(express.static(path.join(__dirname, '../public')));

// any remaining requests with an extension (.js, .css, etc.) send 404
app.use((req, res, next) => {
  if (path.extname(req.path).length) {
    const err = new Error('Not found');
    err.status = 404;
    next(err);
  } else {
    next();
  }
});
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
