 const Order = require('../models/Order'); // Mongoose Order model

// ✅ Create new order
const createOrder = async (req, res, next) => {
  try {
    // JWT middleware se userId milta hai agar logged-in ho
    const userId = req.user ? req.user.userId : null;

    const {
      items,
      shipping,
      totalAmount,
      paymentMethod,
      country
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ status: false, message: "Cart is empty!" });
    }

    const newOrder = new Order({
      order_userID: userId, // 👈 registered user ka id, guest ke liye null
      items,
      shipping,
      totalAmount,
      paymentMethod,
      country,
      order_date: Date.now()
    });

    const savedOrder = await newOrder.save();

    res.status(201).json({
      status: true,
      message: "Order placed successfully",
      order: savedOrder
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Get orders for logged-in user
const getUserOrders = async (req, res, next) => {
  try {
    const userId = req.user.userId; // JWT verify middleware se

    // Sirf registered user ke orders fetch
    const orders = await Order.find({ order_userID: userId }).sort({ order_date: -1 });

    res.status(200).json({
      status: true,
      orders
    });
  } catch (error) {
    next(error);
  }
};

// ✅ Export
module.exports = {
  createOrder,
  getUserOrders
};
