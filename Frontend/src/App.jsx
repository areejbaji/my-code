
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Home from './Home';
// import Navbar from './Navbar';
// import TermsAndConditions from './Footer/Termsandcondition';
// import ShippingPolicy from './Footer/Shippingpolicy';
// // import { FaQ } from 'react-icons/fa6';
// import Footer from './Footer/Footer';

// import ContactForm from './Footer/Contactus';

// import WomenPage from './Women';
// import ProductDetailPage from './ProductDetailPage';
// import AboutUs from './AboutUs';
// import Men from './Men';

// import CartPage from './CartPage';
// import DeliveryDetails from './DeliveryDetail';
// import { FaQ } from 'react-icons/fa6';



// const App = () => {
//   return (
//     <Router>
//       <Navbar/>
//       <Routes>
      
//         <Route path="/" element={<Home />} />
//         {/* <Route path="/about" element={<About />} /> */}
//         <Route path="/TermsandCondition" element={<TermsAndConditions/>} />
//          <Route path="/ShippingPolicy" element={<ShippingPolicy/>} />
//       <Route path='Faq' element={<FaQ  />}/>
//         <Route path='Contactus' element={<ContactForm/>}/>
//         <Route path='women' element={<WomenPage />} />
//         <Route path='Men' element={<Men />} />
//         <Route path="/product/:id" element={<ProductDetailPage />} />
//          <Route path='AboutUs' element={<AboutUs/>}/>
//          <Route path="/cart" element={<CartPage />} />
//          <Route path="/DeliveryDetail" element={<DeliveryDetails />} />
//       </Routes>
//       <Footer></Footer>
//     </Router>
//   );
// };

// export default App;
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './Home';
import Navbar from './Navbar';
import TermsAndConditions from './Footer/Termsandcondition';
import ShippingPolicy from './Footer/Shippingpolicy';
import Footer from './Footer/Footer';
import ContactForm from './Footer/Contactus';
import WomenPage from './Women';
import ProductDetailPage from './ProductDetailPage';
import AboutUs from './AboutUs';
import Men from './Men';
import CartPage from './CartPage';
import DeliveryDetails from './DeliveryDetail';
import Register from './auth/Register';
import Login from './auth/Login';
import UpdatePassword from './auth/UpdatePassword';
import VerifyOTP from './auth/VerifyOTP';
import ForgetPassword from './auth/ForgetPassword';
import MyOrders from './auth/myOrders';
import CheckoutPage from './Checkout';
// import Super from './auth/Super';

const App = () => {
  const location = useLocation();
  const noLayoutRoutes = [
    '/login',
    '/register',
    '/forget/password',
    '/verifyotp',
    '/updatepassword'
  ];

  // Hide Navbar + Footer on auth routes
  const showLayout = !noLayoutRoutes.some(route =>
    location.pathname.toLowerCase().startsWith(route)
  );

  return (
    <>
      {showLayout && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/termsandcondition" element={<TermsAndConditions />} />
        <Route path="/shippingpolicy" element={<ShippingPolicy />} />
        <Route path="/contactus" element={<ContactForm />} />
        <Route path="/women" element={<WomenPage />} />
        <Route path="/men" element={<Men />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/deliverydetail" element={<DeliveryDetails />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
         <Route path="/checkout" element={<CheckoutPage/>} />
        <Route path="/forget/password" element={<ForgetPassword />} />
         {/* <Route path="myOrders" element={<MyOrders/>} /> */}
        <Route path="/myOrders" element={<MyOrders />} />
         {/* <Route element={<Super/>}> */}
         <Route path="/Updatepassword" element={<UpdatePassword />} />
        <Route path="/VerifyOTP" element={<VerifyOTP />} />
         {/* </Route> */}

      </Routes>
      {showLayout && <Footer />}
    </>
  );
};

export default App;
