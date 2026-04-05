// Navbar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaShoppingCart, FaTruck, FaSignOutAlt, FaBell } from 'react-icons/fa';
import { AiOutlineSearch } from 'react-icons/ai';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from './redux/productsSlice';
import axios from 'axios';
import './Navbar.css';
import logo from './assets/logo.png';

// Fixed Notifications Component
const Notifications = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const notifRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      // ✅ Check multiple possible token keys (your app uses "token" or "userToken")
      const token = localStorage.getItem("accessToken") || 
                    localStorage.getItem("token") || 
                    localStorage.getItem("userToken");
      if (!token) {
        // User not logged in, silently return
        return;
      }

      const response = await axios.get(
        `http://localhost:4000/api/notifications/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setNotifications(response.data.notifications);
    } catch (error) {
      // Only log if it's not an auth error (user not logged in is expected)
      if (error.response?.status !== 401 && error.response?.status !== 403) {
        console.error(
          "Error fetching notifications:",
          error.response?.data || error.message
        );
      }
    }
  };

  useEffect(() => {
    // Only fetch if userId exists (user is logged in)
    if (userId) {
      fetchNotifications();

      const handleNewNotification = () => fetchNotifications();
      window.addEventListener("new-notification", handleNewNotification);

      return () => {
        window.removeEventListener("new-notification", handleNewNotification);
      };
    }
  }, [userId]);

  const markAsRead = async (id) => {
    // ✅ Check multiple possible token keys
    const token = localStorage.getItem("accessToken") || 
                  localStorage.getItem("token") || 
                  localStorage.getItem("userToken");
    if (!token) return;

    try {
      await axios.put(
        `http://localhost:4000/api/notifications/${id}/read`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error("Mark as read error:", err.response || err);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="notifications-wrapper" ref={notifRef}>
      <FaBell className="bell-icon" onClick={() => setDropdownOpen(!dropdownOpen)} />
      {unreadCount > 0 && <span className="notif-count">{unreadCount}</span>}
      {dropdownOpen && (
        <div className="notifications-dropdown">
          {notifications.length === 0 ? <p>No notifications</p> :
            notifications.map(n => (
              <div
                key={n._id}
                className={`notification-item ${n.read ? 'read' : 'unread'}`}
                onClick={() => markAsRead(n._id)}
              >
                {n.message}
                <small>{new Date(n.createdAt).toLocaleString()}</small>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
};


//Notifications Component 
// const Notifications = ({ userId }) => {
//   const [notifications, setNotifications] = useState([]);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const notifRef = useRef(null);

// const fetchNotifications = async () => {
//   try {
//     // Correct token key
//     const token = localStorage.getItem("accessToken");
//     if (!token) {
//       console.warn("No token found. Cannot fetch notifications.");
//       return;
//     }

//     const response = await axios.get(
//       `http://localhost:4000/api/notifications/user/${userId}`,
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     setNotifications(response.data.notifications);
//   } catch (error) {
//     console.error(
//       "Error fetching notifications:",
//       error.response?.data || error.message
//     );
//   }
// };

//   useEffect(() => {
//     fetchNotifications();

//     const handleNewNotification = () => fetchNotifications();
//     window.addEventListener("new-notification", handleNewNotification);

//     return () => {
//       window.removeEventListener("new-notification", handleNewNotification);
//     };
//   }, [userId]);

//   const markAsRead = async (id) => {
//   const token = localStorage.getItem("token");
//   if (!token) return;

//   try {
//     await axios.put(
//       `http://localhost:4000/api/notifications/${id}/read`,
//       {},
//       {
//         headers: { Authorization: `Bearer ${token}` }
//       }
//     );
//     setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
//   } catch (err) {
//     console.error("Mark as read error:", err.response || err);
//   }
// };


//   const unreadCount = notifications.filter(n => !n.read).length;

//   // Close dropdown on outside click
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (notifRef.current && !notifRef.current.contains(e.target)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   return (
//     <div className="notifications-wrapper" ref={notifRef}>
//       <FaBell className="bell-icon" onClick={() => setDropdownOpen(!dropdownOpen)} />
//       {unreadCount > 0 && <span className="notif-count">{unreadCount}</span>}
//       {dropdownOpen && (
//         <div className="notifications-dropdown">
//           {notifications.length === 0 ? <p>No notifications</p> :
//             notifications.map(n => (
//               <div
//                 key={n._id}
//                 className={`notification-item ${n.read ? 'read' : 'unread'}`}
//                 onClick={() => markAsRead(n._id)}
//               >
//                 {n.message}
//                 <small>{new Date(n.createdAt).toLocaleString()}</small>
//               </div>
//             ))
//           }
//         </div>
//       )}
//     </div>
//   );
// };

//  Navbar Component 
const Navbar = () => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null);

  const shopRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const userRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.items || []);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const products = useSelector((state) => state.products?.items || []);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
        setUser(null);
      }
    }
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    setUser(null);
    navigate('/login');
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  // Search logic
  useEffect(() => {
    if (searchText.trim() !== '') {
      dispatch(fetchProducts(searchText));
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [searchText, dispatch]);

  const handleSearch = () => {
    if (searchText.trim() !== '') {
      navigate(`/search?query=${encodeURIComponent(searchText)}`);
      setSearchText('');
      setShowDropdown(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (shopRef.current && !shopRef.current.contains(e.target)) setShopDropdownOpen(false);
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) setMobileMenuOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
        setShopDropdownOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className="navbar">
      {/* Mobile menu toggle */}
      <button className="menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>☰</button>

      {/* Logo */}
      <div className="nav-logo">
        <img src={logo} alt="Logo" />
        <h1>StyleHub</h1>
      </div>

      {/* Navigation links */}
      <ul className={`nav-links ${mobileMenuOpen ? 'open' : ''}`} ref={mobileMenuRef}>
        <li><Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link></li>

        <li className={`dropdown ${shopDropdownOpen ? 'open' : ''}`} ref={shopRef}>
          <span className="dropdown-title" onClick={() => setShopDropdownOpen(!shopDropdownOpen)}>Shop</span>
          {shopDropdownOpen && (
            <ul className="dropdown-menu">
              <li><Link to="category/men" onClick={() => setMobileMenuOpen(false)}>Men</Link></li>
              <li><Link to="category/women" onClick={() => setMobileMenuOpen(false)}>Women</Link></li>
            </ul>
          )}
        </li>

        <li><Link to="/aboutus" onClick={() => setMobileMenuOpen(false)}>About Us</Link></li>
      </ul>

      {/* Search bar */}
      <div className="search-container">
        <AiOutlineSearch className="search-icon" onClick={handleSearch} />
        <input
          type="text"
          placeholder="Search..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        {showDropdown && (
          <div className="search-dropdown">
            {products.length > 0 ? products.map(p => (
              <Link key={p._id} to={`/product/${p._id}`} className="search-item">
                {p.image && <img src={p.image} alt={p.name} />}
                <span>{p.name}</span>
              </Link>
            )) : <div className="search-item">No products found</div>}
          </div>
        )}
      </div>

      {/* Icons */}
      <div className="nav-icons">
        <Link to="/cart" className="cart-link">
          <FaShoppingCart />
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </Link>

        {/* Notifications */}
        {user?._id && <Notifications userId={user._id} />}

        {/* User dropdown */}
        <div className="user-wrapper" ref={userRef}>
          <FaUserCircle onClick={() => setUserDropdownOpen(!userDropdownOpen)} />
          {userDropdownOpen && (
            <div className="dropdown-content">
              {user ? (
                <>
                  <p className="dropdown-email">{user.email}</p>
                  <Link to="/myProfile" className="dropdown-item"><FaUserCircle /> My Profile</Link>
                  <Link to="/myOrders" className="dropdown-item"><FaTruck /> My Orders</Link>
                  <Link to="/cart" className="dropdown-item"><FaShoppingCart /> My Cart</Link>
                  <button className="dropdown-item logout-btn" onClick={handleLogout}><FaSignOutAlt /> Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="dropdown-item">Login</Link>
                  <Link to="/register" className="dropdown-item">Register</Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Deliver & currency */}
      <div className="deliver-currency-wrapper">
        <div className="deliver-to">
          <span className="label">Deliver To</span>
          <div className="flag-with-code">
            <div className="flag-circle">
              <img src="https://upload.wikimedia.org/wikipedia/commons/3/32/Flag_of_Pakistan.svg" alt="Pakistan Flag" />
            </div>
            <span className="code">PK</span>
          </div>
        </div>
        <div className="divider"></div>
        <div className="currency">
          <span className="label">Currency</span>
          <span className="code">PKR</span>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
