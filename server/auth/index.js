const router = require('express').Router();
const User = require('../db/models/user');
module.exports = router;

const userNotFound = next => {
  const err = new Error('Not found');
  err.status = 404;
  next(err);
};
router.get('/me', async (req, res, next) => {
  try {
    let id = req.user.id;
    let foundUser = await User.findById(id);
    if (foundUser) {
      res.json(foundUser);
    } else {
      userNotFound(next);
    }
  } catch (error) {
    next(error);
  }
});
router.put('/login', async (req, res, next) => {
  try {
    let user = await User.findOne({
      where: {
        email: req.body.email,
        password: req.body.password,
      },
    });
    if (user) {
      // req.session.userID = foundUser.id;
      req.login(user, error => {
        return error ? next(error) : res.json(user);
      });
    } else {
      const err = new Error('Incorrect email or password!');
      err.status = 401;
      next(err);
    }
  } catch (error) {
    next(error);
  }
});

router.post('/signup', (req, res, next) => {
  User.create(req.body)
    .then(user => {
      req.login(user, err => {
        if (err) next(err);
        else res.json(user);
      });
    })
    .catch(next);
});

router.delete('/logout', (req, res, next) => {
  req.logout();
  req.session.destroy(error => {
    if (error) return next(error);
    res.status(204).end();
  });
});
