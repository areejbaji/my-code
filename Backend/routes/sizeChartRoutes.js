
// const express = require("express");
// const router = express.Router();
// const mongoose = require("mongoose");
// const SizeChart = require("../models/SizeChart Schema");

// // GET ALL SIZECHARTS
// router.get("/all", async (req, res) => {
//   try {
//     const charts = await SizeChart.find();
//     res.json({ success: true, charts });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// // GET SIZECHART BY CATEGORY
// // backend/routes/sizeChartRoutes.js
// router.get("/category/:category", async (req, res) => {
//   try {
//     const chart = await SizeChart.findOne({ category: req.params.category });
//     if (!chart) return res.status(404).json({ success: false, message: "Size chart not found" });
//     res.json({ success: true, chart });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// // UPDATE SIZECHART BY ID (frock removed)
// router.put("/update/:id", async (req, res) => {
//   try {
//     const id = req.params.id;
//     const { category, sizes } = req.body;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ success: false, message: "Invalid ID" });
//     }

//     // Map sizes: only shirt + trouser (frock removed)
//     const mappedSizes = sizes.map(sizeObj => ({
//       size: sizeObj.size,
//       shirt: sizeObj.shirt,       // only shirt
//       trouser: sizeObj.trouser    // trouser always
//     }));

//     const updatedChart = await SizeChart.findByIdAndUpdate(
//       id,
//       { category, sizes: mappedSizes },
//       { new: true, runValidators: true }
//     );

//     if (!updatedChart) return res.status(404).json({ success: false, message: "Size chart not found" });

//     res.json({ success: true, chart: updatedChart });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// });

// // GET SIZECHART BY ID
// app.get("/api/sizecharts/:id", async (req, res) => {
//   try {
//     const sizeChart = await SizeChart.findById(req.params.id);
//     if(!sizeChart) return res.status(404).json({ message: "Size chart not found" });
//     res.json(sizeChart);
//   } catch(err) {
//     res.status(500).json({ message: "Error fetching size chart", error: err.message });
//   }
// });

// // router.get("/:id", async (req, res) => {
// //   try {
// //     const id = req.params.id;
// //     if (!mongoose.Types.ObjectId.isValid(id)) {
// //       return res.status(400).json({ success: false, message: "Invalid ID" });
// //     }

// //     const chart = await SizeChart.findById(id);
// //     if (!chart) return res.status(404).json({ success: false, message: "Size chart not found" });

// //     res.json({ success: true, chart });
// //   } catch (err) {
// //     res.status(500).json({ success: false, message: err.message });
// //   }
// // });
// // ADD NEW SIZECHART
// router.post("/add", async (req, res) => {
//   try {
//     const { category, sizes } = req.body;
//     if (!category || !sizes) {
//       return res.status(400).json({ success: false, message: "Category and sizes are required" });
//     }
//     const newChart = new SizeChart({ category, sizes });
//     await newChart.save();
//     res.status(201).json({ success: true, chart: newChart });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// });

// module.exports = router;

// routes/sizeChartRoutes.js
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
