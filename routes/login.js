const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../database/db2');
const router = express.Router();


// Login route
router.post('/login', async (req, res) => {
    console.log(req.body);
    const { email , password } = req.body;

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
        res.redirect('/library');
    } catch (error) {
        console.error(error);
        // Redirect the user to an error page
        res.redirect('/library/sign-up');
    }
});



module.exports = router;
