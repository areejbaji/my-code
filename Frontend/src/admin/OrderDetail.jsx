// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";
// import "./OrderDetailPage.css";

// const OrderDetailPage = () => {
//   const { orderId } = useParams();
//   const navigate = useNavigate();
//   const [order, setOrder] = useState(null);
//   const [status, setStatus] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchOrder = async () => {
//       try {
//         const token = localStorage.getItem("accessToken");
//         if (!token) throw new Error("Admin not logged in");

//         const res = await axios.get(
//           `http://localhost:4000/api/admin/orders/${orderId}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );

//         if (!res.data.status) throw new Error(res.data.message || "Order not found");

//         setOrder(res.data.order);
//         setStatus(res.data.order.status);
//       } catch (err) {
//         console.error("Error fetching order:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchOrder();
//   }, [orderId]);

//   const handleUpdateStatus = async () => {
//     try {
//       const token = localStorage.getItem("accessToken");
//       if (!token) throw new Error("Admin not logged in");

//       const res = await axios.put(
//         `http://localhost:4000/api/admin/orders/${order.orderId}/status`,
//         { status },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (!res.data.status) throw new Error(res.data.message || "Failed to update");

//       alert(res.data.message);
//       setOrder(res.data.order);
//     } catch (err) {
//       console.error("Error updating status:", err);
//       alert("Error: " + err.message);
//     }
//   };

//   if (loading) return <p>Loading order...</p>;
//   if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
//   if (!order) return <p>Order not found.</p>;

//   return (
//     <div className="order-detail-container">
//       <h1>Order Details</h1>

//       {/* Order Info */}
//       <div className="top-section">
//         <div className="left-container">
//           <h2>Order Info</h2>
//           <div className="detail-row">
//             <span>Order ID:</span> <span>{order.orderId}</span>
//           </div>
//           <div className="detail-row">
//             <span>Date:</span>{" "}
//             <span>{new Date(order.createdAt).toLocaleString()}</span>
//           </div>
//           <div className="detail-row">
//             <span>Total Amount:</span> <span>PKR {order.totalAmount}</span>
//           </div>
//           <div className="detail-row">
//             <span>Status:</span>
//             <select value={status} onChange={(e) => setStatus(e.target.value)}>
//               <option value="Pending">Pending</option>
//               <option value="Shipped">Shipped</option>
//               <option value="Delivered">Delivered</option>
//             </select>
//           </div>
//           <button className="update-btn" onClick={handleUpdateStatus}>
//             Update Status
//           </button>
//         </div>

//         {/* Customer Info */}
//         <div className="right-container">
//           <h2>Customer Info</h2>
//           <div className="detail-row">
//             <span>Name:</span> <span>{order.shipping.name}</span>
//           </div>
//           <div className="detail-row">
//             <span>Email:</span> <span>{order.shipping.email}</span>
//           </div>
//           <div className="detail-row">
//             <span>Phone:</span> <span>{order.shipping.phone}</span>
//           </div>
//           <div className="detail-row">
//             <span>City:</span> <span>{order.shipping.city}</span>
//           </div>
//           <div className="detail-row">
//             <span>Address:</span> <span>{order.shipping.address}</span>
//           </div>
//         </div>
//       </div>

//       {/* Products Table */}
//       <div className="product-table-container">
//         <h2>Products</h2>
//         <table className="product-table">
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Image</th>
//               <th>Quantity</th>
//               <th>Size</th>
//               <th>Measurements</th>
//               <th>Price</th>
//             </tr>
//           </thead>
//           <tbody>
//             {order.items.map((item, idx) => (
//               <tr key={idx}>
//                 <td>{item.name}</td>
//                 <td>
//                   <img src={item.image} alt={item.name} className="product-image" />
//                 </td>
//                 <td>{item.quantity}</td>
//                 <td>{item.size}</td>
//                 <td>{item.measurements ? JSON.stringify(item.measurements) : "N/A"}</td>
//                 <td>PKR {item.price}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default OrderDetailPage;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./OrderDetailPage.css";

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) throw new Error("Admin not logged in");

        const res = await axios.get(
          `http://localhost:4000/api/admin/orders/${orderId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (!res.data.status) throw new Error(res.data.message || "Order not found");

        setOrder(res.data.order);
        setStatus(res.data.order.status);
      } catch (err) {
        console.error("Error fetching order:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  const handleUpdateStatus = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("Admin not logged in");

      const res = await axios.put(
        `http://localhost:4000/api/admin/orders/${order.orderId}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.data.status) throw new Error(res.data.message || "Failed to update");

      alert(res.data.message);
      setOrder(res.data.order);
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Error: " + err.message);
    }
  };

  if (loading) return <p>Loading order...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!order) return <p>Order not found.</p>;

  return (
    <div className="order-detail-container">
      <h1 className="page-title">Order Details</h1>

      {/* 🔹 Top Info Section (2 columns) */}
      <div className="top-section">
        {/* Order Info */}
        <div className="info-card">
          <h2>Order Info</h2>
          <div className="detail-row"><span>Order ID:</span><span>{order.orderId}</span></div>
          <div className="detail-row"><span>Date:</span><span>{new Date(order.createdAt).toLocaleString()}</span></div>
          <div className="detail-row"><span>Total Amount:</span><span>PKR {order.totalAmount}</span></div>
          <div className="detail-row">
            <span>Status:</span>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Pending">Pending</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
          <button className="update-btn" onClick={handleUpdateStatus}>Update Status</button>
        </div>

        {/* Customer Info */}
        <div className="info-card">
          <h2>Customer Info</h2>
          <div className="detail-row"><span>Name:</span><span>{order.shipping.name}</span></div>
          <div className="detail-row"><span>Email:</span><span>{order.shipping.email}</span></div>
          <div className="detail-row"><span>Phone:</span><span>{order.shipping.phone}</span></div>
          <div className="detail-row"><span>City:</span><span>{order.shipping.city}</span></div>
          <div className="detail-row"><span>Address:</span><span>{order.shipping.address}</span></div>
        </div>
      </div>

      {/* 🔹 Products Table */}
      <div className="product-table-container">
        <h2>Products</h2>
        <table className="product-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Image</th>
              <th>Quantity</th>
              <th>Size</th>
              <th>Measurements</th>
               <th>Unit Price</th>
                <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, idx) => (
              <tr key={idx}>
                <td>{item.name}</td>
                <td>
                  <img src={item.image} alt={item.name} className="product-image" />
                </td>
                <td>{item.quantity}</td>
                <td>{item.size || "N/A"}</td>
                <td>
                  {item.measurements ? (
                    <div className="measurements-box">
                      {Object.entries(item.measurements).map(([key, value], i) => (
                        <div key={i} className="measurement-row">
                          <span className="m-key">{key}</span>
                          <span className="m-value">{value}</span>
                        </div>
                      ))}
                    </div>
                  ) : "N/A"}
                </td>
                  <td>PKR {item.price}</td>
        <td>PKR {item.price * item.quantity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderDetailPage;
