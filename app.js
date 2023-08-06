const express = require('express');
const bodyParser = require('body-parser');
const booksRouter = require('./routes/main');
const usersRouter = require('./routes/signup');
const usersRouter2 = require('./routes/login');
const app = express();
const ejs = require('ejs');

app.set('view engine', 'ejs');
// Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



// about page
app.get('/library', function (req, res) {
    res.render('pages/library');
});

app.get('/library/login', function (req, res) {
    res.render('pages/login');
});

app.get('/library/sign-up', function (req, res) {
    res.render('pages/signUp');
});

 

// Mount the books router 
app.use('/library', booksRouter);
app.use('/library', usersRouter);
app.use('/library', usersRouter2);


// Start the server
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});

