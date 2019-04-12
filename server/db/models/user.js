const crypto = require('crypto');
const Sequelize = require('sequelize');
const db = require('../db');

// the define method actually takes 3 parameters, the name of the model
// the next parameter is an object holding all of the fields that actually go into the database table
// the third paramerter that were not users are options that we could use to customize the table
const User = db.define('user', {
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    // Making `.password` act like a func hides it when serializing to JSON.
    // This is a hack to get around Sequelize's lack of a "private" option.
    get() {
      return () => this.getDataValue('password');
    },
  },
  salt: {
    type: Sequelize.STRING,
    // Making `.salt` act like a function hides it when serializing to JSON.
    // This is a hack to get around Sequelize's lack of a "private" option.
    // What you can do something in sequelize is says: ill store a value in the database one way, but when i read it in javascript, ill look at it a different way
    // sequelize does not account for private fields (fields that you want ot have access to on the server side but never leaked)
    // if you get a user object youre likely going to get the sald and password fields also
    // so below is an attempt to prevent those two fields from ever getting to the front end
    // instead of being .password that returns the string, make .passowrd a function that returns the password string
    // so our server has total access ot the password bc we can always call password invoked, and get the password string but if we res.json a sequelize object, it will skip any functions
    get() {
      return () => this.getDataValue('salt');
    },
  },
  googleId: {
    type: Sequelize.STRING,
  },
});

module.exports = User;

// class and instance methods get added directly to the database or the prototype
/*instanceMethods*/

// this is what is used when a created user who already exists logs in
// we take the users password that they input at loggin and put it in the encryptPassword function and see if it equals the password thats stored in our database... becuase the password that is stored in our database already went through the same encryptPassword function
User.prototype.correctPassword = function(candidatePwd) {
  return User.encryptPassword(candidatePwd, this.salt()) === this.password();
};

/**
 * classMethods
 */
User.generateSalt = function() {
  return crypto.randomBytes(16).toString('base64');
};

User.encryptPassword = function(plainText, salt) {
  // we are hashing the password twice and then returning the result so down in setSaltAndPassword were updating the password in our database
  return crypto
    .createHash('RSA-SHA256')
    .update(plainText)
    .update(salt)
    .digest('hex');
};

/**
 * hooks
 */
const setSaltAndPassword = user => {
  if (user.changed('password')) {
    user.salt = User.generateSalt();
    user.password = User.encryptPassword(user.password(), user.salt());
  }
};
/* beforeCreate is a function that sequelize put on the user object that is a hook registration system  */
// it says => before any sequelize rows are created, run this function
User.beforeCreate(setSaltAndPassword);
User.beforeUpdate(setSaltAndPassword);
User.beforeBulkCreate(users => {
  users.forEach(setSaltAndPassword);
});

/* 
- salting a password: even if two users enter the same password, the values will be stored differently in our database: like hashing 
- this ensures that every password in our database is unique even if two people share the same password 
- salting occurs before a user is created and before a user is updated by running setSaltAndPassword function 
    - inside that function, user.changed() is a sequelize method that checks whether the field that we pass in is different from what we currently have in the database, then run this function 
- then when the user goes to loggin again we do the same thing => they give us the password and we look up the salt for that password 
*/
