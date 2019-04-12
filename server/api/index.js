// this creates our router and if any requests come in and it starts with /users => go into the users router
const router = require('express').Router();
module.exports = router;

router.use('/puppies', require('./puppies'));
router.use('/users', require('./users'));

// If someone makes a request that starts with `/api`,
// but you DON'T have a corresponding router, this piece of
// middleware will generate a 404, and send it to your
// error-handling endware!

router.use((req, res, next) => {
  const error = new Error('API route not found!');
  error.status = 404;
  next(error);
});
