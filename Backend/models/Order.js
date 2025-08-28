
// const mongoose = require("mongoose");
// const { v4: uuidv4 } = require("uuid");

// const orderSchema = new mongoose.Schema({
//   orderId: { 
//     type: String, 
//     unique: true 
//   }, 
//   userId: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: "User", 
//     default: null 
//   },

//   items: [
//     {
//       productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
//       name: { type: String, required: true },
//       image: { type: String },
//       price: { type: Number, required: true },
//       quantity: { type: Number, required: true },
//       size: { type: String },
//       measurements: { type: Object }
//     }
//   ],

//   shipping: {
//     name: { type: String, required: true },
//     email: { type: String, required: true },
//     address: { type: String, required: true },
//     city: { type: String, required: true },
//     postalCode: { type: String, required: false },
//     phone: { type: String, required: true }, 
//     country: { type: String, default: "Pakistan" },
//     note: { type: String, default: "" }
//   },

//   totalAmount: { type: Number, required: true },
//   paymentMethod: { type: String, default: "Cash on Delivery" },
//   country: { type: String, default: "Pakistan" },
//   status: { type: String, default: "Pending" },
//   returnStatus: { type: String, default: "Not Returned" }, 
//   createdAt: { type: Date, default: Date.now }
// });

// // 👇 Generate unique orderId before saving
// orderSchema.pre("save", function (next) {
//   if (!this.orderId) {
//     this.orderId = "ORD-" + uuidv4().split("-")[0];  // e.g., ORD-a3f9b2c1
//   }
//   next();
// });

// module.exports = mongoose.model("Order", orderSchema);
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderId: { type: String, unique: true }, 
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },

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
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: String },
    phone: { type: String, required: true },
    country: { type: String, default: "Pakistan" },
    note: { type: String, default: "" }
  },

  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, default: "Cash on Delivery" },
  status: { type: String, default: "Pending" },
  returnStatus: { type: String, default: "Not Returned" }, 
  createdAt: { type: Date, default: Date.now }
});

// ❌ UUID wala pre("save") hata do

module.exports = mongoose.model("Order", orderSchema);
