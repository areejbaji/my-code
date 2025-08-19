import React, { useEffect, useState } from 'react';
import { FaDollarSign, FaUsers, FaShoppingCart } from 'react-icons/fa';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import './admin.css';  // aapki existing CSS

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    revenue: 0,
    users: 0,
    cartItems: 0,
  });

  const [ordersStatus, setOrdersStatus] = useState({
    pending: 0,
    paid: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
  });

  const [salesByMonth, setSalesByMonth] = useState([]);

  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);

        // Example: fetch stats from backend
        const resStats = await fetch('http://localhost:3000/admin/stats', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataStats = await resStats.json();
        if (!resStats.ok) throw new Error(dataStats.message || 'Failed to fetch stats');

        setStats({
          revenue: dataStats.totalRevenue,
          users: dataStats.totalUsers,
          cartItems: dataStats.totalCartItems,
        });

        // Fetch orders
        const resOrders = await fetch('http://localhost:3000/admin/orders', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const dataOrders = await resOrders.json();
        if (!resOrders.ok) throw new Error(dataOrders.message || 'Failed to fetch orders');

        const statusCount = { pending: 0, paid: 0, shipped: 0, delivered: 0, cancelled: 0 };
        dataOrders.orders.forEach(order => {
          const statusKey = order.status.toLowerCase();
          if (statusCount[statusKey] !== undefined) statusCount[statusKey]++;
        });
        setOrdersStatus(statusCount);

        // Static monthly sales data (replace with real API if available)
        setSalesByMonth([
          { month: 'Jan', sales: 12000 },
          { month: 'Feb', sales: 15000 },
          { month: 'Mar', sales: 10000 },
          { month: 'Apr', sales: 18000 },
          { month: 'May', sales: 20000 },
          { month: 'Jun', sales: 17000 },
        ]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, [token]);

  if (loading) return <p>Loading dashboard...</p>;

  // Pie chart data (Orders Status)
  const pieData = {
    labels: ['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled'],
    datasets: [{
      data: [
        ordersStatus.pending,
        ordersStatus.paid,
        ordersStatus.shipped,
        ordersStatus.delivered,
        ordersStatus.cancelled,
      ],
      backgroundColor: ['#fbbf24', '#10b981', '#3b82f6', '#6366f1', '#ef4444'],
      hoverOffset: 10,
    }],
  };

  // Bar chart data (Monthly Sales)
  const barData = {
    labels: salesByMonth.map(item => item.month),
    datasets: [{
      label: 'Monthly Sales (Rs)',
      data: salesByMonth.map(item => item.sales),
      backgroundColor: '#2563eb',
    }],
  };

  return (
    <div className="admin-dashboard" style={{ padding: 30 }}>
      <h2>Admin Dashboard</h2>

      <div className="stats-cards" style={{ marginBottom: 40 }}>
        <div className="stats-card revenue">
          <div>
            <div className="number">Rs {stats.revenue.toLocaleString()}</div>
            <div className="label">Total Revenue</div>
          </div>
          <FaDollarSign className="icon" />
        </div>

        <div className="stats-card users">
          <div>
            <div className="number">{stats.users}</div>
            <div className="label">Total Users</div>
          </div>
          <FaUsers className="icon" />
        </div>

        <div className="stats-card cart">
          <div>
            <div className="number">{stats.cartItems}</div>
            <div className="label">Total Cart Items</div>
          </div>
          <FaShoppingCart className="icon" />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 300px', background: 'white', borderRadius: 12, padding: 20, boxShadow: '0 3px 8px rgba(0,0,0,0.1)' }}>
          <h3>Order Status Distribution</h3>
          <Pie data={pieData} />
        </div>

        <div style={{ flex: '1 1 500px', background: 'white', borderRadius: 12, padding: 20, boxShadow: '0 3px 8px rgba(0,0,0,0.1)' }}>
          <h3>Monthly Sales</h3>
          <Bar data={barData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        </div>
      </div>
    </div>
  );
}
