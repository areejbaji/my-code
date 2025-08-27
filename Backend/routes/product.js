

const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const parser = require("../config/multer");
const mongoose = require("mongoose");

// GET ALL PRODUCTS
router.get("/all", async (req, res) => {
  try {
    const products = await Product.find().populate("sizeChart");
    res.json({ success: true, products });
  } catch (err) {
    console.error("Error fetching products:", err.message);
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

// Get single product with size chart
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("sizeChart");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error("Error fetching product:", err.message);
    res.status(500).json({ message: err.message });
  }
});

// DELETE PRODUCT
router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err.message);
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
});

// router.get("/", async (req, res) => {
//   try {
//     const searchQuery = req.query.search || "";

//     const products = await Product.find({
//       $or: [
//         { name: { $regex: searchQuery, $options: "i" } },
//         { category: { $regex: searchQuery, $options: "i" } },
//         { subCategory: { $regex: searchQuery, $options: "i" } },
//       ],
//     }).select("name category subCategory  new_price old_price images"); // images array

//     const uniqueProducts = Array.from(new Map(products.map(p => [p._id.toString(), p])).values());

//     res.json(uniqueProducts); // agar empty array bhi return hoga agar match nahi hua
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// GET ALL PRODUCTS
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



// GET PRODUCTS BY CATEGORY
router.get("/category/:category", async (req, res) => {
  try {
    const products = await Product.find({ category: req.params.category }).populate("sizeChart");
    if (!products || products.length === 0) {
      return res.status(404).json({ success: false, message: "No products found" });
    }
    res.json({ success: true, products });
  } catch (err) {
    console.error("Error fetching category products:", err.message);
    res.status(500).json({ success: false, message: "Server Error", error: err.message });
  }
});
// UPDATE PRODUCT
router.put("/:id", parser.array("images", 5), async (req, res) => {
  try {
    const description = req.body.description ? JSON.parse(req.body.description) : [];
    let updateData = {
      name: req.body.name,
      category: req.body.category,
      subCategory: req.body.subCategory,
      new_price: req.body.new_price,
      old_price: req.body.old_price,
      description: description,
      sizeChart: req.body.sizeChart,
    };

    // अगर नई images upload हुई हैं
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(file => file.path);
    }

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, product });
  } catch (err) {
    console.error("Error updating product:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
});

// ADD NEW PRODUCT
router.post("/add", parser.array("images", 5), async (req, res) => {
  try {
    const description = req.body.description ? JSON.parse(req.body.description) : [];
    const imageUrls = req.files.map(file => file.path);

    const product = new Product({
      name: req.body.name,
      category: req.body.category,
      subCategory: req.body.subCategory,
      new_price: req.body.new_price,
      old_price: req.body.old_price,
      description: description,
      images: imageUrls,
      sizeChart: new mongoose.Types.ObjectId(req.body.sizeChart),
    });

    await product.save();
    res.status(201).json({ success: true, product });
  } catch (err) {
    console.error("Error adding product:", err.message);
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = router;
