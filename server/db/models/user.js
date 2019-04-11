const crypto = require('crypto');
const _ = require('lodash');
const db = require('../db');
const Sequelize = require('sequelize');

const User = db.define(
  'user',
  {
    email: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    password: {
      type: Sequelize.STRING,
    },
    salt: {
      type: Sequelize.STRING,
    },
  },
  {
    hooks: {
      beforeCreate: setSaltAndPassword,
      beforeUpdate: setSaltAndPassword,
    },
  }
);
//instance methods
User.prototype.correctPassword = function(candidatePassword) {
  //returns true or false depending on whether the entered password matches
  return (
    this.Model.encryptPassword(candidatePassword, this.salt) === this.password
  );
};

User.prototype.sanitize = function() {
  return _.omit(this.toJSON(), ['password', 'salt']);
};

//class methods
User.generateSalt = function() {
  //this should generate our random salt
  return crypto.randomBytes(16).toString('base64');
};

User.encryptPassword = function(plainText, salt) {
  // accepts a plain text password and a salt, and returns its hash

  const hash = crypto.createHash('sha1');
  hash.update(plainText);
  hash.update(salt);
  return hash.digest('hex');
};

function setSaltAndPassword(user) {
  //we need to salt and hash again when the user enters their passowrd
  // and do it again whenever they change it
  if (user.changed('password')) {
    user.salt = User.generateSalt();
    user.password = User.encryptPassword(user.password, user.salt);
  }
}
module.exports = User;
