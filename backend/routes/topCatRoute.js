const express = require('express');
const dbConnection = require('../db');

const router = express.Router();

// Get top 5 most used categories
router.get('/', async (req, res) => {
  try {
    const topCategories = await dbConnection.collection('Products').aggregate([
      { $unwind: "$categories" }, // Flatten array
      { $group: { _id: "$categories", count: { $sum: 1 } } }, // Count each category
      { $sort: { count: -1 } }, // Sort descending
      { $limit: 5 } // Top 5
    ]).toArray();
   

    res.status(200).json(topCategories);
  } catch (error) {
    console.error('Error fetching top categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;