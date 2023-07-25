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