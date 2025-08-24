// // backend/routes/product.js
// const express = require("express");
// const router = express.Router();
// const Product = require("../models/Product");
// const parser = require("../config/multer"); // multer-cloudinary

// // Add a new product
// router.post("/add", parser.array("images", 5), async (req, res) => {
//   try {

//      // Parse description array safely
//     const description = req.body.description
//       ? JSON.parse(req.body.description)
//       : [];
//     // Images ke URLs nikal lo
//     const imageUrls = req.files.map(file => file.path);
    

//     // Product create karo
//     const product = new Product({
//       name: req.body.name,
//       category: req.body.category,
//       subCategory: req.body.subCategory,
//       new_price: req.body.new_price,
//       old_price: req.body.old_price,
//       description: description,
//       images: imageUrls,        // yaha save ho rahe hain
//        sizeChart: new mongoose.Types.ObjectId(req.body.sizeChart)

//     });

//     await product.save();
//     res.status(201).json({ success: true, product });

//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// });

// module.exports = router;
// const express = require("express");
// const router = express.Router();
// const Product = require("../models/Product");
// const parser = require("../config/multer");
// const mongoose = require("mongoose"); // <-- Add this
// router.get("/all", async (req, res) => {
//   try {
//     const products = await Product.find().populate("sizeChart");
//     res.json(products);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });
// // Get all products with size chart
// router.get("/products", async (req, res) => {
//   try {
//     const products = await Product.find().populate("sizeChart");
//     res.json(products);
//   } catch (err) {
//     console.error("Error fetching products:", err.message);  // 🔥 print error
//     res.status(500).json({ message: err.message });
//   }
// });

// // Get single product with size chart
// router.get("/products/:id", async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id).populate("sizeChart");
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }
//     res.json(product);
//   } catch (err) {
//     console.error("Error fetching product:", err.message);  // 🔥 print error
//     res.status(500).json({ message: err.message });
//   }
// });


// // Get products by category
// router.get("/category/:category", async (req, res) => {
//   try {
//     const categoryName = req.params.category; // e.g. "women"
//     const products = await Product.find({ category: categoryName }).populate("sizeChart");

//     if (!products || products.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: `No products found in category: ${categoryName}`,
//       });
//     }

//     res.json({ success: true, products });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// });
// // router.get("/:id", async (req, res) => {
// //   try {
// //     const product = await Product.findById(req.params.id).populate("sizeChart"); // <--- yaha populate
// //     if (!product) return res.status(404).json({ success: false, message: "Product not found" });
// //     res.json({ success: true, product });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // });

// router.post("/add", parser.array("images", 5), async (req, res) => {
//   try {
//     const description = req.body.description
//       ? JSON.parse(req.body.description)
//       : [];

//     const imageUrls = req.files.map(file => file.path);

//     const product = new Product({
//       name: req.body.name,
//       category: req.body.category,
//       subCategory: req.body.subCategory,
//       new_price: req.body.new_price,
//       old_price: req.body.old_price,
//       description: description,
//       images: imageUrls,
//       sizeChart: new mongoose.Types.ObjectId(req.body.sizeChart),
//     });

//     await product.save();
//     res.status(201).json({ success: true, product });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// });

// module.exports = router;

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

// GET SINGLE PRODUCT BY ID
// router.get("/products/:id", async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id).populate("sizeChart");
//     if (!product) return res.status(404).json({ message: "Product not found" });
//     res.json(product);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });
// Get 16 random products from men & women for New Arrivals
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



// router.get("/:id", async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id).populate("sizeChart"); // field name check
//     if (!product) {
//       return res.status(404).json({ success: false, message: "Product not found" });
//     }
//     res.json({ success: true, product });
//   } catch (err) {
//     console.error("Error fetching product:", err.message);
//     res.status(500).json({ success: false, message: "Server Error", error: err.message });
//   }
// });

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
