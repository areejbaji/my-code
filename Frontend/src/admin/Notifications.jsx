// import React, { useState, useEffect, useRef } from "react";
// import axios from "axios";
// import "./Notifications.css";

// const Notifications = ({ isAdmin = false }) => {
//   const [notifications, setNotifications] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const dropdownRef = useRef();

//   const fetchNotifications = async () => {
//     try {
//       setLoading(true);
//       const endpoint = isAdmin
//         ? "http://localhost:4000/api/notifications/admin"
//         : "http://localhost:4000/api/notifications/user/" + localStorage.getItem("userId");

//       const token = localStorage.getItem(isAdmin ? "adminToken" : "token");

//       console.log("Endpoint called:", endpoint);
//       console.log("Token sent:", token);

//       if (!token) {
//         console.error("No token found");
//         setNotifications([]);
//         return;
//       }

//       const res = await axios.get(endpoint, {
//         headers: { 
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//       });

//       console.log("Full response:", res.data);
//       console.log("Response status:", res.status);
//       console.log("Response success:", res.data.success);
//       console.log("Response notifications:", res.data.notifications);

//       if (res.data && res.data.success && Array.isArray(res.data.notifications)) {
//         setNotifications(res.data.notifications);
//         console.log("Notifications set successfully:", res.data.notifications.length);
//       } else {
//         console.error("Invalid response structure:", res.data);
//         setNotifications([]);
//       }
//     } catch (err) {
//       console.error("Failed to fetch notifications:", {
//         message: err.message,
//         response: err.response?.data,
//         status: err.response?.status
//       });
//       setNotifications([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchNotifications();
//     const interval = setInterval(fetchNotifications, 30000); // 30 seconds
//     return () => clearInterval(interval);
//   }, [isAdmin]);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const unreadCount = notifications.filter((n) => !n.read).length;

//   const handleMarkAsRead = async (notifId) => {
//     try {
//       const token = localStorage.getItem(isAdmin ? "adminToken" : "token");
//       await axios.put(`http://localhost:4000/api/notifications/${notifId}/read`, {}, {
//         headers: { Authorization: `Bearer ${token}` }
//       });
      
//       setNotifications((prev) =>
//         prev.map((n) => (n._id === notifId ? { ...n, read: true } : n))
//       );
//       console.log("Notification marked as read:", notifId);
//     } catch (err) {
//       console.error("Failed to mark notification as read:", err.response?.data || err.message);
//     }
//   };

//   const handleToggleDropdown = () => {
//     setOpen(!open);
//     if (!open && notifications.length === 0) {
//       fetchNotifications(); // Refresh when opening
//     }
//   };

//   return (
//     <div className="notifications-container" ref={dropdownRef}>
//       <div className="bell-icon-wrapper" onClick={handleToggleDropdown}>
//         <span className="bell-icon">🔔</span>
//         {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
//       </div>

//       {open && (
//         <div className="notifications-dropdown">
//           <div className="notifications-header">
//             <h4>Notifications</h4>
//             {loading && <span className="loading">Loading...</span>}
//           </div>
          
//           {notifications.length === 0 && !loading ? (
//             <div className="no-notifications">
//               <p>No notifications found</p>
//             </div>
//           ) : (
//             <ul className="notifications-list">
//               {notifications.map((notif) => (
//                 <li 
//                   key={notif._id} 
//                   className={`notification-item ${notif.read ? 'read' : 'unread'}`}
//                   onClick={() => !notif.read && handleMarkAsRead(notif._id)}
//                 >
//                   <div className="notification-content">
//                     <p className="notification-message">{notif.message}</p>
//                     <small className="notification-time">
//                       {new Date(notif.createdAt).toLocaleDateString()} {' '}
//                       {new Date(notif.createdAt).toLocaleTimeString()}
//                     </small>
//                     {notif.type && (
//                       <span className={`notification-type type-${notif.type}`}>
//                         {notif.type}
//                       </span>
//                     )}
//                   </div>
//                   {!notif.read && <div className="unread-dot"></div>}
//                 </li>
//               ))}
//             </ul>
//           )}
          
//           {notifications.length > 0 && (
//             <div className="notifications-footer">
//               <button 
//                 className="refresh-btn"
//                 onClick={fetchNotifications}
//                 disabled={loading}
//               >
//                 {loading ? 'Loading...' : 'Refresh'}
//               </button>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Notifications;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiBell } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import "./Notifications.css";

const Notifications = ({ isAdmin = false }) => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [isAdmin]);

  const fetchNotifications = async () => {
    try {
      if (isAdmin) {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get("http://localhost:4000/api/notifications/admin", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data.success) {
          setNotifications(res.data.notifications);
          setUnreadCount(res.data.notifications.filter(n => !n.read).length);
        }
      } else {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user?._id) return;

        const token = localStorage.getItem("token");
        const res = await axios.get(
          `http://localhost:4000/api/notifications/user/${user._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        if (res.data.success) {
          setNotifications(res.data.notifications);
          setUnreadCount(res.data.notifications.filter(n => !n.read).length);
        }
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:4000/api/notifications/${id}/read`);
      fetchNotifications();
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/notifications/${id}`);
      fetchNotifications();
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case "order": return "📦";
      case "return": return "🔄";
      case "stock": return "📊";
      default: return "🔔";
    }
  };

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <div className="notifications-container">
      <div 
        className="notification-bell" 
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <FiBell size={20} />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </div>

      {showDropdown && (
        <div className="notifications-dropdown">
          <div className="notifications-header">
            <h3>Notifications</h3>
            <button onClick={() => setShowDropdown(false)}>
              <MdClose size={20} />
            </button>
          </div>

          <div className="notifications-list">
            {notifications.length === 0 ? (
              <div className="no-notifications">
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif._id} 
                  className={`notification-item ${!notif.read ? 'unread' : ''}`}
                  onClick={() => !notif.read && markAsRead(notif._id)}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notif.type)}
                  </div>
                  
                  <div className="notification-content">
                    <p className="notification-message">{notif.message}</p>
                    <span className="notification-time">
                      {getTimeAgo(notif.createdAt)}
                    </span>
                  </div>

                  <button
                    className="delete-notification"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(notif._id);
                    }}
                  >
                    <MdClose size={16} />
                  </button>
                </div>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <div className="notifications-footer">
              <button onClick={fetchNotifications}>Refresh</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;