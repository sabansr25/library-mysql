const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const { Book } = require('../database/booksDB');
const { User } = require('../database/usersDB');


// Define a route for signing up
async function createUser(firstName, lastName, email, password) {
    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword
    });
    return user;
}
router.post('/sign-up', async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        // Check if a user with the same email address already exists in the database
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }
        // Create the user
        await createUser(firstName, lastName, email, password);
        // Redirect the user to the login page
        console.log("user created succesfully")
        res.redirect('/library');
    } catch (error) {
        console.error(error);
        // Redirect the user to an error page
        res.redirect('/library/error');
    }
});

router.get('/sign-up', function (req, res) {
    res.render('pages/signUp');
});



// Define a route for loging in
router.post('/login', async (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;

    try {
        // Check if a user with the provided email exists in the database
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare the provided password with the hashed password in the database
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // If the email and password are correct, redirect to a dashboard page or send a success message
        res.redirect('/library/main');
    } catch (error) {
        console.error(error);
        // Redirect the user to an error page
        res.redirect('/library/sign-up');
    }
});
router.get('/login', function (req, res) {
    res.render('pages/login');
});



// Define a route for getting all books from the database
router.get('/books', async (req, res) => {
    try {
        const books = await Book.findAll();
        console.log(books);
        console.log('Rendering template...');
        res.render('pages/books', { books });
        console.log('Accessing books route');
    } catch (err) {
        console.error(err);
        res.status(500).render('pages/error', { message: 'Error getting books from the database' });
    }
});


// Define a route for adding new books to the database
router.route('/add')
    .get((req, res) => {
        res.render('pages/add');
    })
    .post(async (req, res) => {
        try {
            const book = await Book.create(req.body);
          
            res.redirect('/library/books');// Assign a success message
        } catch (err) {
            console.error(err);
            message = 'Error adding the book to the database'; // Assign an error message
            res.status(400).render('pages/add', { message }); // Render the add.ejs template with the message
        }
    });


// Define a route for getting a single book by ID from the database
router.get('/find/:id', async (req, res) => {
    try {
        const book = await Book.findByPk(req.params.id);
        if (!book) {
            res.status(404).render('pages/find', { book: null }); // Render the find.ejs template with null book
            return;
        }
        res.render('pages/find', { book }); // Render the find.ejs template with the book's details
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error getting the book from the database' });
    }
});



// Define a route for deleting a book by ID from the database
router.route('/delete/:id')
    .get(async (req, res) => {
        try {
            const book = await Book.findByPk(req.params.id);
            if (!book) {
                res.status(404).render('pages/delete', { book: null });
                return;
            }
            res.render('pages/delete', { book });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error getting the book from the database' });
        }
    })
    .post(async (req, res) => {
        try {
            const book = await Book.findByPk(req.params.id);
            if (!book) {
                res.status(404).render('pages/delete', { book: null });
                return;
            }
            // Delete the book from the database
            await book.destroy();
            // Redirect the user to a page after successful deletion
            console.log('book deleted successfully')
            res.redirect('/library/books');
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error deleting the book from the database' });
        }
    });



// Define a route for updating a book in the database
router.route('/edit/:id')
    .get(async (req, res) => {
        try {
            const book = await Book.findByPk(req.params.id);
            if (!book) {
                res.status(404).render('pages/edit', { book: null });
                return;
            }
            res.render('pages/edit', { book });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: 'Error getting the book from the database' });
        }
    })
    .post(async (req, res) => {
        try {
            const [numUpdated, book] = await Book.update(req.body, { where: { id: req.params.id } });
            if (numUpdated === 0) {
                res.status(404).json({ message: 'Book not found' });
                return;
            }
            console.log('Book updated successfully');
            res.redirect('/library/books');
        } catch (err) {
            console.error(err);
            res.status(400).json({ message: 'Error updating the book in the database' });
        }
    });



router.get('/', function (req, res) {
    res.render('pages/library');
});



router.get('/main', function (req, res) {
    res.render('pages/main');
});




module.exports = router;