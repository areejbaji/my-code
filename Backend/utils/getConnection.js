// const mongoose = require('mongoose');

// const getConnection = () => {
//   try {
//     mongoose.connect(process.env.MONGO_URI)
//       .then((connection) => {
//         console.log("MongoDB connected successfully");
//       })
//       .catch((error) => {
//         console.log("failed to connect");
//       });

//   } catch (err) {
//     console.log(err.message);
//   }
// };
// module.exports = getConnection;
const mongoose = require("mongoose");

const getConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    process.exit(1);
  }
};

module.exports = getConnection;

