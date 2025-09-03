
const apis = () => {
  const local = 'http://localhost:4000/';

  const list = {
    registerUser: `${local}user/register`,
    loginUser: `${local}user/login`, 
    forgetPassword: `${local}user/forget/password`, 
    verifyOTP: `${local}user/verify/otp`,           
    getOTPTime: `${local}user/get/otp/time`, 
    getMeasurements: `${local}user/`,
    getAccess:`${local}user/get/access`,      
    passwordUpdate: `${local}user/password/update`, 

     getAdminProfile: `${local}api/admin/profile`,
     updateAdminProfile: `${local}api/admin/profile/update`


  };

  return list;
};

export default apis;
