const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const User = require('./user');

const Job = sequelize.define('job', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [5, 255],
    }
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  jobURL: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isUrl: true, // Validates that the string is a valid URL
    }
  },
  salary: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Conditional",
  },
  hasVisaSponsorship: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  isJobRemote: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
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
  isPrimary: {
    type: DataTypes.BOOLEAN, 
    allowNull: false,
    defaultValue: false,
  },
  status: {
    type: DataTypes.ENUM("Pending", "Accepted", "Rejected", "Closed"),
    allowNull: false,
    defaultValue: "Pending",
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

Job.belongsTo(User, { foreignKey: 'createdBy' });

module.exports = Job;