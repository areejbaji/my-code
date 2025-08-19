 const express = require('express');
const router = express.Router();

// Import named controller functions (ensure correct file casing for cross-platform)
const { registerUser } = require('../controllers/Register');
const { loginUser } = require('../controllers/login');
const { forgetPasswordHandler } = require('../controllers/forgetPassword');
const { verifyOTPHandler } = require('../controllers/verifyOTP');
const { getOTPTimeHandler } = require('../controllers/getOTPTime');
const { passwordUpdateHandler } = require('../controllers/passwordUpdate');

// ✅ Define routes with correct callbacks
router.post('/register', registerUser);                  // Registration route
router.post('/login', loginUser);                        // Login route
router.post('/forget/password', forgetPasswordHandler);  // Forget password route
router.post('/verify/otp', verifyOTPHandler);            // Verify OTP route
router.post('/get/otp/time', getOTPTimeHandler);         // Get OTP time route
router.post('/password/update', passwordUpdateHandler);  // Password update route

// ✅ Export the router
module.exports = router;
