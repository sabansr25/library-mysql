/*
const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'Saba@1380',
    database: 'library'
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }

    connection.query('SELECT 1 + 1 AS solution', (err, results, fields) => {
        connection.release();

        if (err) {
            console.error('Error executing MySQL query:', err);
            return;
        }

        console.log('MySQL is connected. The solution is:', results[0].solution);
    });
});

module.exports = pool;
*/

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

// Define a model for the books table
const Book = sequelize.define('Book', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false
    },
    year: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
});

module.exports = { sequelize, Book };

