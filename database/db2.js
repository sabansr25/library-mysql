
const { Sequelize, DataTypes } = require('sequelize');

// Create a new Sequelize instance and connect to the database
const sequelize = new Sequelize('library', 'root', 'Saba@1380', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 10,
        min: 0,
        idle: 10000
    },
    logging: console.log
});

const User = sequelize.define('User', {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.CHAR,
        allowNull: false
    }
});


module.exports = { sequelize, User };