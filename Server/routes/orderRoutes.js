const express = require("express");
const Order = require("../models/Order");
const router = express.Router();

// ✅ Fetch Order by ID (No Authentication Required)
router.get("/:id", async (req, res) => {
  console.log("📢 Fetching order with ID:", req.params.id);
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    console.log("✅ Order found:", order);
    res.json(order);
  } catch (error) {
    console.error("❌ Error fetching order:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Create Order (No Authentication Required)
router.post("/", async (req, res) => {
  console.log("📢 Received order request:", req.body);

  const { orderItems, totalPrice } = req.body;
  if (!orderItems || orderItems.length === 0) {
    return res.status(400).json({ message: "No order items" });
  }

  try {
    const order = new Order({
      orderItems,
      totalPrice,
    });

    const createdOrder = await order.save();
    console.log("✅ Order saved to DB:", createdOrder);
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error("❌ Error saving order:", error);
    res.status(500).json({ message: "Failed to save order" });
  }
});

module.exports = router;