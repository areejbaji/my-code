

// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema({
//   name: { type: String, required: true },

//   category: { 
//     type: String, 
//     required: true,
//     enum: ["men", "women"]
//   },

//   subCategory: { 
//     type: String, 
//     required: true,
//     enum: ["suit", "kurta", "frock"] // men ke liye suit/kurta, women ke liye suit/frock
//   },

//   images: [{ type: String, required: true }],
//   new_price: { type: Number, required: true },
//   old_price: { type: Number },
  
//   available: { type: Boolean, default: true },

//   description: { type: [String] },  

//   // Size-wise stock
//   stock: {
//     S: { type: Number, default: 0 },
//     M: { type: Number, default: 0 },
//     L: { type: Number, default: 0 },
//     XL: { type: Number, default: 0 },
//     XXL: { type: Number, default: 0 }
//   },

//   dateAdded: { type: Date, default: Date.now }
// });

// // Middleware to auto-update availability
// productSchema.pre("save", function(next) {
//   const sizes = Object.values(this.stock);
//   this.available = sizes.some(qty => qty > 0); // agar kisi size ka stock >0 hai to available = true
//   next();
// });

// module.exports = mongoose.model("Product", productSchema);
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },

  category: { 
    type: String, 
    required: true,
    enum: ["men", "women"]
  },

  subCategory: { 
    type: String, 
    required: true,
    enum: ["suit", "kurta", "frock"] // men: suit/kurta, women: suit/frock
  },

  images: [{ type: String, required: true }],
  new_price: { type: Number, required: true },
  old_price: { type: Number },

  available: { type: Boolean, default: true },

  description: { type: [String] },

  // Size-wise stock
  stock: {
    S: { type: Number, default: 0 },
    M: { type: Number, default: 0 },
    L: { type: Number, default: 0 },
    XL: { type: Number, default: 0 },
    XXL: { type: Number, default: 0 }
  },

  // Optional: custom size max quantity
  customStock: { type: Number, default: 10 },

  dateAdded: { type: Date, default: Date.now }
});

// Middleware: auto-update availability
productSchema.pre("save", function(next) {
  const sizes = Object.values(this.stock);
  const totalStock = sizes.reduce((a,b) => a + b, 0);
  this.available = totalStock > 0 || this.customStock > 0; // available if any size or custom >0
  next();
});

module.exports = mongoose.model("Product", productSchema);
