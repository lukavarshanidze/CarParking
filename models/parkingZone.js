const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const ParkingZone = sequelize.define('parkingZone', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  address: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  hourlyPrice: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  taken: {
    type: Sequelize.INTEGER,
    allowNull: false,
  }
});

module.exports = ParkingZone;