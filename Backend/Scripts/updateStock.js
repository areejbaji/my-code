require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product"); // path check karen

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

async function updateStockAndCustom() {
  try {
    const products = await Product.find();

    for (let product of products) {

      // ✅ Agar customStock field na ho, default 10 set karo
      if (product.customStock === undefined) {
        product.customStock = 10;
      }

      // ✅ Example: manual stock update per product name
      if (product.name.toLowerCase().includes("suit")) {
        product.stock = { S: 8, M: 5, L: 9, XL: 6, XXL: 21 };
      } else if (product.name.toLowerCase().includes("kurta")) {
        product.stock = { S: 6, M: 8, L: 10, XL: 9, XXL: 8 };
      } else {
        product.stock = { S: 15, M: 5, L: 15, XL: 15, XXL: 15 };
      }

      // ✅ Auto-update availability
      const stockValues = Object.values(product.stock);
      product.available = stockValues.some(qty => qty > 0) || (product.customStock > 0);

      await product.save();
      console.log(`Updated product: ${product.name} | Available: ${product.available} | CustomStock: ${product.customStock}`);
    }

    console.log("All products updated successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.error("Error updating products:", err);
  }
}

updateStockAndCustom();
