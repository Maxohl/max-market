const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dbConnection = require('../db');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Received password:', password);

    // Check if the username exists in the database
    const user = await dbConnection.collection('user').findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Incorrect username or password' });
    }

    // Compare the provided password with the hashed password from the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log('Password comparison failed. Provided password:', password);
      return res.status(401).json({ message: 'Incorrect username or password' });
    }

    // If the username and password are correct, generate a JWT token
    const token = jwt.sign({ userID: user._id.toString(), username: user.username }, 'TheSecretSpiceOfLifeIsToHaveFun', { expiresIn: '1h' });

    // Send the token back to the client
    console.log(user.address)
    res.status(200).json({ message: 'Login successful', token, user:{
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address
    } });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;