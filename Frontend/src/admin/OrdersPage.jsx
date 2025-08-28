
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./OrdersPage.css";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) throw new Error("Admin not logged in");

        const res = await axios.get(
          "http://localhost:4000/api/admin/orders",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (!res.data.status) throw new Error(res.data.message || "Failed to fetch orders");

        setOrders(res.data.orders || []);
        setFilteredOrders(res.data.orders || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // 🔍 Filter orders based on search
  useEffect(() => {
    const results = orders.filter((order) =>
      order.orderId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shipping?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.returnStatus?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOrders(results);
  }, [searchTerm, orders]);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (orders.length === 0) return <p>No orders found.</p>;

  return (
    <div className="orders-container">
       <div className="orders-header">
      <h1 className="orders-title">Order Listing</h1>
      
      <input
        type="text"
        placeholder="Search by Order ID, Customer, Status..."
        className="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      </div>
      <table className="orders-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Order ID</th>
            <th>Order Date</th>
            <th>Customer Name</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Return Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order, index) => (
              <tr key={order._id || index}>
                <td>{index + 1}</td>
                <td>{order.orderId}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>{order.shipping?.name || "N/A"}</td>
                <td>PKR {order.totalAmount}</td>
                <td>{order.status}</td>
                <td>{order.returnStatus || "Not Returned"}</td>
                <td>
                  <button
                    className="detail-btn"
                    onClick={() => navigate(`/admin/orders/${order.orderId}`)}
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="no-orders">No matching orders found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersPage;
