const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  type: { type: String, required: true }, // "new_order", "stock_alert", "order_update", "return_update"
  message: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null }, // null for admin notifications
  orderId: { type: String },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  read: { type: Boolean, default: false }, // mark as read/unread
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Notification", notificationSchema);
