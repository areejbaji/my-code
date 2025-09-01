
// const express = require("express");
// const router = express.Router();
// const Order = require("../models/Order");
// const Product = require("../models/Product");
// const Notification = require("../models/Notification"); 


// await Notification.create({
//   type: "new_order",
//   message: `New order placed: ${savedOrder.orderId}`,
//   userId: null, // admin
//   orderId: savedOrder.orderId,
//   read: false
// });
// if (availableStock < item.quantity) {
//   await Notification.create({
//     type: "stock_alert",
//     message: `Stock low for ${product.name} (Size: ${item.size})`,
//     userId: null,
//     productId: item.productId,
//     read: false
//   });
// }

// // ----------------- PLACE ORDER -----------------
// router.post("/", async (req, res) => {
//   try {
//     const { userId, items, shipping, totalAmount, paymentMethod, country } = req.body;

//     if (!items || items.length === 0) {
//       return res.status(400).json({ message: "No items in order" });
//     }

//     // ✅ stock check for each item
//     for (let item of items) {
//       const product = await Product.findById(item.productId);
//       if (!product) {
//         return res.status(404).json({ message: `Product not found: ${item.productId}` });
//       }

//       let availableStock =
//         item.size === "Custom" ? product.customStock : product.stock[item.size];

//       if (availableStock < item.quantity) {
//         return res.status(400).json({
//           message: `Only ${availableStock} left in stock for ${product.name} (Size: ${item.size})`,
//         });
//       }
//     }

//     // ✅ reduce stock
//     for (let item of items) {
//       const product = await Product.findById(item.productId);

//       if (item.size === "Custom") {
//         await Product.findByIdAndUpdate(item.productId, {
//           $set: { customStock: Math.max(0, product.customStock - item.quantity) },
//         });
//       } else {
//         await Product.findByIdAndUpdate(item.productId, {
//           $set: { [`stock.${item.size}`]: Math.max(0, product.stock[item.size] - item.quantity) },
//         });
//       }
//     }

//     // ✅ Generate orderId with Date.now() (always unique)
//     const generatedOrderId = `ORD-${Date.now()}`;

//     // ✅ create new order
//     const newOrder = new Order({
//       orderId: generatedOrderId,
//       userId: userId || null,
//       items,
//       shipping,
//       totalAmount,
//       paymentMethod: paymentMethod || "Cash on Delivery",
//       country: country || "Pakistan",
//       status: "Pending",
//       returnStatus: "Not Returned",
//     });

//     const savedOrder = await newOrder.save();
//     res.status(201).json(savedOrder);
//   } catch (err) {
//     console.error("Order placement error:", err);
//     res.status(500).json({ message: "Failed to place order", error: err.message });
//   }
// });
// // ----------------- GET MY ORDERS -----------------
// router.get("/my-orders/:userId", async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const orders = await Order.find({ userId })
//       .sort({ createdAt: -1 }); // latest first

//     res.json(orders);
//   } catch (err) {
//     console.error("Fetch orders error:", err);
//     res.status(500).json({ message: "Failed to fetch orders", error: err.message });
//   }
// });

// // ----------------- CANCEL ORDER -----------------
// router.put("/cancel/:orderId", async (req, res) => {
//   try {
//     const { orderId } = req.params;

//     // Find the order
//     const order = await Order.findOne({ orderId });
//     if (!order) return res.status(404).json({ message: "Order not found" });

//     // Only allow cancellation if order is still pending
//     if (order.status !== "Pending") {
//       return res.status(400).json({ message: "Order cannot be cancelled" });
//     }

//     // Update status
//     order.status = "Cancelled";
//     await order.save();

//     // Optional: restore stock for each product
//     for (let item of order.items) {
//       const product = await Product.findById(item.productId);
//       if (!product) continue;

//       if (item.size === "Custom") {
//         product.customStock += item.quantity;
//       } else {
//         product.stock[item.size] += item.quantity;
//       }
//       await product.save();
//     }

//     res.json({ message: "Order cancelled successfully", order });
//   } catch (err) {
//     console.error("Cancel order error:", err);
//     res.status(500).json({ message: "Failed to cancel order", error: err.message });
//   }
// });


