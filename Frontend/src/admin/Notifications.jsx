import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Notifications.css"; // optional styling

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    axios.get("/api/admin/notifications")
      .then(res => {
        // backend should return an array of notifications
        setNotifications(res.data.notifications || []);
      })
      .catch(err => console.error(err));
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notifications-container" ref={dropdownRef}>
      <div className="bell-icon-wrapper" onClick={() => setOpen(!open)}>
        🔔
        {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
      </div>

      {open && (
        <div className="notifications-dropdown">
          {notifications.length === 0 ? (
            <p className="no-notifications">No notifications</p>
          ) : (
            <ul>
              {notifications.map((notif) => (
                <li key={notif._id}>
                  <p>{notif.message}</p>
                  <small>{new Date(notif.date).toLocaleString()}</small>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;
