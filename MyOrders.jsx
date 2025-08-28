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
      {orders.map((order, index) => (
        <div key={index} className="order-card">
          <p><b>Order ID:</b> {order._id}</p>
          <p><b>Date:</b> {new Date(order.createdAt).toLocaleString()}</p>
          <p><b>Name:</b> {order.shipping.name}</p>
          <p><b>Phone:</b> {order.shipping.phone}</p>
          <p><b>Address:</b> {order.shipping.address}, {order.shipping.city}, {order.shipping.country}</p>

          <h4>Items:</h4>
          <ul>
            {order.items.map((item, idx) => (
              <li key={idx}>
                {item.name} ({item.size}) x {item.quantity} = Rs {item.price * item.quantity}
              </li>
            ))}
          </ul>

          <p><b>Total:</b> Rs {order.totalAmount}</p>
          <p><b>Payment:</b> {order.paymentMethod}</p>
          <p className={`status ${order.status.toLowerCase()}`}><b>Status:</b> {order.status}</p>

          {/* Cancel button only for pending orders */}
          {order.status === "Pending" && (
            <button className="cancel-btn" onClick={() => cancelOrder(order._id)}>
              ❌ Cancel Order
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default MyOrders;
