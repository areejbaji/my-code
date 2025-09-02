require("dotenv").config();
const mongoose = require("mongoose");
const slugify = require("slugify");
const Product = require("../models/Product");

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

async function addSlugsToProducts() {
  try {
    const products = await Product.find({});

    for (let prod of products) {
      if (!prod.slug) {
        prod.slug = slugify(prod.name, { lower: true });
        await prod.save();
        console.log(`✅ Slug added: ${prod.name} → ${prod.slug}`);
      } else {
        console.log(`ℹ️ Already has slug: ${prod.name}`);
      }
    }

    console.log("🎉 All products now have slugs!");
    mongoose.connection.close();
  } catch (err) {
    console.error("❌ Error adding slugs:", err);
    mongoose.connection.close();
  }
}

addSlugsToProducts();
