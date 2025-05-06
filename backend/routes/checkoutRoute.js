const express = require("express");
const { ObjectId } = require("mongodb");
const dbConnection = require("../db");

const router = express.Router();

// Create a new checkout order
router.post("/", async (req, res) => {
  try {
    const { userId, items, totalPrice, shippingAddress, status } = req.body;
    if (!userId || !items || !totalPrice || !shippingAddress || !status) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const formattedItems = items.map((item) => {
      if (!ObjectId.isValid(item.productId) || !ObjectId.isValid(item.sellerId)) {
        throw new Error("Invalid product ID or seller ID format");
      }
      return {
        productId: new ObjectId(item.productId),
        sellerId: new ObjectId(item.sellerId), 
        quantity: item.quantity,
        size: item.size || null,
        color: item.color || null,
      };
    });

    // Creating the order
    const order = {
      userId: new ObjectId(userId),
      items: formattedItems,
      totalPrice: parseFloat(totalPrice),
      status,
      shippingAddress: {
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zipCode: shippingAddress.zipCode,
        country: shippingAddress.country,
      },
      createdAt: new Date().toISOString(),
    };

    const result = await dbConnection.collection("orders").insertOne(order);

    if (!result.insertedId) {
      return res.status(500).json({ error: "Failed to create order" });
    }

    // Updating product quantity
    for (const item of formattedItems) {
      await dbConnection.collection("Products").updateOne(
        { _id: item.productId }, // Find product by ID
        { $inc: { stock: -item.quantity } } // Reduce quantity equal to the amount purchased
      );
    }

    return res.status(201).json({ message: "Order placed successfully", orderId: result.insertedId });
  } catch (error) {
    console.error("Error processing checkout:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

