const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  items: [
    {
      name: String,
      price: Number,
      image: String,
      quantity: Number,
      size: String,
      measurements: Object
    }
  ],
  shipping: {
    name: String,
    city: String,
    phone: String,
    note: String
  },
  total: Number,
  paymentMethod: { type: String, default: "Cash on Delivery" },
  country: { type: String, default: "Pakistan" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
