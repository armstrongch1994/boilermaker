// The sole purpose of this module is to establish a connection to your
// Postgres database by creating a Sequelize instance (called `db`).
// You shouldn't need to make any modifications here.

const chalk = require('chalk');
const Sequelize = require('sequelize');
// this line requires our package.js in as an object
// we do this becuase we want to get the name of the project to figure out what database to try and connect ro
const pkg = require('../../package.json');
const databaseName =
  pkg.name + (process.env.NODE_ENV === 'test' ? '-test' : '');
console.log(chalk.yellow('Opening database connection'));

// create the database instance that can be used in other database files
const db = new Sequelize(
  process.env.DATABASE_URL || `postgres://localhost:5432/${databaseName}`,
  {
    logging: false, // so we don't see all the SQL queries getting made
  }
);

module.exports = db;
