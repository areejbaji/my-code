
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderId: { 
    type: String, 
    unique: true, 
    default: () => Date.now().toString()   // auto unique id
  }, 
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    default: null 
  },

  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      name: { type: String, required: true },
      image: { type: String },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      size: { type: String },
      measurements: { type: Object }
    }
  ],

  shipping: {
    name: { type: String, required: true },        // ✅ required
    email: { type: String, required: true },       // ✅ required
    address: { type: String, required: true },     // ✅ required
    city: { type: String, required: true },        // ✅ required
    postalCode: { type: String, required: false }, // ✅ optional
    phone: { type: String, required: true }, 
    country: { type: String, default: "Pakistan" },      // ✅ required
    note: { type: String, default: "" }            // ✅ optional
  },

  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, default: "Cash on Delivery" },
  country: { type: String, default: "Pakistan" },
  status: { type: String, default: "Pending" },
    returnStatus: { type: String, default: "Not Returned" }, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
