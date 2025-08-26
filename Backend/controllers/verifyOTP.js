const User = require('../models/User');

const verifyOTPHandler = async (req, res, next) => {
  const { otp } = req.body;

  try {
    const otpString = otp.toString(); // Ensure string match
    const findUser = await User.findOne({ 'otp.otp': otpString });

    if (!findUser) {
      const error = new Error('Invalid OTP');
      error.statusCode = 400;
      throw error;
    }

    if (!findUser.otp || !findUser.otp.sendTime) {
      const error = new Error('OTP data missing or corrupt');
      error.statusCode = 400;
      throw error;
    }

    if (new Date(findUser.otp.sendTime).getTime() < Date.now()) {
      const error = new Error('OTP has expired');
      error.statusCode = 400;
      throw error;
    }

    // ✅ Clear the OTP after successful verification
    findUser.otp.otp = null;
    await findUser.save();

    res.status(200).json({
      message: 'OTP verified successfully',
      status: true,
      userId: findUser._id // optional
    });

  } catch (error) {
    next(error); // ✅ Let express error middleware handle it
  }
};

module.exports = { verifyOTPHandler };



