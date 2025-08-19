const apis = () => {
  const local = 'http://localhost:3000/';

  const list = {
    registerUser: `${local}user/register`,
    loginUser: `${local}user/login`,
    forgetPassword: `${local}user/forget/password`, // Forget password endpoint
    verifyOTP: `${local}user/verify/otp`,           // OTP verification endpoint
    getOTPTime: `${local}user/get/otp/time`,        // OTP time fetch
    passwordUpdate: `${local}user/password/update`  // Password update endpoint
    ,
    // Admin endpoints
    adminMe: `${local}admin/me`,
    adminUsers: `${local}admin/users`,
    adminProducts: `${local}admin/products`,
    adminOrders: `${local}admin/orders`
  };

  return list;
};

export default apis;
