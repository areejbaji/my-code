const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  images: [{ type: String }],
  stock: { type: Number, default: 0 },
  category: { type: String },
  active: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);

