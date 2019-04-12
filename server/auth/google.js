/* 
passport summary 
the ultimate goal of passport is that is gives us this req.user object that we can use in our routes to test certain things about a user => are they an admin, do they have a name .etc 

req.login is a way of manually setting who the user us 
req.logout unsets the user 

NOW if someone wants to login with google we have this file
so were going to want to connect to Google in this case (could be github, or another third party) and in order to do that, we need to set up a strategy 
    - we need to tell passport our secret password that our server knows to talk to google so that google and our server can swap information 
    - we also need to set a verification callback which is the point in an OAuth signup/login  where a user has proven to google that they are who they say they are 
    - google bounces the user over to us telling the user 'now that you've proven that you are a valid google user, tell this server that!'  
    - from our perspective, a user comes back to us and says ' i talked to google and google said everything is okay'
    - and our server says 'did you really talk to google and did they really say everythings okay => becuase im going to need to check that'
    - so the user gives us a token (the string google gave to them) so we can take that token over to google and check with google to verify that the user is valid 
    - so we end up in this state where at passport (on our server) talks to Google gives gives Google the verification token 
    - google responds to us and says yes I just gave a user this same token => that must be the person who's trying to login and they are a valid Google user and they come back to our server in the verification callback 

*/

const passport = require('passport');
const router = require('express').Router();
// to create a google strategy, the constructor were using comes from this library (passport-google-oauth), so if youre trying to integrate with github youll have to lookup that library
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const { User } = require('../db/models');
module.exports = router;

/**
 * For OAuth keys and other secrets, your Node process will search
 * process.env to find environment variables. On your production server,
 * you will be able to set these environment variables with the appropriate
 * values. In development, a good practice is to keep a separate file with
 * these secrets that you only share with your team - it should NOT be tracked
 * by git! In this case, you may use a file called `secrets.js`, which will
 * set these environment variables like so:
 *
 *
 * we have to negotiate with google to get this information => you have to sign up to get your websites ID, cient secret, and match it to the callback that you enter into the site
 *
 * essentially for every authenitcation provider (google, github etc.) you will have some sort of ID to note that 'you are you'
 * the callback url is where google sends that user information => so whenever google redirects the user back to the site, where do they go
 *
 * essentially: this is how passport talks to google and verify our identity with google
 * we have to register to get this secret and ID on the google site
 * we can set this up ahead of time and save it in our secrets
 *
 * process.env.GOOGLE_CLIENT_ID = 'your google client id'
 * process.env.GOOGLE_CLIENT_SECRET = 'your google client secret'
 * process.env.GOOGLE_CALLBACK = '/your/google/callback'
 */

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.log('Google client ID / secret not found. Skipping Google OAuth.');
} else {
  const googleConfig = {
    // NOTE: these need to be filled in with the secret and id you register with on the google site
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK,
  };
  // the (token, refreshToken, profile, done) => {} is the verification callback
  // recap: this is the function that gets call if Google confirms that the person trying to login to us is a valid google user
  // google also gives us in that profile parameter normalized information data about the user (the id, the displayName, and the email)
  const strategy = new GoogleStrategy(
    googleConfig,
    (token, refreshToken, profile, done) => {
      const googleId = profile.id;
      const name = profile.displayName;
      const email = profile.emails[0].value;
      // at this point passport is asking us a question
      // passport says 'google has confirmed that the user is a google user, heres the users google info, which user does this correspond to in your database?
      // so below in the findOrCreate() query, we are using their profile information that google sent back in the profile parameter, to (if they are signing up) create a new user in the database or look up a user thats already signed up in the past
      // so if the user exists we give it to Passport => in the .then(([user]) => done(null, user)) so now passport can create req.user, and set the session etc.
      // if we cannot find a user with that googleID, we will create one and give it the name and email that came from google
      // either way if we end up in that .then(), were telling passport heres the successful user, please set it as req.user
      // if findOrCreate fails, we catch the error and give it to passport so that its aware there is a problem
      User.findOrCreate({
        where: { googleId },
        defaults: { name, email },
      })
        .then(([user]) => done(null, user))
        .catch(done);
    }
  );
  // if the verificationCallback succeeds, we find or create the user, hand it off to passport which means req.users been set and now passport does one more thing => which is going to the success redirect below
  passport.use(strategy);

  // this is saying: if someone tries to get /auth/google, then please passport take over from here
  // eventually after the user and google and passport have talked to eachother, we end up in the verification callback from above and we call done() to say here is a correct user
  // at that point the user is going to automatically make a request to /callback (see below)
  // inside the '/callback' route we call passport.authenticate and either get successRedirect or failureRedirect
  router.get('/', passport.authenticate('google', { scope: 'email' }));
  // this is where the success redirect and not-successful redirect is located
  // if successful go to the hompage, if not go back to /login
  router.get(
    '/callback',
    passport.authenticate('google', {
      successRedirect: '/home',
      failureRedirect: '/login',
    })
  );
}

/* high level overview of a strategy: were trying to says once google or github talks back to us with the user data, how do we match that data to our database and then tell passport that everything is good  */
