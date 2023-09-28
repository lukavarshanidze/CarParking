const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Car = sequelize.define('car', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    carName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    carNumber: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    carType: {
        type: Sequelize.STRING,
        allowNull: false
    }
});


module.exports = Car;

