  const express = require('express');
const router = express.Router();

// Import named controller functions (ensure correct file casing for cross-platform)
const { registerUser } = require('../controllers/Register');
const { loginUser } = require('../controllers/login');
const { forgetPasswordHandler } = require('../controllers/forgetPassword');
const { verifyOTPHandler } = require('../controllers/verifyOTP');
const { getOTPTimeHandler } = require('../controllers/getOTPTime');
const { passwordUpdateHandler } = require('../controllers/passwordUpdate');
const getAccess = require('../controllers/getAccess');
// const { getAccess } = require('../controllers/getAccess');
const User = require('../models/User');
// ✅ Define routes with correct callbacks
router.post('/register', registerUser);                  // Registration route
router.post('/login', loginUser);                        // Login route
router.post('/forget/password', forgetPasswordHandler);  // Forget password route
router.post('/verify/otp', verifyOTPHandler);            // Verify OTP route
router.post('/get/otp/time', getOTPTimeHandler);         // Get OTP time route
router.post('/password/update', passwordUpdateHandler);  // Password update route
// router.post('/get/access', getAccess);  
router.post('/get/access', getAccess);  
router.get("/:userId/measurements", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ measurements: user.measurements || {} });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});              // Get access route 
// ✅ Export the router
module.exports = router;
  