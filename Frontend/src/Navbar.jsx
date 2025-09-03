
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaShoppingCart, FaUser, FaLock, FaTruck, FaSignOutAlt, FaBell } from 'react-icons/fa';
import { AiOutlineSearch } from 'react-icons/ai';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from './redux/productsSlice';
import axios from 'axios';
import './Navbar.css';
import logo from './assets/logo.png';

const Notifications = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/notifications/${userId}`);
        setNotifications(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchNotifications();
  }, [userId]);

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:4000/api/notifications/read/${id}`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="notifications-wrapper">
      <FaBell className="bell-icon" onClick={() => setDropdownOpen(!dropdownOpen)} />
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

const Navbar = () => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const shopRef = useRef(null);

  const cartItems = useSelector((state) => state.cart.items || []);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const products = useSelector((state) => state.products?.items || []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && storedUser !== "undefined") {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("user");
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    setUser(null);
    navigate('/login');
  };

  
  useEffect(() => {
    if (searchText.trim() !== '') {
      dispatch(fetchProducts(searchText));
      setShowDropdown(true);
    } else setShowDropdown(false);
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


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (shopRef.current && !shopRef.current.contains(e.target)) {
        setShopDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <img src={logo} alt="Logo" />
        <h1>StyleHub</h1>
      </div>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>

        <li className="dropdown" ref={shopRef}>
          <span className="dropdown-title" onClick={() => setShopDropdownOpen(!shopDropdownOpen)}>
            Shop
          </span>
          {shopDropdownOpen && (
            <ul className="dropdown-menu">
              <li><Link to="category/men" onClick={() => setShopDropdownOpen(false)}>Men</Link></li>
              <li><Link to="category/women" onClick={() => setShopDropdownOpen(false)}>Women</Link></li>
            </ul>
          )}
        </li>

        <li><Link to="/aboutus">About Us</Link></li>
      </ul>

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

      <div className="nav-icons">
       
        <Link to="/cart" className="cart-link">
          <FaShoppingCart />
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </Link>

        {user?._id && <Notifications userId={user._id} />}

   
        <div className="user-wrapper">
          <FaUserCircle onClick={() => setUserDropdownOpen(!userDropdownOpen)} />
          {userDropdownOpen && (
            <div className="dropdown-content">
              {user ? (
                <>
                  <p className="dropdown-email">{user.email}</p>
                  <Link to="/myProfile" className="dropdown-item"><FaUser /> My Profile</Link>
                  <Link to="/myOrders" className="dropdown-item"><FaTruck /> My Orders</Link>
                  <Link to="/cart" className="dropdown-item"><FaShoppingCart /> My Cart</Link>
                  <button className="dropdown-item logout-btn" onClick={handleLogout}>
                    <FaSignOutAlt /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="dropdown-item"><FaUser /> Login</Link>
                  <Link to="/register" className="dropdown-item"><FaLock /> Register</Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>

    
      <div className="deliver-currency-wrapper">
        <div className="deliver-to">
          <span className="label">Deliver To</span>
          <div className="flag-with-code">
            <div className="flag-circle">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/3/32/Flag_of_Pakistan.svg"
                alt="Pakistan Flag"
              />
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

