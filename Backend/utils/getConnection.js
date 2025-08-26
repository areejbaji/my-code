const mongoose = require('mongoose');

const getConnection = () => {
  try {
    mongoose.connect(process.env.MONGO_URI)
      .then((connection) => {
        console.log("MongoDB connected successfully");
      })
      .catch((error) => {
        console.log("failed to connect");
      });

  } catch (err) {
    console.log(err.message);
  }
};
module.exports = getConnection;
// const mongoose = require('mongoose');

// const getConnection = () => {
//   return mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });
// };

// module.exports = getConnection;
