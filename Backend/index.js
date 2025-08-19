
// const port = 4000;
// const express = require('express');
// const app = express();
// const mongoose = require('mongoose');
// const jwt = require('jsonwebtoken');
// const multer = require('multer');
// const path = require('path');
const cors = require("cors");

// app.use(express.json());
// app.use(cors());

// // Database connection
// mongoose.connect("mongodb+srv://areejsattar1234:areej123@cluster0.yyr5siz.mongodb.net/StyleHub");

// // Test route
// app.get("/", (req, res) => {
//     res.send("Express is running - Hello from the backend");
// });

// // Multer storage config
// const storage = multer.diskStorage({
//     destination: './upload/images', // ❌ space hata diya
//     filename: (req, file, cb) => {
//         cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
//     }
// });

// const upload = multer({ storage: storage });

// // Static folder for images
// app.use('/images', express.static('upload/images'));

// // Upload route
// app.post('/upload', upload.single('product'), (req, res) => {
//     console.log(req.file); // Debug
//     res.json({
//         success: 1,
//         image_url: `http://localhost:${port}/images/${req.file.filename}`
//     });
// });
// // schemma for creating product
// const Product =mongoose.model("Product",{
//     id:{
//         type:Number,
//         required:true
//     },
//     name:{
//         type:String,
//         required:true
//     },
//     image:{
//         type:String,
//         required:true
//     },
//     category:{
//         type:String,
//         required:true
//     },
//     new_price:{
//         type:Number,
//         required:true
//     },
//     old_price:{
//         type:Number,
//         required:true
//     },
//     date:{
//         type:Date,
//         default:Date.now
//     },
//     available:{
//         type:Boolean,
//         default:true
//     },

// })
// app.post('/addproduct', async (req, res) => {
//     let products = await Product.find();
//     let id;
//     if(products.length>0){
//         let last_product_array = products.slice(-1);
//         let last_product = last_product_array[0];
//         id = last_product.id+1;
//     }
//     else {
//         id:1;
//     }
//     const product = new Product({
//         id: id,
//         name: req.body.name,
//         image: req.body.image,
//         category: req.body.category,
//         new_price: req.body.new_price,
//         old_price: req.body.old_price
//     });
//     console.log(product);
//     await product.save();
//     console.log("Product added successfully");
//     res.json({
//         success:1,
//         name:req.body.name,
//     })
        
// })

// // api bna re product ko delete krny mai help full hogi
// app.post('/removeproduct', async (req, res) => {
//     await Product.findOneAndDelete({ id: req.body.id });
//     res.json({ 
//         success: true,
//     name:req.body.name });
// })
// //creating api for getting all products
// app.get('/allproducts', async (req, res) => {
//     let products = await Product.find({});
//     console.log("ALL Products fetched successfully");
//     res.send(products);
// })
// app.listen(port, (error) => {
//     if (!error) {
//         console.log("Server is running on port " + port);
//     } else {
//         console.log("Error: " + error);
//     }
// });
const express = require('express');
const mongoose = require('mongoose');
const getConnection = require('./utils/getConnection'); // Importing the connection function
require('dotenv').config();
const userRoutes = require('./routes/user')
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use('/user', userRoutes);

// app.use((error,req,res,next)=>{
//     const message = error.message || 'Internal Server Error';
//     const status = error.status || 500;
//     res.json(statusCode).json( {message:message});
// }
// )// Use the user routes

app.use((error, req, res, next) => {
  const message = error.message || 'Internal Server Error';
  const status = error.status || 500;
  res.status(status).json({ message });
});


// 🔥 yeh call add kiya hai
getConnection();

// 🔥 yahan sirf console log change kiya hai
app.listen(process.env.PORT, () => 
  console.log('Server is running on port ' + process.env.PORT)
);
