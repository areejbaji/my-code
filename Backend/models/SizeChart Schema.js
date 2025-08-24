const mongoose = require("mongoose");

const sizeRangeSchema = new mongoose.Schema({
  size: { type: String, required: true }, // XS, S, M, L, XL
  shirt: {                                    
    Length: { type: [Number], required: true },
    Shoulder: { type: [Number], required: true },
    Armhole: { type: [Number], required: true },
    Chest: { type: [Number], required: true },
    Waist: { type: [Number], required: true },
    Hip: { type: [Number], required: true },
    "Sleeve Length": { type: [Number], required: true },
    Wrist: { type: [Number], required: true },
    "Bottom/Damman": { type: [Number], required: true },
  },
  trouser: {                                 
    Length: { type: [Number], required: true },
    Waist: { type: [Number], required: true },
    Knee: { type: [Number], required: true },
    Thigh: { type: [Number], required: true },
    Hip: { type: [Number], required: true },
    Bottom: { type: [Number], required: true },
  },

});

const sizeChartSchema = new mongoose.Schema({
  category: { type: String, required: true, unique: true }, // e.g. "men-suit"
  sizes: [sizeRangeSchema]
});

module.exports = mongoose.model("SizeChart", sizeChartSchema);
