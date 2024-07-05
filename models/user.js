const { DataTypes } = require('sequelize');
const sequelize = require('../models/index').sequelize;


const User = sequelize.define('User', {
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phone: {
    type: DataTypes.STRING,
  },
});

// module.exports = User;

module.exports = (sequelize, DataTypes) => {
  return User;
};
