const express = require('express');
const pool = require('../database/db')
const router = express.Router();


// Define a route for getting all books from the database
router.get('/', (req, res) => {
    // Get a connection from the pool
    pool.getConnection((err, connection) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error getting a connection from the pool' });
            return;
        }

        // Execute the query
        connection.query('SELECT * FROM books', (err, results, fields) => {
            // Release the connection back to the pool
            connection.release();

            if (err) {
                console.error(err);
                res.status(500).json({ message: 'Error executing the query' });
                return;
            }

            // Send the results as JSON
            res.json(results);
        });
    });
});

// Define a route for adding a new book to the database
router.post('/', (req, res) => {
    // Get a connection from the pool
    pool.getConnection((err, connection) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error getting a connection from the pool' });
            return;
        }

        // Execute the query
        connection.query('INSERT INTO books SET ?', req.body, (err, results, fields) => {
            // Release the connection back to the pool
            connection.release();

            if (err) {
                console.error(err);
                res.status(400).json({ message: 'Error adding the book to the database' });
                return;
            }

            // Send the new book object as JSON, with the ID assigned by the database
            const newBook = { ...req.body, id: results.insertId };
            res.status(201).json(newBook);
        });
    });
});



// Define a route for getting a single book by ID from the database
router.get('/:id', (req, res) => {
    // Get a connection from the pool
    pool.getConnection((err, connection) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error getting a connection from the pool' });
            return;
        }

        // Execute the query
        connection.query('SELECT * FROM books WHERE id = ?', req.params.id, (err, results, fields) => {
            // Release the connection back to the pool
            connection.release();

            if (err) {
                console.error(err);
                res.status(500).json({ message: 'Error executing the query' });
                return;
            }

            if (results.length === 0) {
                res.status(404).json({ message: 'Book not found' });
                return;
            }

            // Send the book as JSON
            res.json(results[0]);
        });
    });
});



// Define a route for updating a book in the database
router.put('/:id', (req, res) => {
    // Get a connection from the pool
    pool.getConnection((err, connection) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error getting a connection from the pool' });
            return;
        }

        // Execute the query
        connection.query('UPDATE books SET ? WHERE id = ?', [req.body, req.params.id], (err, results, fields) => {
            // Release the connection back to the pool
            connection.release();

            if (err) {
                console.error(err);
                res.status(400).json({ message: 'Error updating the book in the database' });
                return;
            }

            if (results.affectedRows === 0) {
                res.status(404).json({ message: 'Book not found' });
                return;
            }

            // Send the updated book as JSON
            const updatedBook = { ...req.body, id: req.params.id };
            res.json(updatedBook);
        });
    });
});


// Define a route for deleting a book by ID from the database
router.delete('/:id', (req, res) => {
    // Get a connection from the pool
    pool.getConnection((err, connection) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Error getting a connection from the pool' });
            return;
        }

        // Execute the query
        connection.query('DELETE FROM books WHERE id = ?', req.params.id, (err, results, fields) => {
            // Release the connection back to the pool
            connection.release();

            if (err) {
                console.error(err);
                res.status(500).json({ message: 'Error executing the query' });
                return;
            }

            if (results.affectedRows === 0) {
                res.status(404).json({ message: 'Book not found' });
                return;
            }

            // Send a success message as JSON
            res.json({ message: 'Book deleted successfully' });
        });
    });
});

module.exports = router;