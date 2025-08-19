import React from 'react';
import './admin.css';
import { Navigate, Outlet, Link } from 'react-router-dom';

function isAdmin() {
  try {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload?.role === 'admin';
  } catch {
    return false;
  }
}

export default function AdminLayout() {
  if (!isAdmin()) return <Navigate to="/login" replace />;

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <Link to="/admin">Dashboard</Link>
        <Link to="/admin/users">Users</Link>
        <Link to="/admin/products">Products</Link>
        <Link to="/admin/orders">Orders</Link>
        <button onClick={() => { localStorage.removeItem('accessToken'); window.location.replace('/admin/login'); }}>Logout</button>
      </aside>
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}


