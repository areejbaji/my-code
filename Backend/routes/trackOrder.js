const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// POST /api/track-order - Track order by orderId + phone/email
router.post("/", async (req, res) => {
  try {
    const { orderId, phone } = req.body;

    if (!orderId || !phone) {
      return res.status(400).json({ message: "Order ID and phone are required." });
    }

    const order = await Order.findOne({ orderId, "shipping.phone": phone });

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    res.status(200).json({ order });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while tracking order." });
  }
});

module.exports = router;
