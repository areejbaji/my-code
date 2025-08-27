const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { protect, admin } = require("../middlewares/authMiddleware");

// ----------------- PLACE ORDER -----------------
router.post("/", async (req, res) => {
  try {
    const { userId, items, shipping, totalAmount, paymentMethod, country } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    const newOrder = new Order({
      userId: userId || null, // support guest orders
      items,
      shipping,
      totalAmount,
      paymentMethod: paymentMethod || "Cash on Delivery",
      country: country || "Pakistan",
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("Order placement error:", err);
    res.status(500).json({ message: "Failed to place order", error: err.message });
  }
});

// ----------------- GET SINGLE ORDER (ADMIN) -----------------
router.get("/admin/:orderId", protect, admin, async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId }).lean();
    if (!order) {
      return res.status(404).json({ status: false, message: "Order not found" });
    }
    res.json({ status: true, order });
  } catch (err) {
    console.error("Get single order error:", err);
    res.status(500).json({ status: false, message: "Server error" });
  }
});

// ----------------- GET ALL ORDERS (ADMIN) -----------------
router.get("/admin/all", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean(); // newest first
    res.status(200).json({ status: true, orders }); // always returns array
  } catch (err) {
    console.error("Get all orders error:", err);
    res.status(500).json({ status: false, message: err.message });
  }
});

// ----------------- UPDATE ORDER STATUS (ADMIN) -----------------
router.put("/admin/update/:orderId", protect, admin, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!["Pending", "Shipped", "Delivered"].includes(status)) {
      return res.status(400).json({ status: false, message: "Invalid status" });
    }

    const order = await Order.findOneAndUpdate({ orderId }, { status }, { new: true }).lean();
    if (!order) return res.status(404).json({ status: false, message: "Order not found" });

    res.json({ status: true, message: "Order status updated", order });
  } catch (err) {
    console.error("Update order status error:", err);
    res.status(500).json({ status: false, message: "Server error", error: err.message });
  }
});

// ----------------- UPDATE RETURN STATUS (ADMIN) -----------------
router.put("/admin/return/:orderId", protect, admin, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { returnStatus } = req.body;

    const validStatuses = ["Not Returned", "Requested", "Returned"];
    if (!validStatuses.includes(returnStatus)) {
      return res.status(400).json({ status: false, message: "Invalid return status" });
    }

    const order = await Order.findOneAndUpdate({ orderId }, { returnStatus }, { new: true }).lean();
    if (!order) return res.status(404).json({ status: false, message: "Order not found" });

    res.json({ status: true, message: "Return status updated", order });
  } catch (err) {
    console.error("Update return status error:", err);
    res.status(500).json({ status: false, message: "Server error", error: err.message });
  }
});

module.exports = router;

// // Backend/routes/order.js
// const express = require("express");
// const router = express.Router();
// const Order = require("../models/Order");
// const { verifyTokenAndAdmin } = require("../middlewares/authMiddleware");

// // ----------------- PLACE ORDER -----------------
// router.post("/", async (req, res) => {
//   try {
//     const { userId, items, shipping, totalAmount, paymentMethod, country } = req.body;

//     if (!items || items.length === 0) {
//       return res.status(400).json({ message: "No items in order" });
//     }

//     const newOrder = new Order({
//       userId: userId || null, // support guest orders
//       items,
//       shipping,
//       totalAmount,
//       paymentMethod: paymentMethod || "Cash on Delivery",
//       country: country || "Pakistan"
//     });

//     const savedOrder = await newOrder.save();
//     res.status(201).json(savedOrder);
//   } catch (err) {
//     console.error("Order placement error:", err);
//     res.status(500).json({ message: "Failed to place order", error: err.message });
//   }
// });

// // GET SINGLE ORDER (ADMIN)
// router.get("/admin/:orderId", verifyTokenAndAdmin, async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const order = await Order.findOne({ orderId });
//     if (!order) {
//       return res.status(404).json({ status: false, message: "Order not found" });
//     }
//     res.json({ status: true, order });
//   } catch (err) {
//     console.error("Get single order error:", err);
//     res.status(500).json({ status: false, message: "Server error" });
//   }
// });

// // ----------------- GET ALL ORDERS (ADMIN) -----------------
// router.get("/admin/all", verifyTokenAndAdmin, async (req, res) => {
//   try {
//     const orders = await Order.find().sort({ createdAt: -1 }); // newest first

//     if (!orders || orders.length === 0) {
//       return res.status(404).json({ status: false, message: "Order not found" });
//     }

//     res.status(200).json({ status: true, orders });
//   } catch (err) {
//     res.status(500).json({ status: false, message: err.message });
//   }
// });

// // ----------------- UPDATE ORDER STATUS (ADMIN) -----------------
// router.put("/admin/update/:orderId", verifyTokenAndAdmin, async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { status } = req.body;

//     if (!["Pending", "Shipped", "Delivered"].includes(status)) {
//       return res.status(400).json({ status: false, message: "Invalid status" });
//     }

//     const order = await Order.findOneAndUpdate({ orderId }, { status }, { new: true });

//     if (!order) return res.status(404).json({ status: false, message: "Order not found" });

//     res.json({ status: true, message: "Order status updated", order });
//   } catch (err) {
//     console.error("Update order status error:", err);
//     res.status(500).json({ status: false, message: "Server error", error: err.message });
//   }
// });

// // ----------------- UPDATE RETURN STATUS (ADMIN) -----------------
// router.put("/admin/return/:orderId", verifyTokenAndAdmin, async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { returnStatus } = req.body;

//     const validStatuses = ["Not Returned", "Requested", "Returned"];
//     if (!validStatuses.includes(returnStatus)) {
//       return res.status(400).json({ status: false, message: "Invalid return status" });
//     }

//     const order = await Order.findOneAndUpdate({ orderId }, { returnStatus }, { new: true });

//     if (!order) return res.status(404).json({ status: false, message: "Order not found" });

//     res.json({ status: true, message: "Return status updated", order });
//   } catch (err) {
//     console.error("Update return status error:", err);
//     res.status(500).json({ status: false, message: "Server error", error: err.message });
//   }
// });

// module.exports = router;

