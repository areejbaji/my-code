 const express = require('express');
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// ✅ Utility: Async handler to avoid try/catch repetition
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// ✅ /me - Get logged-in admin info
router.get('/me', requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.userId).select('-password');
  res.json({ status: true, user });
}));

// ✅ Get all users (with pagination)
router.get('/users', requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find().select('-password').skip(skip).limit(limit),
    User.countDocuments()
  ]);

  res.json({
    status: true,
    page,
    totalPages: Math.ceil(total / limit),
    users
  });
}));

// ✅ Get all products (with pagination)
router.get('/products', requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find().skip(skip).limit(limit),
    Product.countDocuments()
  ]);

  res.json({
    status: true,
    page,
    totalPages: Math.ceil(total / limit),
    products
  });
}));

// ✅ Create product (with validation)
router.post('/products', requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const { title, price, description, image } = req.body;
  if (!title || !price) {
    return res.status(400).json({ status: false, message: "Title and price are required" });
  }
  const created = await Product.create({ title, price, description, image });
  res.status(201).json({ status: true, product: created });
}));

// ✅ Update product
router.put('/products/:id', requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!updated) {
    return res.status(404).json({ status: false, message: "Product not found" });
  }
  res.json({ status: true, product: updated });
}));

// ✅ Delete product
router.delete('/products/:id', requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const deleted = await Product.findByIdAndDelete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ status: false, message: "Product not found" });
  }
  res.json({ status: true, message: "Product deleted" });
}));

// ✅ Get all orders
router.get('/orders', requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const orders = await Order.find()
    .populate('user', 'name email')
    .populate('items.product', 'title price');
  res.json({ status: true, orders });
}));

// ✅ Update order status (safe)
router.put('/orders/:id/status', requireAuth, requireAdmin, asyncHandler(async (req, res) => {
  const allowedStatuses = ["Pending", "Shipped", "Delivered", "Cancelled"];
  if (!allowedStatuses.includes(req.body.status)) {
    return res.status(400).json({ status: false, message: "Invalid order status" });
  }

  const updated = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );

  if (!updated) {
    return res.status(404).json({ status: false, message: "Order not found" });
  }

  res.json({ status: true, order: updated });
}));

module.exports = router;
