
const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");

// ----------------- PLACE ORDER -----------------
router.post("/", async (req, res) => {
  try {
    const { userId, items, shipping, totalAmount, paymentMethod, country } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    // ✅ stock check for each item
    for (let item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.productId}` });
      }

      let availableStock =
        item.size === "Custom" ? product.customStock : product.stock[item.size];

      if (availableStock < item.quantity) {
        return res.status(400).json({
          message: `Only ${availableStock} left in stock for ${product.name} (Size: ${item.size})`,
        });
      }
    }

    // ✅ reduce stock
    for (let item of items) {
      const product = await Product.findById(item.productId);

      if (item.size === "Custom") {
        await Product.findByIdAndUpdate(item.productId, {
          $set: { customStock: Math.max(0, product.customStock - item.quantity) },
        });
      } else {
        await Product.findByIdAndUpdate(item.productId, {
          $set: { [`stock.${item.size}`]: Math.max(0, product.stock[item.size] - item.quantity) },
        });
      }
    }

    // ✅ Generate orderId with Date.now() (always unique)
    const generatedOrderId = `ORD-${Date.now()}`;

    // ✅ create new order
    const newOrder = new Order({
      orderId: generatedOrderId,
      userId: userId || null,
      items,
      shipping,
      totalAmount,
      paymentMethod: paymentMethod || "Cash on Delivery",
      country: country || "Pakistan",
      status: "Pending",
      returnStatus: "Not Returned",
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("Order placement error:", err);
    res.status(500).json({ message: "Failed to place order", error: err.message });
  }
});

module.exports = router;
