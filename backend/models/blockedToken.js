// Blocked Token Model

const { DataTypes } = require('sequelize');
const sequalize = require('../config/config');

const BlockedToken = sequalize.define('blockedToken', {
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  expiredAt: {
    type: DataTypes.DATE,
    allowNull: false,
  }
}, { timestamps: false });

module.exports = BlockedToken;