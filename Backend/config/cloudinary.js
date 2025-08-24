// const cloudinary = require("cloudinary").v2;
// require("dotenv").config(); // .env variables load karne ke liye

// cloudinary.config({
//   secure: true,
//     url: process.env.CLOUDINARY_URL // URLs HTTPS ban jaaye
// });

// module.exports = cloudinary;
const cloudinary = require("cloudinary").v2;
require("dotenv").config();

cloudinary.config({
  secure: true, 
  cloud_name: 'dwsctg415',           // Cloud name from your Cloudinary account
  api_key: '356821134385893',         // API key
  api_secret: 'tCMq1FnfSMK6zkMG7j35qz7yy5w' // API secret
});

module.exports = cloudinary;
