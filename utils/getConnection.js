const mongoose = require('mongoose');

const getConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    throw error; // Important: throw to let caller know connection failed
  }
};

module.exports = getConnection;
