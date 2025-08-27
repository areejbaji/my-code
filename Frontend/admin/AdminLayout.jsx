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
import { AiFillDashboard, AiOutlineUser, AiOutlineShoppingCart } from "react-icons/ai";
import { MdCategory, MdOutlineKeyboardArrowDown, MdLogout, MdPerson } from "react-icons/md";
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
          <img src="/assets/logo.png" alt="StyleHUB" />
          <span>StyleHUB</span>
        </div>

        <ul className="sidebar-menu">
          <li>
            <AiFillDashboard className="menu-icon" />
            <Link to="/admin">Dashboard</Link>
          </li>

          <li>
            <div className="dropdown-header" onClick={() => setProductDropdown(!productDropdown)}>
              <AiOutlineShoppingCart className="menu-icon" />
              Manage Products <MdOutlineKeyboardArrowDown className="arrow-icon" />
            </div>
            {productDropdown && (
              <ul className="dropdown-menu">
                <li><Link to="/admin/products">View All Products</Link></li>
                <li><Link to="/admin/products/new">Add New Product</Link></li>
              </ul>
            )}
          </li>

          <li>
            <div className="dropdown-header" onClick={() => setCategoryDropdown(!categoryDropdown)}>
              <MdCategory className="menu-icon" />
              Manage Categories <MdOutlineKeyboardArrowDown className="arrow-icon" />
            </div>
            {categoryDropdown && (
              <ul className="dropdown-menu">
                <li><Link to="/admin/categories">View All Categories</Link></li>
                <li><Link to="/admin/categories/new">Add New Category</Link></li>
              </ul>
            )}
          </li>

          <li>
            <AiOutlineShoppingCart className="menu-icon" />
            <Link to="/admin/orders">View Orders</Link>
          </li>

          <li>
            <AiOutlineUser className="menu-icon" />
            <Link to="/admin/users">User List</Link>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header">
          <h1>Online StyleHUB Shop - Admin</h1>
          <div className="profile-section" onClick={() => setProfileDropdown(!profileDropdown)}>
            <MdPerson className="profile-icon" />
            <span>Hi, Admin</span>
            <MdOutlineKeyboardArrowDown className="arrow-icon" />
            {profileDropdown && (
              <ul className="profile-dropdown">
                <li><MdPerson className="icon" /> My Profile</li>
                <li><MdPerson className="icon" /> Change Password</li>
                <li onClick={handleLogout}><MdLogout className="icon" /> Logout</li>
              </ul>
            )}
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
