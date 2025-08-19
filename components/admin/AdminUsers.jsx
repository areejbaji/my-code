
import React, { useEffect, useState } from 'react';
import "./admin.css"

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 🔹 Reusable API fetch function
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const res = await fetch('http://localhost:3000/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to load users');
      setUsers(data.users || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Email validation
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // Delete handler
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await fetch(`http://localhost:3000/admin/users/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('Failed to delete user');
        fetchUsers(); // ✅ delete ke baad fresh list
      } catch (err) {
        alert(err.message);
      }
    }
  };

  // 🔹 Example: Add User (Simulation)
  const handleAddUser = async () => {
    const newUser = {
      name: "Test User",
      email: `test${Date.now()}@mail.com`,
      role: "user"
    };
    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch('http://localhost:3000/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser)
      });
      if (!res.ok) throw new Error('Failed to add user');
      fetchUsers(); // ✅ add ke baad fresh list
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="admin-users-container">
      <h2>Users List</h2>

      {/* Add User button for testing */}
      <button onClick={handleAddUser} className="btn-add">Add Test User</button>

      <table className="users-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 && (
            <tr><td colSpan="4" style={{ textAlign: 'center' }}>No users found.</td></tr>
          )}
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td className={isValidEmail(user.email) ? '' : 'invalid-email'}>
                {user.email}
              </td>
              <td>{user.role}</td>
              <td>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(user._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
