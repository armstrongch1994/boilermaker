const db = require('./db');
const User = require('./models/user');
// The purpose of this module is to bring your Sequelize instance (`db`) together
// with your models (which you should define in separate modules in this directory).
// Example:
//
// const Puppy = require('./puppy')
// const Owner = require('./owner')

// const Boilermaker = require('./boilermaker');
// const User = require('./models/user.js/index.js');
console.log('USER', User);
require('./models');
console.log(db);
module.exports = db;
// After you've required all of your models into this module, you should establish
// associations (https://sequelize-guides.netlify.com/association-types/) between them here as well!

// Example:
//
// Puppy.belongsTo(Owner)
// Include your models in this exports object as well!
