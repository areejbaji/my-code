// const User = require('../models/User');

// const verifyOTPHandler = async (req, res, next) => {
//   const { otp } = req.body;

//   try {
//     const otpString = otp.toString(); 
//     const findUser = await User.findOne({ 'otp.otp': otpString });

//     if (!findUser) {
//       const error = new Error('Invalid OTP');
//       error.statusCode = 400;
//       throw error;
//     }

//     if (!findUser.otp || !findUser.otp.sendTime) {
//       const error = new Error('OTP data missing or corrupt');
//       error.statusCode = 400;
//       throw error;
//     }

//     if (new Date(findUser.otp.sendTime).getTime() < Date.now()) {
//       const error = new Error('OTP has expired');
//       error.statusCode = 400;
//       throw error;
//     }

   
//     findUser.otp.otp = null;
//     await findUser.save();

//     res.status(200).json({
//       message: 'OTP verified successfully',
//       status: true,
//       userId: findUser._id 
//     });

//   } catch (error) {
//     next(error); 
//   }
// };

// module.exports = { verifyOTPHandler };



const User = require('../models/User');

const verifyOTPHandler = async (req, res, next) => {
  const { otp } = req.body;

  try {
    if (!otp) {
      const error = new Error("OTP is required");
      error.statusCode = 400;
      throw error;
    }

    const otpString = otp.toString();
    const user = await User.findOne({ 'otp.otp': otpString });

    if (!user) {
      const error = new Error("Invalid OTP");
      error.statusCode = 400;
      throw error;
    }

    const otpValidDuration = 10 * 60 * 1000; // 10 minutes
    if (!user.otp?.sendTime || Date.now() > user.otp.sendTime + otpValidDuration) {
      const error = new Error("OTP has expired");
      error.statusCode = 400;
      throw error;
    }

    // Clear OTP after verification
    user.otp = null;
    await user.save();

    res.status(200).json({
      message: 'OTP verified successfully',
      status: true,
      userId: user._id,
    });

  } catch (error) {
    next(error);
  }
};

module.exports = { verifyOTPHandler };
