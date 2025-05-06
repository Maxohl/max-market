const express = require('express');
const { ObjectId } = require('mongodb');
const dbConnection = require('../db');

const router = express.Router();

// Update user profile
router.put('/:userID', async (req, res) => {
  try {
    const { userID } = req.params;
    console.log("Received request to update user with ID:", userID);

    // Ensure userID is a valid ObjectId
    if (!ObjectId.isValid(userID)) {
      console.error("Invalid user ID format:", userID);
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const { firstName, lastName, email, address } = req.body;
    console.log("Received updated data:", { firstName, lastName, email, address });

    // Ensure all fields are present
    if (!firstName || !lastName || !email || !address) {
      console.error("Missing required fields");
      return res.status(400).json({ error: 'All fields must be filled' });
    }

    console.log("Connecting to MongoDB...");
    //get current date
    const updatedAt = new Date().toISOString();
    console.log("Register updated at: ",updatedAt)
    
    // Perform the update
    const updateResult = await dbConnection.collection('user').updateOne(
      { _id: new ObjectId(userID) }, 
      { $set: { firstName, lastName, email, address, updatedAt } }
    );

    console.log("MongoDB update operation result:", updateResult);

    // Check if a document was modified
    if (updateResult.matchedCount === 0) {
      console.error("User not found with ID:", userID);
      return res.status(404).json({ error: 'User not found' });
    }

    // Retrieve the updated user
    const updatedUser = await dbConnection.collection('user').findOne({ _id: new ObjectId(userID) });

    console.log("Updated user data:", updatedUser);

    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });

  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
