
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const parser = require("../config/multer"); // multer-cloudinary config
const mongoose = require("mongoose");





// 🔹 ADD NEW PRODUCT
router.post("/add", parser.array("images", 5), async (req, res) => {
  try {
    const description = req.body.description ? JSON.parse(req.body.description) : [];
    const imageUrls = req.files.map(f => f.path); // multer-cloudinary se URL milega

    const product = new Product({
      name: req.body.name,
      category: req.body.category,
      subCategory: req.body.subCategory,
      new_price: req.body.new_price,
      old_price: req.body.old_price,
      description,
      images: imageUrls,
      stock: req.body.stock || { S:0,M:0,L:0,XL:0,XXL:0 },
      customStock: req.body.customStock || 10,
      // sizeChart: req.body.sizeChart ? new mongoose.Types.ObjectId(req.body.sizeChart) : null
    });

    await product.save();
    res.status(201).json({ success: true, product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});
// GET ALL PRODUCTS
router.get("/all", async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
});
router.get("/newarrivals", async (req, res) => {
  try {
    const products = await Product.aggregate([
      { $match: { category: { $in: ["men", "women"] } } },
      { $sample: { size: 16 } } // randomly pick 16 products
    ]);

    res.json({ success: true, products });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});
// GET SINGLE PRODUCT
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// GET PRODUCTS BY CATEGORY (case-insensitive, no sizeChart)
router.get("/category/:category", async (req, res) => {
  try {
    const categoryParam = req.params.category;

    // Case-insensitive match
    const products = await Product.find({
      category: { $regex: `^${categoryParam}$`, $options: "i" }
    }).select("name subCategory new_price old_price images stock customStock");

    if (!products || products.length === 0) {
      return res.status(404).json({ success: false, message: "No products found" });
    }

    res.json({ success: true, products });
  } catch (err) {
    console.error("Error fetching category products:", err.message);
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
});









// 🔹 UPDATE PRODUCT
router.put("/:id", parser.array("images", 5), async (req, res) => {
  try {
    const description = req.body.description ? JSON.parse(req.body.description) : [];
    const updateData = {
      name: req.body.name,
      category: req.body.category,
      subCategory: req.body.subCategory,
      new_price: req.body.new_price,
      old_price: req.body.old_price,
      description,
      stock: req.body.stock || { S:0,M:0,L:0,XL:0,XXL:0 },
      customStock: req.body.customStock || 10,
      sizeChart: req.body.sizeChart ? new mongoose.Types.ObjectId(req.body.sizeChart) : null
    };

    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(f => f.path);
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    res.json({ success: true, product });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

// 🔹 DELETE PRODUCT
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
});
router.get("/", async (req, res) => {
  try {
    const searchQuery = req.query.search || "";

    const products = await Product.find({
      $or: [
        { name: { $regex: searchQuery, $options: "i" } },
        { category: { $regex: searchQuery, $options: "i" } },
        { subCategory: { $regex: searchQuery, $options: "i" } }, // FIXED "subCategory"
      ],
    }).select("name category subCategory new_price old_price images available"); // FIXED field names

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
