const path = require('path');
const express = require('express');
//logging middleware
const morgan = require('morgan');
// this is going to g-zip whatever we send back in the body (faster)
const compression = require('compression');
// this is going to store information about whatever is using our app => each client is going to have a separate session
const session = require('express-session');
const passport = require('passport');
// this is where were linking express session and sequelize => this is where were storing our sessions in the database
// we use this because we dont want our server to store all the sessions => there could be millions
const SequelizeStore = require('connect-session-sequelize')(session.Store);
// this is our database connection
const db = require('./db');
// here we are creating a new sessionStore that knows about our sequelize database and is connected to express-session
const sessionStore = new SequelizeStore({ db });
// if there is a port thats set by the environment we use that, otherwise we default to localhost:8080
// we test for this becuase of heroku => heroku provides us a port
const PORT = process.env.PORT || 3009;
//finally we  create an express app
const app = express();
const socketio = require('socket.io');
//we export the app for testing purposes
module.exports = app;

// if all the tests are done, stop listening to the sessions which means node can exit gracefully
if (process.env.NODE_ENV === 'test') {
  after('close the session store', () => sessionStore.stopExpiringSessions());
}

// if we are not in production mode, so were in testing or development mode, require the secrets file
// if were on production that came from heroku => heroku doesnt have a secrets file

if (process.env.NODE_ENV !== 'production') require('../secrets');
/* 
reason for serializeUser and deserializeUser 
- we could technically store sessions (which is everything that a user is doing on our website) in cookies 
  - the problem with this is that the cookie is going to be much bigger 
  - cookies are also not that secure so by serializing the user were creating an identifier for this user's session 
  - right now the identifier is the user.id => so if the user is logged in, this is their ID and this is going to be one of the main things that identifies their session 
    - this user session corresponds to this user ID
  - passowrd is an OAuth library that helps us with login and signup, not just locally but with google and facebook (third parties)
    - and it asks us a lot of questions
      - 1. one being: how do you want ot uniquely identify users 
      - 2. and if you have an existing identify for a user, what kind of information about them do you want to restore everytime somebody makes a request 
  - serialize: take some kind of memory structure and convert it to a string and store it as a string 
  - deserialize: takes the serialized string and converts it back into an object 


  passport.serializeUser => we take the user and put their id in 
  passport.deserializeUser => given an ID, we look it up in our database and tell passport: heres the full user object

  in our routes there is a specific side effect from these two functions which is really useful for our routing and its req.user 
    - if someone is logged in, passport will take their information and put it on the request object as rec.user and this is happening in deserializeUser 
      - given the ID we stored in the session, it fetches the actual user object and gives it back to passport and passport says okay im setting that object equal to req.user => and we can use this in our routes 
 */
// for every incoming http request go and fetch the user
passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.models.user.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// here is where were customizing our express app
const createApp = () => {
  // inside this function are the things that our app does while its running

  // morgan allows us to see log messages
  app.use(morgan('dev'));

  // now were parsing the body: if were, for example, posting were going to have a body => sometimes the body will be json => and here were saying, we understand that this is json and we wanna treat it as a json object, not just a string
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // this will automatically g-zip body data which will make our responses smaller
  app.use(compression());

  // session middleware: this is going to keep track of every individual client
  // so every client that makes requests to our server is going to have a session so that we can keep track of what requests theyve made, who they are etc.
  // any info that we want from a client gets stored in a session
  // were storing our sessions in our database
  // the session secret is going to either be set in heroku or the environment
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'a wildly insecure secret',
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
    })
  );
  // the end use case for the session middleware, is that on our request objects for HTTP calls, theres going to be a new field called 'req.session'
  // req.session is just an object that we can store anything we want in it and itll be unique for every client that is connected to us.
  // so this allows us to keep track of the users and treat them as individuals

  /* you have to do this in order to connect passport to express so passport automatically supports certain routes */
  /* passport will read in from this session (which is done with express session) information it needs to fetch the user ID and then create req.user for us ==> becuase passport integrates with our session and it stores the user Id in the session but passport doesnt managae the session directly, it uses the existing session*/
  app.use(passport.initialize());
  app.use(passport.session());

  // anything that is a request that starts with /api, bump them into the router that we defined in our api folder
  app.use('/auth', require('./auth'));
  app.use('/api', require('./api'));

  // static middleware:  some files that youre sending back from requests are not dynamic... they are static  => so all of the files in the pubic folder are static => they are not going to be mutated by js or run in node
  app.use(express.static(path.join(__dirname, '../public')));

  // this route should return the object of a user who is logged in
  app.get('/test', (req, res, next) => {
    res.send(req.user);
  });
  //if there is a get request that ends in DOT something, then we will send a 404 and pass that error that it creates into express's default error handleing function
  app.use((req, res, next) => {
    if (path.extname(req.path).length) {
      const err = new Error('Not found');
      err.status = 404;
      next(err);
    } else {
      next();
    }
  });

  // if any request comes in and its not a get request for something that looks like a file then we are going to assume that we dont know what is being asked for so we will send back the homepage
  // we mainly have this because on the front end we can manipulate the url on the front end, and if another user tries to use that same route our backend does not know about it, so it will send back the homepage => at this point react router takes over, looks at the url and knows what the user wants to look at

  app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });

  //expressed default error handling 'end ware'
  // so if there is an error of any kind, we will console log it and send pack a 500 or if there is a .status on the the error object, we will send that
  app.use((err, req, res, next) => {
    console.error(err);
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || 'Internal server error');
  });
};
// this will actually take our app and assign it to that port
const startListening = () => {
  const server = app.listen(PORT, () =>
    console.log(`Listening on port ${PORT}`)
  );

  const io = socketio(server);
  require('./socket')(io);
};

// this takes our database connection and runs sync on it => becuase we need to synchronize the database before sequal allows us to run queries on it
// its essentially looking at our models and associations and determining what tables we need in order to make queries
const syncDb = () => db.sync();

// first start our sessionStore
// then sync our database
// then create our app
// then start listening : startListing() is actually going to set up our server to listen on the port so that when incoming http requests come in, we have an open connection with the system
async function bootApp() {
  await sessionStore.sync();
  await syncDb();
  await createApp();
  await startListening();
}
// bootApp();

// this is saying.. if this is called from the command line => node server index.js or node server, which is what our start sript says => then run bootApp()
if (require.main === module) {
  console.log('hi were starting the server');
  bootApp();
} else {
  createApp();
}
