const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const User = require('./user');
const Article = require('./article');

const Comment = sequelize.define('comment', {
  content: {
    type: DataTypes.STRING,
    allowNull: false
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
  createdInArticle: {
    type: DataTypes.INTEGER,
    references: {
      model: Article,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
})

// One Comment belongs to one User
Comment.belongsTo(User, { foreignKey: 'createdBy'});

// One Comment belongs to one Article
Comment.belongsTo(Article, { foreignKey: 'createdInArticle'});

module.exports = Comment;