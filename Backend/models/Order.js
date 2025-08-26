// const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema({
//   items: [
//     {
//       name: String,
//       price: Number,
//       image: String,
//       quantity: Number,
//       size: String,
//       measurements: Object
//     }
//   ],
//   shipping: {
//     name: String,
//     city: String,
//     phone: String,
//     note: String
//   },
//   total: Number,
//   paymentMethod: { type: String, default: "Cash on Delivery" },
//   country: { type: String, default: "Pakistan" },
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model("Order", orderSchema);
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  items: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      image: { type: String },
      quantity: { type: Number, required: true },
      size: { type: String },
      measurements: { type: Object }
    }
  ],
  shipping: {
    name: { type: String, required: true },
    city: { type: String, required: true },
    phone: { type: String, required: true },
    note: { type: String }
  },
  total: { type: Number, required: true },
  paymentMethod: { type: String, default: "Cash on Delivery" },
  country: { type: String, default: "Pakistan" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
