'use strict';

const db = require('../db');
const Sequelize = require('sequelize');

const Boilermaker = db.define('boilermaker', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  description: {
    type: Sequelize.TEXT,
  },
});

module.exports = Boilermaker;
