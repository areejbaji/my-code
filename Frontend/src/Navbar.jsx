
// import React, { useState } from 'react';
// import { Link } from 'react-router-dom';
// import { FaUserCircle, FaShoppingCart, FaTimes, FaBell, FaUser, FaLock, FaTruck, FaSignOutAlt } from 'react-icons/fa';
// import { AiOutlineSearch } from 'react-icons/ai';
// import './Navbar.css';
// import logo from './assets/logo.png';
// import { useSelector } from 'react-redux';

// const Navbar = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [userDropdownOpen, setUserDropdownOpen] = useState(false);
//   const [notificationOpen, setNotificationOpen] = useState(false);

//   const cartItems = useSelector((state) => state.cart.items);
//   const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

//   const dummyNotifications = [
//     { id: 1, title: 'Order #1234 shipped' },
//     { id: 2, title: 'New discount available!' },
//   ];

//   const userName = "John Doe"; // Replace with dynamic user data

//   return (
//     <>
//       <nav className="navbar">
//         <div className="nav-logo">
//           <img src={logo} alt="StyleHub Logo" />
//           <h1>StyleHub</h1>
//         </div>

        

//         <ul className={`nav-links ${sidebarOpen ? 'open' : ''}`}>
//           <li><Link to="/">Home</Link></li>
//           <li><Link to="/women">Women</Link></li>
//           <li><Link to="/men">Men</Link></li>
//           <li><Link to="/aboutus">About Us</Link></li>
//           <li><Link to="/Register">Register</Link></li>
//         </ul>
//         <div className="search-container">
//           <AiOutlineSearch className="search-icon" />
//           <input type="text" placeholder="Search..." />
//         </div>

//         <div className="nav-icons">
//           <Link to="/cart" className="cart-link">
//             <FaShoppingCart />
//             {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
//           </Link>

//           <div className="notification-wrapper">
//             <FaBell onClick={() => setNotificationOpen(!notificationOpen)} />
//             {dummyNotifications.length > 0 && <span className="notification-badge">{dummyNotifications.length}</span>}
//             {notificationOpen && (
//               <div className="dropdown-content">
//                 {dummyNotifications.map((n) => (
//                   <span key={n.id} className="dropdown-item">{n.title}</span>
//                 ))}
//               </div>
//             )}
//           </div>

//           <div className="user-wrapper">
//             <FaUserCircle onClick={() => setUserDropdownOpen(!userDropdownOpen)} />
//             <span className="user-name">{userName}</span>
//             {userDropdownOpen && (
//               <div className="dropdown-content">
//                 <Link to="/myProfile" className="dropdown-item"><FaUser /> My Profile</Link>
//                 <Link to="/changePassword" className="dropdown-item"><FaLock /> Change Password</Link>
//                 <Link to="/myOrders" className="dropdown-item"><FaTruck /> My Orders</Link>
//                 <Link to="/myCart" className="dropdown-item"><FaShoppingCart /> My Cart</Link>
//                 <button className="dropdown-item logout-btn"><FaSignOutAlt /> Logout</button>
//               </div>
//             )}
//           </div>

//           <FaTimes className="menu-close" onClick={() => setSidebarOpen(false)} />
//         </div>

//         <div className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
//           <i className="fa fa-bars"></i>
//         </div>
//       </nav>
//     </>
//   );
// };

// export default Navbar;

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaShoppingCart, FaTimes, FaBell, FaUser, FaLock, FaTruck, FaSignOutAlt } from 'react-icons/fa';
import { AiOutlineSearch } from 'react-icons/ai';
import './Navbar.css';
import logo from './assets/logo.png';
import { useSelector } from 'react-redux';

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [userName, setUserName] = useState('Guest');

  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.items);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const dummyNotifications = [
    { id: 1, title: 'Order #1234 shipped' },
    { id: 2, title: 'New discount available!' },
  ];

  // Load user name from localStorage on mount
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData?.name) {
      setUserName(userData.name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <img src={logo} alt="StyleHub Logo" />
        <h1>StyleHub</h1>
      </div>

      <ul className={`nav-links ${sidebarOpen ? 'open' : ''}`}>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/women">Women</Link></li>
        <li><Link to="/men">Men</Link></li>
        <li><Link to="/aboutus">About Us</Link></li>
        <li><Link to="/register">Register</Link></li>
      </ul>

      <div className="search-container">
        <AiOutlineSearch className="search-icon" />
        <input type="text" placeholder="Search..." />
      </div>

      <div className="nav-icons">
        <Link to="/cart" className="cart-link">
          <FaShoppingCart />
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </Link>

        <div className="notification-wrapper">
          <FaBell onClick={() => setNotificationOpen(!notificationOpen)} />
          {dummyNotifications.length > 0 && <span className="notification-badge">{dummyNotifications.length}</span>}
          {notificationOpen && (
            <div className="dropdown-content">
              {dummyNotifications.map((n) => (
                <span key={n.id} className="dropdown-item">{n.title}</span>
              ))}
            </div>
          )}
        </div>

        <div className="user-wrapper">
          <FaUserCircle onClick={() => setUserDropdownOpen(!userDropdownOpen)} />
          <span className="user-name">{userName}</span>
          {userDropdownOpen && (
            <div className="dropdown-content">
              <Link to="/myProfile" className="dropdown-item"><FaUser /> My Profile</Link>
              <Link to="/changePassword" className="dropdown-item"><FaLock /> Change Password</Link>
              <Link to="/myOrders" className="dropdown-item"><FaTruck /> My Orders</Link>
              <Link to="/myCart" className="dropdown-item"><FaShoppingCart /> My Cart</Link>
              <button className="dropdown-item logout-btn" onClick={handleLogout}>
                <FaSignOutAlt /> Logout
              </button>
            </div>
          )}
        </div>

        <FaTimes className="menu-close" onClick={() => setSidebarOpen(false)} />
      </div>

      <div className="menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <i className="fa fa-bars"></i>
      </div>
    </nav>
  );
};

export default Navbar;
