const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },      // men, women
  subCategory: { type: String, required: true },   // suit, kurta, frock
  images: [{ type: String, required: true }],      // URLs
  new_price: { type: Number, required: true },
  old_price: { type: Number },
  available: { type: Boolean, default: true },
  description: { type: [String] },  
  sizeChart: { type: mongoose.Schema.Types.ObjectId, ref: "SizeChart" }, // link to size chart
  
  dateAdded: { type: Date, default: Date.now }
  
});

module.exports = mongoose.model("Product", productSchema);