// module.exports = router;
const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const Notification = require("../models/Notification"); // new notification model
const User = require("../models/User");

// ----------------- PLACE ORDER -----------------
router.post("/", async (req, res) => {
  try {
    const { userId, items, shipping, totalAmount, paymentMethod, country } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    // Check stock
    for (let item of items) {
      const product = await Product.findById(item.productId);
      if (!product) return res.status(404).json({ message: `Product not found: ${item.productId}` });

      let availableStock = item.size === "Custom" ? product.customStock : product.stock[item.size];
      if (availableStock < item.quantity) {
        return res.status(400).json({
          message: `Only ${availableStock} left in stock for ${product.name} (Size: ${item.size})`,
        });
      }
    }

    // Reduce stock
    for (let item of items) {
      const product = await Product.findById(item.productId);

      if (item.size === "Custom") {
        product.customStock = Math.max(0, product.customStock - item.quantity);
      } else {
        product.stock[item.size] = Math.max(0, product.stock[item.size] - item.quantity);
      }

      await product.save();

      // If stock becomes 0 → admin notification
      const remainingStock = item.size === "Custom" ? product.customStock : product.stock[item.size];
      if (remainingStock === 0) {
        await Notification.create({
          userId: null, // admin notification
          type: "stock",
          message: `Stock finished for ${product.name} (Size: ${item.size})`,
          read: false,
        });
      }
    }

    // Generate orderId
    const generatedOrderId = `ORD-${Date.now()}`;

    // Create new order
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

    // Admin notification for new order
    await Notification.create({
      userId: null,
      type: "order",
      message: `New order placed: ${generatedOrderId}`,
      read: false,
    });

    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("Order placement error:", err);
    res.status(500).json({ message: "Failed to place order", error: err.message });
  }
});

// ----------------- GET MY ORDERS -----------------
router.get("/my-orders/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Fetch orders error:", err);
    res.status(500).json({ message: "Failed to fetch orders", error: err.message });
  }
});

// ----------------- CANCEL ORDER -----------------
router.put("/cancel/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status !== "Pending") return res.status(400).json({ message: "Order cannot be cancelled" });

    order.status = "Cancelled";
    await order.save();

    // Restore stock
    for (let item of order.items) {
      const product = await Product.findById(item.productId);
      if (!product) continue;

      if (item.size === "Custom") product.customStock += item.quantity;
      else product.stock[item.size] += item.quantity;

      await product.save();
    }

    // Admin notification
    await Notification.create({
      userId: null,
      type: "order",
      message: `Order cancelled: ${orderId}`,
      read: false,
    });

    res.json({ message: "Order cancelled successfully", order });
  } catch (err) {
    console.error("Cancel order error:", err);
    res.status(500).json({ message: "Failed to cancel order", error: err.message });
  }
});

// ----------------- UPDATE ORDER STATUS (ADMIN) -----------------
router.put("/:orderId/status", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!["Pending", "Shipped", "Delivered"].includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const order = await Order.findOneAndUpdate({ orderId }, { status }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Notify user about status change
    if (order.userId) {
      await Notification.create({
        userId: order.userId,
        type: "order",
        message: `Your order ${orderId} status updated to ${status}`,
        read: false,
      });
    }

    res.json({ message: "Order status updated", order });
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ message: "Failed to update order status", error: err.message });
  }
});

// ----------------- RETURN STATUS (ADMIN) -----------------
router.put("/:orderId/return", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { returnStatus } = req.body;
    const validStatuses = ["Not Returned", "Requested", "Returned"];
    if (!validStatuses.includes(returnStatus))
      return res.status(400).json({ message: "Invalid return status" });

    const order = await Order.findOneAndUpdate({ orderId }, { returnStatus }, { new: true });
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Notify user
    if (order.userId) {
      await Notification.create({
        userId: order.userId,
        type: "order",
        message: `Your order ${orderId} return status updated to ${returnStatus}`,
        read: false,
      });
    }

    res.json({ message: "Return status updated", order });
  } catch (err) {
    console.error("Return status error:", err);
    res.status(500).json({ message: "Failed to update return status", error: err.message });
  }
});

module.exports = router;

