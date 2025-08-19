const express = require('express');
const router = express.Router();
const { getUserOrders } = require('../controllers/orderController');
const { verifyToken } = require('../middleware/authMiddleware'); // JWT auth middleware

// Route to get orders for logged-in user
router.get('/my-orders', verifyToken, getUserOrders);

module.exports = router;
