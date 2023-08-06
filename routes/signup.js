const express = require('express');
const bcrypt = require('bcrypt');
const { sequelize, User } = require('../database/db2');
const router = express.Router();

async function createUser(firstName,lastName, email, password) {

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
        res.redirect('/library/login');
    } catch (error) {
        console.error(error);
        // Redirect the user to an error page
        res.redirect('/library/sign-up');
    }
});


module.exports = router;  








