
const express = require("express");
const router = express.Router();
const { verifyTokenAndAdmin } = require("../middlewares/authMiddleware");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");
const upload = require("../config/multer");
const Notification = require("../models/Notification");

const cloudinary = require("../config/cloudinary");
const { getAdminProfile, updateAdminProfile } = require('../controllers/adminProfile');
const {
  getMainCategories,
  getSubcategoriesByParent,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
  addSubcategory,
  updateSubcategory,
  deleteSubcategory,
  getCategoryStats
} = require("../controllers/categoryController");



router.get("/profile", verifyTokenAndAdmin, getAdminProfile);

router.put(
  "/profile/update",
  verifyTokenAndAdmin,
  upload.single("avatar"), 
  updateAdminProfile
);


router.get("/dashboard", verifyTokenAndAdmin, (req, res) => {
  res.json({ message: "Welcome to Admin Dashboard", user: req.user });
});


router.get("/categories/main", getMainCategories);
router.get("/categories/parent/:parentId", getSubcategoriesByParent);
router.post("/categories", verifyTokenAndAdmin, upload.single("image"), createCategory);
router.put("/categories/:id", verifyTokenAndAdmin, upload.single("image"), updateCategory);
router.delete("/categories/:id", verifyTokenAndAdmin, deleteCategory);
router.put("/categories/:id/toggle-status", verifyTokenAndAdmin, toggleCategoryStatus);


router.post("/categories/:id/sub", verifyTokenAndAdmin, upload.single("image"), addSubcategory);
router.put("/categories/:id/sub/:subId", verifyTokenAndAdmin, upload.single("image"), updateSubcategory);
router.delete("/categories/:id/sub/:subId", verifyTokenAndAdmin, deleteSubcategory);
router.get("/categories/stats", verifyTokenAndAdmin, getCategoryStats);

