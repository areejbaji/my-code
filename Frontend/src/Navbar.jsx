
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaShoppingCart, FaUser, FaLock, FaTruck, FaSignOutAlt } from 'react-icons/fa';
import { AiOutlineSearch } from 'react-icons/ai';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from './redux/productsSlice';
import './Navbar.css';
import logo from './assets/logo.png';

const Navbar = () => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.items || []);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const products = useSelector((state) => state.products?.items || []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

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

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <img src={logo} alt="Logo" />
        <h1>StyleHub</h1>
      </div>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/women">Women</Link></li>
        <li><Link to="/men">Men</Link></li>
        <li><Link to="/aboutus">About Us</Link></li>
        <li><Link to="/register">Register</Link></li>
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
            )) : (
              <div className="search-item">No products found</div>
            )}
          </div>
        )}
      </div>

      <div className="nav-icons">
        <Link to="/cart" className="cart-link">
          <FaShoppingCart />
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </Link>

        <div className="user-wrapper">
          <FaUserCircle onClick={() => setUserDropdownOpen(!userDropdownOpen)} />
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
                <div className="deliver-currency-wrapper">
  {/* Left: Deliver To */}
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

  {/* Divider */}
  <div className="divider"></div>

  {/* Right: Currency */}
  <div className="currency">
    <span className="label">Currency</span>
    <span className="code">PKR</span>
  </div>
</div>

      </div>
    </nav>
  );
};

export default Navbar;



