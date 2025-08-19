const crypto = require('crypto');
const User = require('../models/User');
const sendMailer = require('../src/utils/sendMailer');
const { send } = require('process');
const forgetPasswordHandler = async (req, res, next) => {
  const { email } = req.body;

  try {
    const formattedEmail = email.toLowerCase();
    const findUser = await User.findOne({ email: formattedEmail });

    if (!findUser) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    if (
      findUser.otp &&
      findUser.otp.sendTime &&
      new Date().getTime() - findUser.otp.sendTime < 60 * 1000
    ) {
      const waitTime = new Date(findUser.otp.sendTime + 60 * 1000).toLocaleTimeString();
      throw new Error(`Please wait until ${waitTime} to request another OTP`);
    }

    const otp = Math.floor(Math.random() * 900000) + 100000;
    const token = crypto.randomBytes(32).toString('hex');

    if (!findUser.otp) {
      findUser.otp = {};
    }

    findUser.otp.otp = otp;
    findUser.otp.sendTime = new Date().getTime() +1 * 60 * 1000; // Set send time to 1 minute from now
    findUser.otp.token = token;

    await findUser.save();
 sendMailer(otp, formattedEmail);



    console.log("Generated OTP:", otp);
    res.status(200).json({
      message: 'Please check your email for the OTP',
      status: true,
      token,
    });

  } catch (error) {
    next(error);
  }
};

// Named export
module.exports = { forgetPasswordHandler };
