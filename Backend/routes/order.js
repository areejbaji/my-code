// const express = require('express');
// const router = express.Router();
// const { getUserOrders } = require('../controllers/orderController');
// const { verifyToken } = require('../middleware/authMiddleware'); // JWT auth middleware

// // Route to get orders for logged-in user
// router.get('/my-orders', verifyToken, getUserOrders);

// module.exports = router;
const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// Create new order
// POST /api/orders
router.post("/", async (req, res) => {
  console.log("Received order:", req.body); // request debug ke liye

  try {
    if (!req.body.items || req.body.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();

    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("Order save error:", err);
    res.status(500).json({ message: "Failed to save order", error: err.message });
  }
});


// router.post("/", async (req, res) => {
//   try {
//     const newOrder = new Order(req.body);
//     await newOrder.save();
//     res.status(201).json({ message: "Order placed successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to place order", error: err.message });
//   }
// });

// Get all orders (for admin)
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
