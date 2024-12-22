const { DataTypes, Sequelize } = require('sequelize');
const sequelize = require('../config/config');
const User = require('./user');

// Slug
// description
// tags

const Article = sequelize.define('article', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  content: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdBy: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
})

console.log(Article instanceof Sequelize.Model);

Article.belongsTo(User, { foreignKey: 'createdBy'});

module.exports = Article;