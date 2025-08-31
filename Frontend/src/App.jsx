
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
import SearchResults from './SearchResults';
import Receipt from './Receipt';


import AdminDashboard from './admin/AdminDashboard';
import AdminLayout from './admin/AdminLayout';
import User from './admin/User';


import OrderDetailPage from './admin/OrderDetail';
import OrdersPage from './admin/OrdersPage';
import ViewAllProducts from './admin/ViewAllProducts';
import StockManagement from './admin/StockManagement';
import AdminRoute from './admin/AdminRoute';
import EditProduct from './admin/EditProduct';
import AddProduct from './admin/AddProduct';
import AdminProfile from './admin/AdminProfile';

// import Super from './auth/Super';

const App = () => {
  const location = useLocation();
  const noLayoutRoutes = [
    '/login',
    '/register',
    '/forget/password',
    '/verifyotp',
    '/updatepassword',
    '/admin'
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
          <Route path="/receipt" element={<Receipt/>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
         <Route path="/checkout" element={<CheckoutPage/>} />
        <Route path="/forget/password" element={<ForgetPassword />} />
         {/* <Route path="myOrders" element={<MyOrders/>} /> */}
        <Route path="/myOrders" element={<MyOrders />} />
              <Route path="/search" element={<SearchResults />} />
         {/* <Route element={<Super/>}> */}
         <Route path="/Updatepassword" element={<UpdatePassword />} />
        <Route path="/VerifyOTP" element={<VerifyOTP />} />
         {/* </Route> */}
         <Route 
          path="/admin/*" 
          element={
            <AdminRoute>
            <AdminLayout />
            </AdminRoute>
          }
        >
           
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<User/>} />
           <Route path="products" element={<ViewAllProducts />} />
                 <Route path="products/new" element={<AddProduct />} />
         <Route path="products/edit/:id" element={<EditProduct />} />
          <Route path="orders" element={<OrdersPage />} /> {/* Admin orders list */}
          <Route path="orders/:orderId" element={<OrderDetailPage />} />
          <Route path="profile" element={<AdminProfile />} />
        <Route path="stock" element={<StockManagement />} />
        </Route>
      </Routes>
      {showLayout && <Footer />}
    </>
  );
};

export default App;
