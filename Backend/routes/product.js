
const express = require("express");
const router = express.Router();
const Product = require("../models/Product");

//  Add Product
router.post("/add", async (req, res) => {
  try {
    const {
      name,
      category, // yahan sirf category name ayega
      subCategory,
      images,
      new_price,
      old_price,
      available,
      description,
      stock,
      customStock,
    } = req.body;

    const newProduct = new Product({
      name,
      category, // name as string save hoga
      subCategory,
      images,
      new_price,
      old_price,
      available,
      description,
      stock,
      customStock,
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added successfully", product: newProduct });
  } catch (err) {
    res.status(500).json({ error: "Failed to add product", details: err.message });
  }
});

// Get All Products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

//  Get Products by Category Name
router.get("/category/:categoryName", async (req, res) => {
  try {
    const { categoryName } = req.params;
    const products = await Product.find({ category: categoryName });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products by category" });
  }
});

//  Update Product
router.put("/update/:id", async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ message: "Product updated", product: updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update product" });
  }
});

//  Delete Product
router.delete("/delete/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product" });
  }
});
// Get latest 16 products (New Arrivals / Mix)
router.get("/newarrivals", async (req, res) => {
  try {
    // Sort by dateAdded descending and limit 16
    const products = await Product.find().sort({ dateAdded: -1 }).limit(16);
    res.json({ success: true, products });
  } catch (err) {
    console.error("NewArrivals Error:", err.message);
    res.status(500).json({ success: false, error: err.message });
  }
});
// product.js ke andar
router.post("/:id/update-stock", async (req, res) => {
  const { quantity, size, custom } = req.body;
  const { id } = req.params;

  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (custom) {
      if (product.customStock < quantity)
        return res.status(400).json({ message: "Not enough custom stock" });
      product.customStock -= quantity;
    } else {
      if (product.stock[size] < quantity)
        return res.status(400).json({ message: `Only ${product.stock[size]} available` });
      product.stock[size] -= quantity;
    }

    await product.save();
    res.json({ message: "Stock updated successfully", product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//  Get single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch product", details: err.message });
  }
});


module.exports = router;

