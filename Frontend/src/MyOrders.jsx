
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyOrders.css";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id;

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:4000/api/orders/my-orders/${userId}`
        );
        setOrders(res.data);
      } catch (err) {
        console.error("Error fetching orders:", err.response?.data || err.message);
        alert("Failed to load your orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      const res = await axios.put(`http://localhost:4000/api/orders/cancel/${orderId}`);
      alert(res.data.message);

      setOrders((prev) =>
        prev.map((order) =>
          order.orderId === orderId ? { ...order, status: "Cancelled" } : order
        )
      );
    } catch (err) {
      console.error("Cancel order error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Failed to cancel order");
    }
  };

  if (loading) return <p>Loading your orders...</p>;

  if (orders.length === 0) return <p>You have no orders yet.</p>;

  return (
    <div className="my-orders-page">
      <h2>My Orders</h2>
      <div className="orders-list">
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <h3>Order ID: {order.orderId}</h3>
            <p>
              Status:{" "}
              <strong
                className={
                  order.status === "Pending"
                    ? "status-pending"
                    : order.status === "Cancelled"
                    ? "status-cancelled"
                    : order.status === "Delivered"
                    ? "status-delivered"
                    : order.status === "Shipped"
                    ? "status-shipped"
                    : ""
                }
              >
                {order.status}
              </strong>
            </p>
            <p>
              Return Status:{" "}
              <strong
                className={
                  order.returnStatus === "Not Returned"
                    ? "status-not-returned"
                    : order.returnStatus === "Requested"
                    ? "status-return-requested"
                    : order.returnStatus === "Returned"
                    ? "status-returned"
                    : ""
                }
              >
                {order.returnStatus}
              </strong>
            </p>
            <p>Total: Rs {order.totalAmount}</p>
            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>

            <div className="order-products">
              <h4>Products:</h4>
              <ul>
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.name} × {item.quantity} (Rs {item.price})
                  </li>
                ))}
              </ul>
            </div>

            {order.status === "Pending" && (
              <button
                className="cancel-btn"
                onClick={() => handleCancelOrder(order.orderId)}
              >
                Cancel Order
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
