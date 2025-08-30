 import React, { useEffect, useState } from "react";
import "./MyOrders.css";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  // Load orders from localStorage
  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("myOrders")) || [];
    setOrders(savedOrders);
  }, []);

  // Cancel order function
  const cancelOrder = (id) => {
    const updatedOrders = orders.map((order) => {
      if (order._id === id && order.status === "Pending") {
        return { ...order, status: "Cancelled" };
      }
      return order;
    });

    setOrders(updatedOrders);
    localStorage.setItem("myOrders", JSON.stringify(updatedOrders));
  };

  if (orders.length === 0) {
    return <h2 className="empty">❌ No orders found</h2>;
  }

  return (
    <div className="orders-container">
      <h2>📦 My Orders</h2>
      <table className="orders-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Total</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={index}>
              <td>{order._id}</td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>Rs {order.totalAmount}</td>
              <td className={`status ${order.status.toLowerCase()}`}>{order.status}</td>
              <td>
                {order.status === "Pending" ? (
                  <button
                    className="cancel-btn"
                    onClick={() => cancelOrder(order._id)}
                  >
                    ❌ Cancel
                  </button>
                ) : (
                  "-"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyOrders;
