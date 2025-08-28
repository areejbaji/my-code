
// const express = require("express");
// const router = express.Router();
// const { verifyTokenAndAdmin } = require("../middlewares/authMiddleware");
// const User = require("../models/User");
// const Product = require("../models/Product");
// const Order = require("../models/Order");

// // Admin dashboard
// router.get("/dashboard", verifyTokenAndAdmin, (req, res) => {
//   res.json({ message: "Welcome to Admin Dashboard", user: req.user });
// });

// // Stats
// router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
//   try {
//     const usersCount = await User.countDocuments();
//     const productsCount = await Product.countDocuments();
//     const ordersCount = await Order.countDocuments();
//     const categoriesCount = await Product.distinct("category");
//     const subcategoriesCount = await Product.distinct("subCategory");

//     res.json({
//       users: usersCount,
//       products: productsCount,
//       orders: ordersCount,
//       categories: categoriesCount.length,
//       subcategories: subcategoriesCount.length
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching stats" });
//   }
// });

// // Get all users
// router.get("/users", verifyTokenAndAdmin, async (req, res) => {
//   try {
//     const users = await User.find();
//     res.status(200).json(users);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Delete a user
// router.delete("/users/:id", verifyTokenAndAdmin, async (req, res) => {
//   try {
//     await User.findByIdAndDelete(req.params.id);
//     res.status(200).json({ message: "User deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Orders routes
// router.get("/orders", verifyTokenAndAdmin, async (req, res) => {
//   try {
//     const orders = await Order.find().populate("user", "name email");
//     res.status(200).json(orders);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching orders" });
//   }
// });

// router.get("/orders/:id", verifyTokenAndAdmin, async (req, res) => {
//   try {
//     const order = await Order.findOne({ orderId: req.params.id }).populate("user", "name email");
//     if (!order) return res.status(404).json({ message: "Order not found" });
//     res.status(200).json(order);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching order details" });
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const { verifyTokenAndAdmin } = require("../middlewares/authMiddleware");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

// Admin dashboard
router.get("/dashboard", verifyTokenAndAdmin, (req, res) => {
  res.json({ message: "Welcome to Admin Dashboard", user: req.user });
});

// Stats
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const productsCount = await Product.countDocuments();
    const ordersCount = await Order.countDocuments();
    const categoriesCount = await Product.distinct("category");
    const subcategoriesCount = await Product.distinct("subCategory");

    res.json({
      users: usersCount,
      products: productsCount,
      orders: ordersCount,
      categories: categoriesCount.length,
      subcategories: subcategoriesCount.length
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching stats" });
  }
});

// Get all users
router.get("/users", verifyTokenAndAdmin, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a user
router.delete("/users/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ---------------- ORDERS ----------------

// Get all orders
router.get("/orders", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    res.status(200).json({ status: true, orders });
  } catch (err) {
    res.status(500).json({ status: false, message: "Error fetching orders" });
  }
});

// Get single order by orderId
router.get("/orders/:orderId", verifyTokenAndAdmin, async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId }).lean();
    if (!order) return res.status(404).json({ status: false, message: "Order not found" });
    res.status(200).json({ status: true, order });
  } catch (err) {
    res.status(500).json({ status: false, message: "Error fetching order details" });
  }
});

// Update order status
router.put("/orders/:orderId/status", verifyTokenAndAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["Pending", "Shipped", "Delivered"].includes(status)) {
      return res.status(400).json({ status: false, message: "Invalid status" });
    }

    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { status },
      { new: true }
    ).lean();

    if (!order) return res.status(404).json({ status: false, message: "Order not found" });
    res.json({ status: true, message: "Order status updated", order });
  } catch (err) {
    res.status(500).json({ status: false, message: "Error updating order status" });
  }
});

// Update return status
router.put("/orders/:orderId/return", verifyTokenAndAdmin, async (req, res) => {
  try {
    const { returnStatus } = req.body;
    const validStatuses = ["Not Returned", "Requested", "Returned"];
    if (!validStatuses.includes(returnStatus)) {
      return res.status(400).json({ status: false, message: "Invalid return status" });
    }

    const order = await Order.findOneAndUpdate(
      { orderId: req.params.orderId },
      { returnStatus },
      { new: true }
    ).lean();

    if (!order) return res.status(404).json({ status: false, message: "Order not found" });
    res.json({ status: true, message: "Return status updated", order });
  } catch (err) {
    res.status(500).json({ status: false, message: "Error updating return status" });
  }
});

module.exports = router;
