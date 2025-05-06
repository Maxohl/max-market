const express = require('express');
const bcrypt = require('bcryptjs');
const dbConnection = require('../db');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

    // Check if a user with the given username already exists
    const existingUser = await dbConnection.collection('user').findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // If the username is not taken and password is hashed, proceed to register the user
    await dbConnection.collection('user').insertOne({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword
    });

    // Send confirmation message to the frontend
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
