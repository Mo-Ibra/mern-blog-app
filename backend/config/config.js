const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.DATABASE_HOST,
  username: 'root',
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  // logging: false, // Disable logging, or set to `true` to debug
});

module.exports = sequelize;