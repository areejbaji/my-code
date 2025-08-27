
const express = require("express");
const mongoose = require("mongoose");
const SizeChart = require("../models/SizeChart Schema");

const router = express.Router();

// ✅ Create new size chart
router.post("/", async (req, res) => {
  try {
    const sizeChart = new SizeChart(req.body);
    await sizeChart.save();
    res.status(201).json(sizeChart);
  } catch (err) {
    res.status(400).json({ message: "Error creating size chart", error: err.message });
  }
});

// ✅ Get all size charts
router.get("/", async (req, res) => {
  try {
    const sizeCharts = await SizeChart.find();
    res.json(sizeCharts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching size charts", error: err.message });
  }
});

// ✅ Get size chart by ID
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    const sizeChart = await SizeChart.findById(id);
    if (!sizeChart) return res.status(404).json({ message: "Size chart not found" });

    res.json(sizeChart);
  } catch (err) {
    res.status(500).json({ message: "Error fetching size chart", error: err.message });
  }
});

// ✅ Update size chart by ID
router.put("/:id", async (req, res) => {
  try {
    const sizeChart = await SizeChart.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!sizeChart) return res.status(404).json({ message: "Size chart not found" });
    res.json(sizeChart);
  } catch (err) {
    res.status(400).json({ message: "Error updating size chart", error: err.message });
  }
});

// ✅ Delete size chart by ID
router.delete("/:id", async (req, res) => {
  try {
    const sizeChart = await SizeChart.findByIdAndDelete(req.params.id);
    if (!sizeChart) return res.status(404).json({ message: "Size chart not found" });
    res.json({ message: "Size chart deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting size chart", error: err.message });
  }
});

module.exports = router;
