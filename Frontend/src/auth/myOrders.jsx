// import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import apis from '../utils/apis';
// import toast from 'react-hot-toast';
// import './MyOrders.css'; // optional for custom styling

// const MyOrders = () => {
//   const [orders, setOrders] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchOrders = async () => {
//       try {
//         const token = localStorage.getItem('token'); // assuming user token is saved
//         if (!token) {
//           navigate('/login');
//           return;
//         }

//         const response = await fetch(apis().getUserOrders, {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         });

//         const result = await response.json();
//         if (!response.ok) throw new Error(result.message || 'Failed to fetch orders');

//         setOrders(result.orders || []);
//       } catch (error) {
//         toast.error(error.message);
//       }
//     };

//     fetchOrders();
//   }, [navigate]);

//   const getStatusColor = (status) => {
//     switch(status) {
//       case 'Pending': return '#ffc107';
//       case 'Processing': return '#90e0ef';
//       case 'Return': return '#17a2b8';
//       case 'Delivered': return '#28a745';
//       case 'Cancel': return '#dc3545';
//       default: return '#6c757d';
//     }
//   };

//   return (
//     <div className="orders_page">
//       <h1>My Orders</h1>
//       {orders.length === 0 ? (
//         <p>No orders found.</p>
//       ) : (
//         <table>
//           <thead>
//             <tr>
//               <th>Sr#</th>
//               <th>Order No</th>
//               <th>Date</th>
//               <th>Status</th>
//               <th>Total Price</th>
//               <th>Rating</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {orders.map((order, index) => (
//               <tr key={order._id}>
//                 <td>{index + 1}</td>
//                 <td>{order.order_no}</td>
//                 <td>{new Date(order.order_date).toLocaleDateString()}</td>
//                 <td>
//                   <span 
//                     style={{ backgroundColor: getStatusColor(order.order_status), color: 'white', padding: '0.3rem 0.5rem', borderRadius: '0.5rem' }}>
//                     {order.order_status}
//                   </span>
//                 </td>
//                 <td>{order.totalPrice}</td>
//                 <td>{order.rating || '-'}</td>
//                 <td>
//                   <button onClick={() => navigate(`/order/${order._id}`)}>
//                     Details
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}

//       <section className="orders_banner">
//         <h4>Repair Services</h4>
//         <h2>Up to <span>50% Off</span> - All types of Products</h2>
//         <button>Explore More</button>
//       </section>
//     </div>
//   );
// };

// export default MyOrders;
import React, { useEffect, useState } from 'react';
import apis from '../utils/apis';
import toast from 'react-hot-toast';
import './MyOrders.css'; // We'll add CSS separately

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token'); // If using JWT auth
        const response = await fetch(apis().myOrders, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        });
        const result = await response.json();

        if (!response.ok) throw new Error(result.message || 'Failed to fetch orders');

        setOrders(result.orders || []);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error(error.message);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <p>Loading orders...</p>;

  return (
    <div className="myOrders_main">
      <section id="product1">
        <h1>My Orders</h1>
      </section>

      <div className="myOrders_container">
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Sr#</th>
                <th>Order NO</th>
                <th>Order Date</th>
                <th>Status</th>
                <th>Total Price</th>
                <th>Rating</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={order._id}>
                  <td>{index + 1}</td>
                  <td>{order.order_no}</td>
                  <td>{new Date(order.order_date).toLocaleDateString()}</td>
                  <td>
                    <span className={`status ${order.order_status.toLowerCase()}`}>
                      {order.order_status}
                    </span>
                  </td>
                  <td>{order.order_totalCost}</td>
                  <td>{order.rating || '-'}</td>
                  <td>
                    <button>
                      <a href={`/order/${order._id}`}>Details</a>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MyOrders;

