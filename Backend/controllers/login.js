const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try { 
    const formattedEmail = email.toLowerCase();

    const findUser = await User.findOne({ email: formattedEmail });
    if (!findUser) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const isPassMatch = await bcrypt.compare(password, findUser.password);
    if (!isPassMatch) {
      const error = new Error('Invalid password');
      error.statusCode = 400;
      throw error;
    }

    const secretKey = process.env.ACCESS_TOKEN_KEY;
    if (!secretKey) throw new Error("JWT secret key is not defined");

    const accessToken = jwt.sign(
      { email: formattedEmail, userId: findUser._id, role: findUser.role },
      process.env.ACCESS_TOKEN_KEY,
      { expiresIn: '7d' }
     );

    res.status(200).json({
      message: "Login successful",
      status: true,
      token: accessToken,
      role: findUser.role
    });

  } catch (error) {
    next(error);
  }
};

// Named export
module.exports = { loginUser };
