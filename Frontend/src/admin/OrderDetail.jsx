// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams } from "react-router-dom";
// import "./OrderDetailPage.css";

// const OrderDetailPage = () => {
//   const { orderId } = useParams();
//   const [order, setOrder] = useState(null);
//   const [status, setStatus] = useState("");

//   useEffect(() => {
//     const fetchOrder = async () => {
//       try {
//         const token = localStorage.getItem("accessToken");
//         const res = await axios.get(`http://localhost:4000/api/orders/admin/${orderId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         if (res.data.status) {
//           setOrder(res.data.order);
//           setStatus(res.data.order.status);
//         }
//       } catch (err) {
//         console.error("Error fetching order:", err);
//       }
//     };
//     fetchOrder();
//   }, [orderId]);

//   const handleUpdateStatus = async () => {
//     try {
//       const token = localStorage.getItem("accessToken");
//       const res = await axios.put(
//         `http://localhost:4000/api/orders/admin/update/${order.orderId}`,
//         { status },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       if (res.data.status) {
//         alert("Status updated!");
//         setOrder(res.data.order);
//       }
//     } catch (err) {
//       console.error("Error updating status:", err);
//       alert("Failed to update status");
//     }
//   };

//   if (!order) return <p>Loading order...</p>;

//   return (
//     <div className="order-detail-container">
//       <h1>Order Details</h1>
//       <div className="top-section">
//         {/* Left: Order Info */}
//         <div className="left-container">
//           <h2>Order Info</h2>
//           <p><strong>Order ID:</strong> {order.orderId}</p>
//           <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
//           <p><strong>Total:</strong> PKR {order.totalAmount}</p>
//           <p>
//             <strong>Status:</strong>
//             <select value={status} onChange={(e) => setStatus(e.target.value)}>
//               <option value="Pending">Pending</option>
//               <option value="Shipped">Shipped</option>
//               <option value="Delivered">Delivered</option>
//             </select>
//           </p>
//           <button onClick={handleUpdateStatus}>Update Status</button>
//         </div>

//         {/* Right: Customer Info */}
//         <div className="right-container">
//           <h2>Customer Info</h2>
//           <p><strong>Name:</strong> {order.shipping.name}</p>
//           <p><strong>Email:</strong> {order.shipping.email}</p>
//           <p><strong>Phone:</strong> {order.shipping.phone}</p>
//           <p><strong>City:</strong> {order.shipping.city}</p>
//           <p><strong>Address:</strong> {order.shipping.address}</p>
//         </div>
//       </div>

//       {/* Product Table */}
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
//                 <td><img src={item.image} alt={item.name} className="product-image" /></td>
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

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const res = await axios.get(
          `http://localhost:4000/api/orders/admin/${orderId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("Order detail:", res.data);
        if (res.data.status) {
          setOrder(res.data.order);
          setStatus(res.data.order.status);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching order:", err);
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleUpdateStatus = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.put(
        `http://localhost:4000/api/orders/admin/update/${order.orderId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.status) {
        alert(res.data.message);
        setOrder(res.data.order);
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status");
    }
  };

  if (loading) return <p>Loading order...</p>;
  if (!order) return <p>Order not found.</p>;

  return (
    <div className="order-detail-container">
      <h1>Order Details</h1>
      <div className="top-section">
        {/* Order Info */}
        <div className="left-container">
          <h2>Order Info</h2>
          <div className="detail-row">
            <span>Order No:</span> <span>{order.orderId}</span>
          </div>
          <div className="detail-row">
            <span>Order Date:</span>{" "}
            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="detail-row">
            <span>Total Amount:</span> <span>PKR {order.totalAmount}</span>
          </div>
          <div className="detail-row">
            <span>Status:</span>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="Pending">Pending</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
          <button className="update-btn" onClick={handleUpdateStatus}>
            Update Status
          </button>
        </div>

        {/* Customer Info */}
        <div className="right-container">
          <h2>Customer Info</h2>
          <div className="detail-row">
            <span>Name:</span> <span>{order.shipping.name}</span>
          </div>
          <div className="detail-row">
            <span>Email:</span> <span>{order.shipping.email}</span>
          </div>
          <div className="detail-row">
            <span>Phone:</span> <span>{order.shipping.phone}</span>
          </div>
          <div className="detail-row">
            <span>City:</span> <span>{order.shipping.city}</span>
          </div>
          <div className="detail-row">
            <span>Address:</span> <span>{order.shipping.address}</span>
          </div>
        </div>
      </div>

      {/* Products Table */}
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
              <th>Price</th>
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
                <td>{item.size}</td>
                <td>{item.measurements ? JSON.stringify(item.measurements) : "N/A"}</td>
                <td>PKR {item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderDetailPage;
