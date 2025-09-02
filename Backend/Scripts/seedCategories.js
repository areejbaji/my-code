require("dotenv").config();
const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary");
const path = require("path");
const slugify = require("slugify");
const Category = require("../models/Category");

// 🔹 MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// 🔹 Frontend public assets categories
const categories = [
  {
    name: "Men",
    image: path.join(__dirname, "../../Frontend/public/assets/men4.1.webp"),
    subcategories: [
      { name: "Suit", image: path.join(__dirname, "../../Frontend/public/assets/men2.1.webp") },
      { name: "Kurta", image: path.join(__dirname, "../../Frontend/public/assets/kurta1.1.webp") },
    ],
  },
  {
    name: "Women",
    image: path.join(__dirname, "../../Frontend/public/assets/suit1.1.webp"),
    subcategories: [
      { name: "Suit", image: path.join(__dirname, "../../Frontend/public/assets/suit5.1.webp") },
      { name: "Frock", image: path.join(__dirname, "../../Frontend/public/assets/frock1.1.webp") },
    ],
  },
];

// 🔹 Cloudinary upload helper
async function uploadImage(localPath) {
  try {
    const result = await cloudinary.uploader.upload(localPath, { folder: "categories" });
    console.log("✅ Uploaded:", localPath, "=>", result.secure_url);
    return result.secure_url;
  } catch (err) {
    console.error("❌ Image upload error:", localPath, err.message);
    return null;
  }
}

// 🔹 Seed function
async function seed() {
  try {
    // Delete old categories
    await Category.deleteMany();
    console.log("🗑️ Old categories cleared");

    for (let cat of categories) {
      // Upload category image
      const uploadedCatImg = await uploadImage(cat.image);

      // Upload subcategory images
      const uploadedSubcats = [];
      for (let sub of cat.subcategories) {
        const uploadedSubImg = await uploadImage(sub.image);
        uploadedSubcats.push({
          name: sub.name,
          slug: slugify(sub.name, { lower: true }),
          image: uploadedSubImg,
        });
      }

      // Create category in DB
      await Category.create({
        name: cat.name,
        slug: slugify(cat.name, { lower: true }),
        image: uploadedCatImg,
        subcategories: uploadedSubcats,
      });
      console.log(`📦 Category '${cat.name}' seeded successfully!`);
    }

    console.log("🎉 All categories + subcategories uploaded to Cloudinary and saved in DB!");
    mongoose.connection.close();
  } catch (error) {
    console.error("❌ Error seeding categories:", error);
    mongoose.connection.close();
  }
}

// 🔹 Run the seed
seed();
