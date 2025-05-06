const express = require("express");
const { ObjectId } = require("mongodb");
const dbConnection = require("../db");

const router = express.Router();

//Get orders by userId (the user is checking the order of the products he is buying)
router.get("/user/:userId", async (req, res) => {
  try {
      const { userId } = req.params;
      console.log("Received request for userId:", userId);

      if (!ObjectId.isValid(userId)) {
          console.error("Invalid user ID format:", userId);
          return res.status(400).json({ error: "Invalid user ID format" });
      }

      // Find orders where userId exists
      console.log("Fetching orders for userId:", userId);
      const orders = await dbConnection.collection("orders").find({
          userId: new ObjectId(userId)
      }).toArray();

      console.log("Orders found:", orders.length, orders);

      if (!orders.length) {
          console.warn("No orders found for this user:", userId);
          return res.status(404).json({ error: "No orders found for this user" });
      }

      // Process orders to get product details
      const processedOrders = await Promise.all(orders.map(async (order) => {
          console.log("Processing order:", order._id);

          const processedItems = await Promise.all(order.items.map(async (item) => {
              console.log("Fetching product details for productId:", item.productId);

              // Fetch product details from Products collection
              const product = await dbConnection.collection("Products").findOne(
                  { _id: new ObjectId(item.productId) },
                  { projection: { name: 1, price: 1, imageUrls: 1 } }
              );

              console.log("Product found:", product);

              return product ? {
                  name: product.name,
                  price: product.price,
                  imageUrl: product.imageUrls?.[0] || "",
                  quantity: item.quantity,
                  size: item.size || null,
                  color: item.color || null
              } : null;
          }));

          console.log("Processed order:", order._id, processedItems);

          return {
              items: processedItems.filter(Boolean), // Remover valores nulos
              totalPrice: order.totalPrice,
              status: order.status
          };
      }));

      console.log("Final processed orders response:", processedOrders);
      res.status(200).json(processedOrders);
  } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Internal server error" });
  }
});


// ✅ Get orders by sellerId (seller is checking the orders of the products he is selling)
router.get("/:sellerId", async (req, res) => {
  try {
    const { sellerId } = req.params;
    console.log("Received request for sellerId:", sellerId);

    if (!ObjectId.isValid(sellerId)) {
      console.error("Invalid seller ID format:", sellerId);
      return res.status(400).json({ error: "Invalid seller ID format" });
    }

    // Find orders where sellerId exists inside items array
    console.log("Fetching orders for sellerId:", sellerId);
    const orders = await dbConnection.collection("orders").find({
      "items.sellerId": new ObjectId(sellerId)
    }).toArray();
    
    console.log("Orders found:", orders.length, orders);

    if (!orders.length) {
      console.warn("No orders found for this seller:", sellerId);
      return res.status(404).json({ error: "No orders found for this seller" });
    }

    // Process orders to get product details
    const processedOrders = await Promise.all(orders.map(async (order) => {
      console.log("Processing order:", order._id);

      const filteredItems = await Promise.all(order.items
        .filter(item => {
          const match = item.sellerId.toString() === sellerId;
          console.log(`Checking item ${item.productId}:`, match ? "Matches sellerId" : "Does not match");
          return match;
        })
        .map(async (item) => {
          console.log("Fetching product details for productId:", item.productId);

          // Fetch product details from Products collection
          const product = await dbConnection.collection("Products").findOne(
            { _id: new ObjectId(item.productId) },
            { projection: { name: 1, price: 1, imageUrls: 1 } }
          );

          console.log("Product found:", product);

          return product ? {
            name: product.name,
            price: product.price,
            imageUrl: product.imageUrls?.[0] || "",
            quantity: item.quantity,
            size: item.size || null,
            color: item.color || null
          } : null;
        })
      );

      console.log("Processed order:", order._id, filteredItems);

      return {
        orderId: order._id, // ✅ Adicionando o _id do pedido
        items: filteredItems.filter(Boolean), // Remove null values
        totalPrice: order.totalPrice,
        status: order.status
      };
    }));

    console.log("Final processed orders response:", processedOrders);
    res.status(200).json(processedOrders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    console.log("Received PUT request for order:", orderId);
    console.log("New status received:", status);

    // Validate orderId
    if (!ObjectId.isValid(orderId)) {
      console.error("Invalid order ID format:", orderId);
      return res.status(400).json({ error: "Invalid order ID format" });
    }

    if (!status) {
      console.error("No status provided in request body.");
      return res.status(400).json({ error: "Status is required" });
    }

    const objectId = new ObjectId(orderId);
    console.log("Converted orderId to ObjectId:", objectId);

    console.log("Updating order in database...");
    const updateResult = await dbConnection.collection("orders").updateOne(
      { _id: objectId },
      { $set: { status, updatedAt: new Date() } }
    );

    console.log("MongoDB update result:", updateResult);

    if (updateResult.matchedCount === 0) {
      console.error("Order not found:", orderId);
      return res.status(404).json({ error: "Order not found" });
    }

    // Fetch the updated order
    const updatedOrder = await dbConnection.collection("orders").findOne({ _id: objectId });

    if (!updatedOrder) {
      console.error("Order not found after update:", orderId);
      return res.status(404).json({ error: "Order not found" });
    }

    console.log("Order successfully updated:", updatedOrder);
    res.status(200).json({ message: "Order status updated successfully", order: updatedOrder });

  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


module.exports = router;
