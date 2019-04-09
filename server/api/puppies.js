const router = require('express').Router();

// matches GET requests to /api/puppies
router.get('/', (req, res, next) => {
  // etc
});

// matches all POST requests to /api/puppies
router.post('/', (req, res, next) => {
  //etc
});

// matches all PUT requests to /api/puppies/:puppyId
router.put('/:puppyId', (req, res, next) => {
  //etc
});

// matches all delete requests to /api/puppies/:puppyId
router.delete('/:puppyId', (req, res, next) => {
  //etc
});

module.exports = router;
