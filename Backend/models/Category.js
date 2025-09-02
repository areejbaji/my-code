// const mongoose = require("mongoose");

// const categorySchema = new mongoose.Schema({
//   name: { type: String, required: true, unique: true }, // "Men", "Women"
//   image: { type: String }, // optional
//   subcategories: [
//     {
//       name: { type: String, required: true }, // "Suit", "Kurta", "Frock"
//       image: { type: String } // optional
//     }
//   ]
// });

// module.exports = mongoose.model("Category", categorySchema);
const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // "Men", "Women"
  slug: { type: String, required: true, unique: true },   // <-- add this
  image: { type: String }, // optional
  subcategories: [
    {
      name: { type: String, required: true }, // "Suit", "Kurta", "Frock"
      slug: { type: String, required: true }, // <-- add this
      image: { type: String } // optional
    }
  ]
});

module.exports = mongoose.model("Category", categorySchema);
