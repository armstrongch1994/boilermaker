const router = require('express').Router();
const { User } = require('../db/models');
module.exports = router;

// when someone requests users/ get all of the users, but only their id and email and send it back
// if there is any problem with and of that, we hand off the error to express to eventually make its way to our centralized error handler
router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and email fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ['id', 'email'],
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
});