router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const productsCount = await Product.countDocuments();
    const ordersCount = await Order.countDocuments();
    const categoriesCount = await Product.distinct("category");
    const subcategoriesCount = await Product.distinct("subCategory");

    const pendingOrders = await Order.countDocuments({ status: "Pending" });
    const deliveredOrders = await Order.countDocuments({ status: "Delivered" });
    const cancelledOrders = await Order.countDocuments({ status: "Cancelled" });
    const returnedOrders = await Order.countDocuments({ returnStatus: "Returned" });

    res.json({
      users: usersCount,
      products: productsCount,
      orders: ordersCount,
      categories: categoriesCount.length,
      subcategories: subcategoriesCount.length,
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


router.get("/users", verifyTokenAndAdmin, async (req, res) => {
  try {
    const users = await User.find(); 
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.delete("/users/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

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

    // ADD THIS: Create notification when admin updates status
    if (order.userId) {
      await Notification.create({
        userId: order.userId.toString(),
        role: "user",
        type: "order",
        message: `Your order ${req.params.orderId} status updated to ${status}`,
        read: false,
      });
      
      console.log(`Created notification for user ${order.userId} - Order ${req.params.orderId} status updated to ${status}`);
    }

    res.json({ status: true, message: "Order status updated", order });
  } catch (err) {
    console.error("Update status error:", err);
    res.status(500).json({ status: false, message: "Error updating order status" });
  }
});
// router.put("/orders/:orderId/return", verifyTokenAndAdmin, async (req, res) => {
//   try {
//     const { returnStatus } = req.body;
//     const validStatuses = ["Not Returned", "Requested", "Returned"];
//     if (!validStatuses.includes(returnStatus)) {
//       return res.status(400).json({ status: false, message: "Invalid return status" });
//     }

//     const order = await Order.findOneAndUpdate(
//       { orderId: req.params.orderId },
//       { returnStatus },
//       { new: true }
//     ).lean();

//     if (!order) return res.status(404).json({ status: false, message: "Order not found" });

//     // ADD THIS: Create notification when admin updates return status
//     if (order.userId) {
//       await Notification.create({
//         userId: order.userId.toString(),
//         role: "user",
//         type: "order",
//         message: `Your order ${req.params.orderId} return status updated to ${returnStatus}`,
//         read: false,
//       });
      
//       console.log(`Created notification for user ${order.userId} - Order ${req.params.orderId} return status updated to ${returnStatus}`);
//     }

//     res.json({ status: true, message: "Return status updated", order });
//   } catch (err) {
//     res.status(500).json({ status: false, message: "Error updating return status" });
//   }
// });
// adminRoutes.js mein yeh route update karein

router.put("/orders/:orderId/return", verifyTokenAndAdmin, async (req, res) => {
  try {
    const { returnStatus } = req.body;
    const validStatuses = ["Not Returned", "Requested", "Returned"];
    
    if (!validStatuses.includes(returnStatus)) {
      return res.status(400).json({ status: false, message: "Invalid return status" });
    }

    const order = await Order.findOne({ orderId: req.params.orderId });
    if (!order) return res.status(404).json({ status: false, message: "Order not found" });

    const oldReturnStatus = order.returnStatus;
    order.returnStatus = returnStatus;

    // ✅ STOCK RESTORE - Jab admin "Returned" status set kare
    if (returnStatus === "Returned" && oldReturnStatus !== "Returned") {
      for (let item of order.items) {
        const product = await Product.findById(item.productId);
        if (!product) continue;

        if (item.size === "Custom") {
          product.customStock += item.quantity;
        } else {
          product.stock[item.size] = (product.stock[item.size] || 0) + item.quantity;
        }

        await product.save();
        console.log(`✅ Stock restored for ${product.name} - Size: ${item.size}, Qty: ${item.quantity}`);
      }
    }

    await order.save();

    // ✅ User ko notification bhejein
    if (order.userId) {
      await Notification.create({
        userId: order.userId.toString(),
        role: "user",
        type: "order",
        message: `Your order ${req.params.orderId} return status updated to ${returnStatus}`,
        read: false,
      });
      
      console.log(`📧 Notification sent to user ${order.userId}`);
    }

    res.json({ status: true, message: "Return status updated", order });
  } catch (err) {
    console.error("Return status error:", err);
    res.status(500).json({ status: false, message: "Error updating return status" });
  }
});
// DELETE /api/admin/orders/:orderId
router.delete("/orders/:orderId", verifyTokenAndAdmin, async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findOne({ orderId });

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status !== "Cancelled") {
      return res.status(400).json({ message: "Only cancelled orders can be deleted" });
    }

    await Order.deleteOne({ orderId });

    await Notification.create({
      userId: order.userId || null,
      role: "admin",
      type: "order",
      message: `Cancelled order ${orderId} deleted by admin`,
      read: false,
    });

    res.json({ message: "Cancelled order deleted successfully" });
  } catch (err) {
    console.error("Delete order error:", err);
    res.status(500).json({ message: "Failed to delete order", error: err.message });
  }
});



router.get("/products/stock", verifyTokenAndAdmin, async (req, res) => {
  try {
    const products = await Product.find().sort({ dateAdded: -1 });


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

router.put("/products/:id", verifyTokenAndAdmin, upload.array("images", 5), async (req, res) => {
  try {
    const { name, old_price, new_price, description, existingImages } = req.body;

    const updateData = {
      name,
      old_price: old_price ? Number(old_price) : 0,
      new_price: new_price ? Number(new_price) : 0,
      description: description ? description.split("\n").filter(line => line.trim()) : [],
    };

  
    let newImages = [];
    if (req.files && req.files.length > 0) {
      const results = await Promise.all(req.files.map(file =>
        cloudinary.uploader.upload(file.path, { folder: "stylehub/products" })
      ));
      newImages = results.map(r => r.secure_url);
    }

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


router.post("/products", verifyTokenAndAdmin, upload.array("images", 5), async (req, res) => {
  try {
    console.log("REQ.BODY:", req.body);
    console.log("REQ.FILES:", req.files);

    const { name, category, subCategory, new_price, old_price, description, stock, customStock } = req.body;

    if (!name || !category || !subCategory || !new_price) {
      return res.status(400).json({ message: "Name, category, subCategory, and new_price are required." });
    }

    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      const results = await Promise.all(
        req.files.map(file =>
          cloudinary.uploader.upload(file.path, { folder: "stylehub/products" })
        )
      );
      imageUrls = results.map(r => r.secure_url);
    }

  
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

router.delete("/products/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete product", error: error.message });
  }
});




module.exports = router;
