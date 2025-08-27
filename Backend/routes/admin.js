// // // Backend/routes/admin.js
// // const express = require("express");
// // const router = express.Router();
// // const { protect, admin } = require("../middlewares/authMiddleware");
// // const User = require("../models/User");
// // const Product = require("../models/Product");
// // const Order = require("../models/Order");

// // // Admin dashboard
// // router.get("/dashboard", protect, admin, (req, res) => {
// //   res.json({ message: "Welcome to Admin Dashboard", user: req.user });
// // });

// // router.get("/stats", protect, admin, async (req, res) => {
// //   try {
// //     const usersCount = await User.countDocuments();
// //     const productsCount = await Product.countDocuments();
// //     const ordersCount = await Order.countDocuments();
// //       const categoriesCount = await Product.distinct("category"); // field name jo Product schema me hai
// //     const subcategoriesCount = await Product.distinct("subCategory"); // field name jo Product schema me hai
// //     res.json({
// //       users: usersCount,
// //       products: productsCount,
// //       orders: ordersCount,
// //       categories: categoriesCount.length,
// //       subcategories: subcategoriesCount.length
// //     });
// //   } catch (error) {
// //     res.status(500).json({ message: "Error fetching stats" });
// //   }
// // });

// // // Get all users (admin only)
// // router.get("/users", protect, admin, async (req, res) => {
// //   try {
// //     const users = await User.find();
// //     res.status(200).json(users);
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // });

// // // Delete a user (admin only)
// // router.delete("/users/:id", protect, admin, async (req, res) => {
// //   try {
// //     await User.findByIdAndDelete(req.params.id);
// //     res.status(200).json({ message: "User deleted successfully" });
// //   } catch (err) {
// //     res.status(500).json({ message: err.message });
// //   }
// // });

// // module.exports = router;

// // Backend/routes/admin.js
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

// module.exports = router;
// Backend/routes/admin.js
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

module.exports = router;
