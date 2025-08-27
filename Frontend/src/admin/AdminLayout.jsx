// import React from "react";
// import { Link, Outlet, useNavigate } from "react-router-dom";
// import "./Admin.css";

// const AdminLayout = () => {
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     localStorage.removeItem("token"); // token ya session clear kardo
//     navigate("/login"); // login page pe redirect
//   };

//   return (
//     <div className="admin-container">
//       {/* Sidebar */}
//       <aside className="admin-sidebar">
//         <h2 className="admin-logo">Admin Panel</h2>
//         <ul className="admin-menu">
//           <li><Link to="/admin">Dashboard</Link></li>
//           <li><Link to="/admin/users">Users</Link></li>
//           <li><Link to="/admin/products">Products</Link></li>
//           <li><Link to="/admin/orders">Orders</Link></li>
//           <li><Link to="/admin/settings">Settings</Link></li>
//           <li><button className="logout-btn" onClick={handleLogout}>Logout</button></li>
//         </ul>
//       </aside>

//       {/* Main Content */}
//       <main className="admin-main">
//         <header className="admin-header">
//           <h1>Welcome, Admin</h1>
//         </header>
//         <div className="admin-content">
//           <Outlet /> {/* Nested routes yahan load honge */}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default AdminLayout;
import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { FiHome, FiPackage, FiUsers, FiSettings, FiChevronDown, FiLogOut } from "react-icons/fi";
import { MdCategory, MdOutlineAddBox, MdViewList } from "react-icons/md";
import "./Admin.css";

const AdminLayout = () => {
  const navigate = useNavigate();
  const [productDropdown, setProductDropdown] = useState(false);
  const [categoryDropdown, setCategoryDropdown] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="admin-sidebar">
      
        <div className="sidebar-logo">
          <img src="./assets/logo.png" alt="logo" className="logo-img" />
          <span>StyleHUB</span>
        </div>
       
        <ul className="sidebar-menu">
          <li>
            <Link to="/admin">
              <FiHome className="menu-icon" /> Dashboard
            </Link>
          </li>
          <li>
            <Link to="/admin/orders">
              <FiPackage className="menu-icon" /> View Orders
            </Link>
          </li>
          <li>
            <Link to="/admin/users">
              <FiUsers className="menu-icon" /> User List
            </Link>
          </li>
          <li>
            <div className="dropdown-toggle" onClick={() => setProductDropdown(!productDropdown)}>
              <FiPackage className="menu-icon" /> Manage Products <FiChevronDown className="chevron" />
            </div>
            {productDropdown && (
              <ul className="dropdown-submenu">
                <li><Link to="/admin/products">View All Products</Link></li>
                <li><Link to="/admin/products/new">Add New Product</Link></li>
              </ul>
            )}
          </li>
          <li>
            <div className="dropdown-toggle" onClick={() => setCategoryDropdown(!categoryDropdown)}>
              <MdCategory className="menu-icon" /> Manage Categories <FiChevronDown className="chevron" />
            </div>
            {categoryDropdown && (
              <ul className="dropdown-submenu">
                <li><Link to="/admin/categories">View All Categories</Link></li>
                <li><Link to="/admin/categories/new">Add New Category</Link></li>
              </ul>
            )}
          </li>
          <li>
            <Link to="/admin/settings">
              <FiSettings className="menu-icon" /> Settings
            </Link>
          </li>
        </ul>
      </aside>

      {/* Main content */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="header-left">Online StyleHUB Shop - Admin</div>
          <div className="header-right">
            <div className="profile-dropdown">
              <span onClick={() => setProfileDropdown(!profileDropdown)}>Hi, Admin <FiChevronDown /></span>
              {profileDropdown && (
                <ul className="profile-menu">
                  <li><Link to="/admin/profile"><MdViewList /> My Profile</Link></li>
                  <li><Link to="/admin/change-password"><MdOutlineAddBox /> Change Password</Link></li>
                  <li onClick={handleLogout}><FiLogOut /> Logout</li>
                </ul>
              )}
            </div>
          </div>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
