// models/CustomMeasurement.js
const mongoose = require('mongoose');

const customMeasurementSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  measurements: {
    Length: Number,
    Shoulder: Number,
    Armhole: Number,
    Chest: Number,
    Waist: Number,
    Hip: Number,
    'Sleeve Length': Number,
    Wrist: Number,
    'Bottom/Damman': Number,
    Knee: Number,
    Thigh: Number
  },
  dateAdded: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CustomMeasurement', customMeasurementSchema);
