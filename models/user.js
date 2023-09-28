const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  balance: {
    type: Sequelize.DOUBLE,
    allowNull: false
  },
  role: {
    type: Sequelize.ENUM('user', 'admin'),
    allowNull: false,
    defaultValue: 'user',
  },
});

module.exports = User;