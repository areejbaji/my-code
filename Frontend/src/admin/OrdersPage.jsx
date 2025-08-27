// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import "./OrdersPage.css";

// const OrdersPage = () => {
//   const [orders, setOrders] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const token = localStorage.getItem("accessToken");
//         const res = await axios.get("/api/orders/admin/all", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setOrders(res.data.orders || []);
//       } catch (err) {
//         console.error("Error fetching orders:", err);
//       }
//     };
//     fetchOrders();
//   }, []);

//   return (
//     <div className="orders-container">
//       <h1>Order Listing</h1>
//       <table className="orders-table">
//         <thead>
//           <tr>
//             <th>#</th>
//             <th>Order No / ID</th>
//             <th>Order Date</th>
//             <th>Customer Name</th>
//             <th>Total Amount</th>
//             <th>Status</th>
//             <th>Return Status</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {orders.map((order, index) => (
//             <tr key={order.orderId}>
//               <td>{index + 1}</td>
//               <td>{order.orderId}</td>
//               <td>{new Date(order.createdAt).toLocaleDateString()}</td>
//               <td>{order.shipping.name}</td>
//               <td>PKR {order.totalAmount}</td>
//               <td>{order.status}</td>
//               <td>N/A</td>
//               <td>
//                 <button
//                   className="detail-btn"
//                   onClick={() => navigate(`/admin/orders/${order.orderId}`)}
//                 >
//                   Detail
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default OrdersPage;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./OrdersPage.css";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get("http://localhost:4000/api/orders/admin/all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Fetched orders:", res.data);
        setOrders(res.data.orders || []);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setOrders([]);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;
  if (orders.length === 0) return <p>No orders found.</p>;

  return (
    <div className="orders-container">
      <h1>Order Listing</h1>
      <table className="orders-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Order No / ID</th>
            <th>Order Date</th>
            <th>Customer Name</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Return Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={order._id || index}>
              <td>{index + 1}</td>
              <td>{order.orderId}</td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersPage;
