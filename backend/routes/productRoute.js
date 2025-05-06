const express = require("express");
const { ObjectId } = require("mongodb");
const dbConnection = require("../db");

const router = express.Router();

//  Get all products (no user filtering)
router.get("/products", async (req, res) => {
  try {
    const products = await dbConnection.collection("Products").find({}).toArray();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching all products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//  Get products with active (non-expired) discounts
router.get("/discounted", async (req, res) => {
  try {
    const currentDate = new Date();

    const discountedProducts = await dbConnection
      .collection("Products")
      .find({
        discountExpiresAt: { $exists: true, $gt: currentDate },
      })
      .toArray();

    res.status(200).json(discountedProducts);
  } catch (error) {
    console.error("Error fetching discounted products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Add a new product
router.post("/new", async (req, res) => {
  try {
    const { name, description, price, categories, imageUrls, colors, sizes, stock, userID } = req.body;
    
    // Ensure required fields are present
    if (!name || !description || !price || !userID) {
      console.error("Missing required fields");
      return res.status(400).json({ error: "All required fields must be filled" });
    }

    // Ensure userId is a valid ObjectId
    if (!ObjectId.isValid(userID)) {
      console.error("Invalid user ID format:", userID);
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const newProduct = {
      name,
      description,
      price: parseFloat(price), // Ensure price is a number
      categories: Array.isArray(categories) ? categories : [],
      imageUrls: Array.isArray(imageUrls) ? imageUrls : [],
      colors: Array.isArray(colors) ? colors : [],
      sizes: Array.isArray(sizes) ? sizes : [],
      stock: Number.isInteger(stock) ? stock : 0,
      userID: new ObjectId(userID),
      createdAt: new Date().toISOString(),
    };

    console.log("Attempting to insert product:", newProduct);

    // Insert into database
    const result = await dbConnection.collection("Products").insertOne(newProduct);

    if (result.insertedId) {
      console.log("Product added successfully:", result.insertedId);
      res.status(201).json({ message: "Product added successfully", productId: result.insertedId });
    } else {
      console.error("Failed to insert product");
      res.status(500).json({ error: "Failed to add product" });
    }
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


// ✅ Update a product by ID
router.put("/update/:productID", async (req, res) => {
  try {
    const { productID } = req.params;
    const updatedProduct = req.body;

    if (!ObjectId.isValid(productID)) {
      return res.status(400).json({ error: "Invalid product ID format" });
    }

    // Remove product ID 
    delete updatedProduct._id;

    // Convert userID to ObjectId
    if (updatedProduct.userID) {
      updatedProduct.userID = new ObjectId(updatedProduct.userID);
    }

    // Convert price to a float
    if (updatedProduct.price) {
      updatedProduct.price = parseFloat(updatedProduct.price);
    }

    const result = await dbConnection
      .collection("Products")
      .updateOne({ _id: new ObjectId(productID) }, { $set: updatedProduct });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Retrieve all products by user
router.get("/user/:userID", async (req, res) => {
  try {
    const { userID } = req.params;

    if (!ObjectId.isValid(userID)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const products = await dbConnection
      .collection("Products")
      .find({ userID: new ObjectId(userID) })
      .toArray();

    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Apply discount to multiple products
router.post("/apply-offer", async (req, res) => {
  try {
    const { productIds, discount, expireDate } = req.body;

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ error: "No product IDs provided" });
    }

    if (typeof discount !== "number" || discount <= 0) {
      return res.status(400).json({ error: "Invalid discount value" });
    }

    if (!expireDate || isNaN(new Date(expireDate))) {
      return res.status(400).json({ error: "Invalid expiration date" });
    }

    const objectIds = productIds.map((id) => new ObjectId(id));
    
    const result = await dbConnection.collection("Products").updateMany(
      { _id: { $in: objectIds } },
      {
        $set: {
          discountValue: discount,
          discountExpiresAt: new Date(expireDate),
        },
      }
    );

    res.status(200).json({
      message: `Offer applied to ${result.modifiedCount} product(s)`,
    });
  } catch (error) {
    console.error("Error applying offer:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Get a single product by ID
router.get("/:productID", async (req, res) => {
  try {
    const { productID } = req.params;

    if (!ObjectId.isValid(productID)) {
      return res.status(400).json({ error: "Invalid product ID format" });
    }

    const product = await dbConnection
      .collection("Products")
      .findOne({ _id: new ObjectId(productID) });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Delete a product by ID
router.delete("/delete/:productID", async (req, res) => {
  try {
    const { productID } = req.params;

    if (!ObjectId.isValid(productID)) {
      return res.status(400).json({ error: "Invalid product ID format" });
    }

    const result = await dbConnection
      .collection("Products")
      .deleteOne({ _id: new ObjectId(productID) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
