// const apis = () => {
//   const local = 'http://localhost:4000/';

//   const list = {
//     registerUser: `${local}user/register`,
//     loginUser: `${local}user/login`, 
//     forgetPassword: `${local}user/forget/password`, // Forget password endpoint
//     verifyOTP: `${local}user/verify/otp`,           // OTP verification endpoint
//     getOTPTime: `${local}user/get/otp/time`, 
//       getMeasurements: `${local}user/`,
//     // geyAccess:`${local}user\get\access`,       // OTP time fetch
//     passwordUpdate: `${local}user/password/update`,  // Password update endpoint

//      getAdminProfile: `${local}admin/profile`,  // backend mein jo endpoint hai
//      updateAdminProfile: `${local}admin/profile/update`
    
    
//   };

//   return list;
// };

// export default apis;
const apis = () => {
  const local = 'http://localhost:4000/';

  const list = {
    registerUser: `${local}user/register`,
    loginUser: `${local}user/login`, 
    forgetPassword: `${local}user/forget/password`, // Forget password endpoint
    verifyOTP: `${local}user/verify/otp`,           // OTP verification endpoint
    getOTPTime: `${local}user/get/otp/time`, 
    getMeasurements: `${local}user/`,
    // geyAccess:`${local}user/get/access`,       // OTP time fetch
    passwordUpdate: `${local}user/password/update`,  // Password update endpoint

     getAdminProfile: `${local}api/admin/profile`,
     updateAdminProfile: `${local}api/admin/profile/update`


  };

  return list;
};

export default apis;
