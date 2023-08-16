const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const logger = require('morgan'); 
const router = require('./routes/routes');
const app = express();
const ejs = require('ejs');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Use the logger middleware before defining routes
app.use(logger('dev'));

// Mount the router
app.use('/library', router);

// Start the server
const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
