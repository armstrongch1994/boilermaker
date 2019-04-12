const router = require('express').Router();
const User = require('../db/models/user');
module.exports = router;

// this is our local authentification
// this is where we have a user in our database who signed up using a username and password with us (aka were not borrowing google or github as an authenticaiton service )

// if they post to login, post because they are sending a body, then we will try to find a user whos email matches the email in the posted body
// if there is no such user, then we will send a 401 (unauthorized username or password)
router.post('/login', async (req, res, next) => {
  try {
    // try to find a user
    const user = await User.findOne({ where: { email: req.body.email } });
    // if no user is found send 401
    if (!user) {
      console.log('No such user found:', req.body.email);
      res.status(401).send('Wrong username and/or password');
      // is there is a user but the password they entered doesnt match the one in the database, we send the same 401 (dont want to give the user to much info about what they entered incorrectly )
    } else if (!user.correctPassword(req.body.password)) {
      console.log('Incorrect password for user:', req.body.email);
      res.status(401).send('Wrong username and/or password');
    } else {
      // if we get here then the user has signed up with us before and they entered the correct username and password
      // req.login comes from passport
      // when we did passport.initialize, it added a method to the request object called .login
      // this is a way for us to manually set req.user in a way that passport knows about, so it can properly sync up with the session
      // req.login is asynchronous becuase it has to create a session and store it in the database, so that could potentially be another server call
      req.login(user, err => (err ? next(err) : res.json(user)));
    }
  } catch (err) {
    next(err);
  }
});

router.post('/signup', async (req, res, next) => {
  try {
    // here we are tyring to create a user with a specific email and password
    const user = await User.create(req.body);
    // if that fails, becuase of a unique contraint error (meaning that user already exists) we send back that exact message
    // if we are able to create the user we use req.login to let passport know about it, serialize the user to the session and set req.user
    req.login(user, err => (err ? next(err) : res.json(user)));
  } catch (err) {
    if (err.name === 'SequelizeUniqueConstraintError') {
      res.status(401).send('User already exists');
    } else {
      next(err);
    }
  }
});
// if we make a request to logout we do more passport stuff
// req.logout() is a passport method that was given to req by passport.initialize => and it removes the user from the session and it deletes req.user for us
// req.session.destroy() is an express-session method (not passport) and not only does it say, for a given client thats connected to us , this users no longer logged in, it also says forget that that clinet is connected to us => and if that client connects to us again its as if they are a brand new client
// then we just send the client to the homepage bc theyve logged out
router.post('/logout', (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect('/');
});

// router.delete('/logout', (req, res, next) => {
//   req.logout();
//   req.session.destroy(error => {
//     if (error) return next(error);
//     res.status(204).end();
//   });
// });

// this is just saying 'who is currently logged in? the front end has amnesia =>  if you refresh in the browser, the browser doesnt know what was going on anymore (its essentially starting from scratch)
// so the first thing the browser will do is ask the server 'who am I, am I logged in?' and the server will confirm and say yes youre still logged in, here you are and send back that users json
// below is essentialy whoever the currently logged in user is
// so in your frond end code if you wanna know if the user is logged in or not you have to ask the backend
router.get('/me', (req, res) => {
  res.json(req.user);
});

/*any reqeust for /auth/google is going to go into our google file  */

router.use('/google', require('./google'));
