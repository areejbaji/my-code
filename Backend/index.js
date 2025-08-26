
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const getConnection = require('./utils/getConnection');
const productRoutes = require('./routes/product');
const userRoutes = require('./routes/user');
const sizeChartRoutes = require('./routes/sizeChartRoutes');
const uploadRoutes = require("./routes/upload");
const orderRoute = require("./routes/order");
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));

//Routes
app.use('/api/sizecharts', sizeChartRoutes);
app.use("/api/products", require("./routes/product"));
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoute);
// Routes
// app.use('/product', productRoutes);
app.use('/user', userRoutes);

// Static folder for images
app.use('/images', express.static('upload/images'));

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Multer setup for multiple images
const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  }
});
const upload = multer({ storage });

// Image upload route
app.post('/upload', upload.array('images', 5), (req, res) => {
  const urls = req.files.map(file => `http://localhost:${process.env.PORT}/images/${file.filename}`);
  res.json({ success: true, urls });
});


// Error handler
app.use((error, req, res, next) => {
  const message = error.message || 'Internal Server Error';
  const status = error.status || 500;
  res.status(status).json({ message });
});

// Connect DB and start server
getConnection();
app.listen(process.env.PORT, () => console.log('Server is running on port ' + process.env.PORT));
// const express = require('express');
// const cors = require('cors');
// const multer = require('multer');
// const path = require('path');
// require('dotenv').config();

// const getConnection = require('./utils/getConnection');
// const productRoutes = require('./routes/product');
// const userRoutes = require('./routes/user');
// const sizeChartRoutes = require('./routes/sizeChartRoutes');
// const uploadRoutes = require("./routes/upload");

// const app = express();

// // Middlewares
// app.use(cors());
// app.use(express.json({ limit: '50mb' }));
// app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// // Routes
// app.use('/api/sizecharts', sizeChartRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/users", userRoutes); // user route
// app.use("/api/upload", uploadRoutes);

// // Static folder for images
// app.use('/images', express.static('upload/images'));

// // Root route
// app.get("/", (req, res) => {
//   res.send("API is running...");
// });

// // Multer setup for multiple images
// const storage = multer.diskStorage({
//   destination: './upload/images',
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}_${file.originalname}`);
//   }
// });
// const upload = multer({ storage });

// // Image upload route
// app.post('/upload', upload.array('images', 5), (req, res) => {
//   const urls = req.files.map(file => `http://localhost:${process.env.PORT}/images/${file.filename}`);
//   res.json({ success: true, urls });
// });

// // Error handler
// app.use((error, req, res, next) => {
//   const message = error.message || 'Internal Server Error';
//   const status = error.status || 500;
//   res.status(status).json({ message });
// });

// // Connect DB and start server
// getConnection()
//   .then(() => {
//     console.log("MongoDB connected successfully");
//     app.listen(process.env.PORT, () =>
//       console.log("Server is running on port " + process.env.PORT)
//     );
//   })
//   .catch((err) => {
//     console.error("Failed to connect DB:", err.message);
//   });
