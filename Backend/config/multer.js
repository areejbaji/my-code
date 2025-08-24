// backend/config/multer.js
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("./cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "stylehub_products", // Cloudinary folder
    allowed_formats: ["jpg", "jpeg", "png", "webp"]              // image format
  }
});

const parser = multer({ storage });

module.exports = parser;
