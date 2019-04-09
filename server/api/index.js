'use strict';
const router = require('express').Router();

// any routes that you put here are ALREADY mounted on /api
// this file should almost be like a table of contents for the routers you create!

router.use('/puppies', require('./puppies'));

// If someone makes a request that starts with `/api`,
// but you DON'T have a corresponding router, this piece of
// middleware will generate a 404, and send it to your
// error-handling endware!

router.use((req, res, next) => {
  const error = new Error('API route not found!');
  error.status = 404;
  next(error);
});

module.exports = router;
