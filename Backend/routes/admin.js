
const express = require("express");
const router = express.Router();
const { verifyTokenAndAdmin } = require("../middlewares/authMiddleware");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const upload = require("../config/multer");
const cloudinary = require("../config/cloudinary");
const { getAdminProfile, updateAdminProfile } = require('../controllers/adminProfile');
const { getMainCategories,getSubcategoriesByParent, updateCategory, deleteCategory, toggleCategoryStatus,getCategoryStats } = require("../controllers/categoryController");




router.get("/profile", verifyTokenAndAdmin, getAdminProfile);
router.put("/profile/update", verifyTokenAndAdmin, updateAdminProfile);

// ---------------- DASHBOARD ----------------
router.get("/dashboard", verifyTokenAndAdmin, (req, res) => {
  res.json({ message: "Welcome to Admin Dashboard", user: req.user });
});

router.get("/categories/main", getMainCategories);
router.get("/categories/parent/:parentId", getSubcategoriesByParent);
router.put("/categories/:id", verifyTokenAndAdmin, upload.single("image"), updateCategory);
router.delete("/categories/:id", verifyTokenAndAdmin, deleteCategory);
router.patch("/categories/:id/toggle", verifyTokenAndAdmin, toggleCategoryStatus);
router.get("/categories/stats", verifyTokenAndAdmin, getCategoryStats);
// ---------------- STATS ----------------
// ---------------- STATS ----------------
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const productsCount = await Product.countDocuments();
    const ordersCount = await Order.countDocuments();
    
    // Get categories from database instead of products
    const Category = require("../models/Category");
    const categoriesCount = await Category.countDocuments({ level: 0 }); // Main categories only
    const subcategoriesCount = await Category.countDocuments({ level: { $gt: 0 } }); // All subcategories

    // ✅ Order status counts
    const pendingOrders = await Order.countDocuments({ status: "Pending" });
    const deliveredOrders = await Order.countDocuments({ status: "Delivered" });
    const cancelledOrders = await Order.countDocuments({ status: "Cancelled" });
    const returnedOrders = await Order.countDocuments({ returnStatus: "Returned" });

    res.json({
      users: usersCount,
      products: productsCount,
      orders: ordersCount,
      categories: categoriesCount,
      subcategories: subcategoriesCount,
      pendingOrders,
      deliveredOrders,
      cancelledOrders,
      returnedOrders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching stats" });
  }
});

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

// ---------------- USERS ----------------
// GET all users
// GET all users
router.get("/users", verifyTokenAndAdmin, async (req, res) => {
  try {
    const users = await User.find(); // fetch all users
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE user by ID
router.delete("/users/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ---------------- ORDERS ----------------
router.get("/orders", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    res.status(200).json({ status: true, orders });
  } catch (err) {
    res.status(500).json({ status: false, message: "Error fetching orders" });
  }
});

router.get("/orders/:orderId", verifyTokenAndAdmin, async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.orderId }).lean();
    if (!order) return res.status(404).json({ status: false, message: "Order not found" });
    res.status(200).json({ status: true, order });
  } catch (err) {
    res.status(500).json({ status: false, message: "Error fetching order details" });
  }
});

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

// ---------------- PRODUCTS ----------------
// ---------------- PRODUCTS ----------------
router.get("/products/stock", verifyTokenAndAdmin, async (req, res) => {
  try {
    const products = await Product.find().sort({ dateAdded: -1 });

    // Compute availability based on stock and customStock
    const productsWithStatus = products.map((p) => {
      const totalStock = Object.values(p.stock || {}).reduce((acc, val) => acc + val, 0) + (p.customStock || 0);
      return {
        ...p._doc,
        available: totalStock > 0
      };
    });

    res.json(productsWithStatus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put("/products/:id/stock", verifyTokenAndAdmin, async (req, res) => {
  try {
    const { size, quantity, type } = req.body;
    let updateQuery;

    if (type === 'custom') {
      updateQuery = { $set: { customStock: Math.max(0, quantity) } };
    } else {
      updateQuery = { $set: { [`stock.${size}`]: Math.max(0, quantity) } };
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateQuery, { new: true });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single product by ID
router.get("/products/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch product" });
  }
});

// ✅ Update product (name, price, description, image)
// ✅ Update product (with new_price & old_price support)
// Update product
router.put("/products/:id", verifyTokenAndAdmin, upload.array("images", 5), async (req, res) => {
  try {
    const { name, old_price, new_price, description, existingImages } = req.body;

    const updateData = {
      name,
      old_price: old_price ? Number(old_price) : 0,
      new_price: new_price ? Number(new_price) : 0,
      description: description ? description.split("\n").filter(line => line.trim()) : [],
    };

    // Upload new files if any
    let newImages = [];
    if (req.files && req.files.length > 0) {
      const results = await Promise.all(req.files.map(file =>
        cloudinary.uploader.upload(file.path, { folder: "stylehub/products" })
      ));
      newImages = results.map(r => r.secure_url);
    }

    // Merge old + new images
    let oldImages = [];
    if (existingImages) {
      oldImages = JSON.parse(existingImages);
    }

    updateData.images = [...oldImages, ...newImages];

    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product updated successfully", product: updatedProduct });
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ error: "Something went wrong while updating the product" });
  }
});

// ✅ Add New Product
router.post("/products", verifyTokenAndAdmin, upload.array("images", 5), async (req, res) => {
  try {
    console.log("REQ.BODY:", req.body);
    console.log("REQ.FILES:", req.files);

    const { name, category, subCategory, new_price, old_price, description, stock, customStock } = req.body;

    if (!name || !category || !subCategory || !new_price) {
      return res.status(400).json({ message: "Name, category, subCategory, and new_price are required." });
    }

    // Upload images to Cloudinary
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      const results = await Promise.all(
        req.files.map(file =>
          cloudinary.uploader.upload(file.path, { folder: "stylehub/products" })
        )
      );
      imageUrls = results.map(r => r.secure_url);
    }

    // Parse stock
    let parsedStock = { S: 0, M: 0, L: 0, XL: 0, XXL: 0 };
    if (stock) parsedStock = JSON.parse(stock);
    Object.keys(parsedStock).forEach(key => parsedStock[key] = Number(parsedStock[key]));

    const parsedCustomStock = Number(customStock || 0);
    const newPriceNum = Number(new_price);
    const oldPriceNum = old_price ? Number(old_price) : 0;
    const descriptionArr = description ? description.split("\n").map(l => l.trim()).filter(l => l) : [];

    const product = new Product({
      name,
      category,
      subCategory,
      images: imageUrls,
      new_price: newPriceNum,
      old_price: oldPriceNum,
      description: descriptionArr,
      stock: parsedStock,
      customStock: parsedCustomStock,
      available: true,
      dateAdded: new Date()
    });

    await product.save();
    console.log("Product saved successfully:", product.name);
    res.status(201).json({ message: "Product added successfully", product });
  } catch (error) {
    console.error("Failed to add product:", error);
    res.status(500).json({ message: "Failed to add product", error: error.message });
  }
});




module.exports = router;
