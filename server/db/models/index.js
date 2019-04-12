// this file is just going to tie all of our models together to make them easy exported
// that way we can import the models folder where we need our models, and since it will grab index.js by default we will have access to al of our models
const User = require('./user');
const Boilermaker = require('./boilermaker');
/**
 * If we had any associations to make, this would be a great place to put them!
 * ex. if we had another model called BlogPost, we might say:
 *
 *    BlogPost.belongsTo(User)
 */

/**
 * We'll export all of our models here, so that any time a module needs a model,
 * we can just require it from 'db/models'
 * for example, we can say: const {User} = require('../db/models')
 * instead of: const User = require('../db/models/user')
 */
module.exports = {
  User,
  Boilermaker,
};
