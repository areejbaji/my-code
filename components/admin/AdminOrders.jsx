 import React, { useEffect, useState } from 'react';
import apis from '../../utils/apis';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const token = localStorage.getItem('accessToken');

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch(apis().adminOrders, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to fetch orders');
      setOrders(data.orders || []);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(`${apis().adminOrders}/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed to update status');
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;

  return (
    <div className="admin-orders-container">
      <h2>Orders</h2>
      <ul className="orders-list">
        <li className="order-item order-header">
          <div>Order ID</div>
          <div>User</div>
          <div>Status</div>
          <div>Total</div>
          <div>Update Status</div>
        </li>
        {orders.map(o => (
          <li key={o._id} className="order-item">
            <div className="order-id">#{o._id.slice(-6)}</div>
            <div className="order-user">{o.user?.name || 'Unknown'}</div>
            <div className={`order-status status-${o.status}`}>{o.status}</div>
            <div className="order-total">Rs {o.total}</div>
            <div>
              <select
                className="order-select"
                value={o.status}
                onChange={e => updateStatus(o._id, e.target.value)}
              >
                {['pending', 'paid', 'shipped', 'delivered', 'cancelled'].map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
