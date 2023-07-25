const express = require('express');
const booksRouter = require('./routes/routes');
const app = express();


// Parse JSON request bodies
app.use(express.json());


// Mount the books router at /books
app.use('/books', booksRouter);


// Start the server
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});