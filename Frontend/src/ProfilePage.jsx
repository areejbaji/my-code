

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const token = localStorage.getItem("token");

  

  const [formData, setFormData] = useState({
    name: storedUser.name || "",
    email: storedUser.email || "",
    address: storedUser.address || "",
    city: storedUser.city || "",
    postalCode: storedUser.postalCode || "",
    phone: storedUser.phone || "",
    note: storedUser.note || "",
    country: storedUser.country || "Pakistan",
    avatar: storedUser.avatar || ""
  });

  const [loading, setLoading] = useState(false);

  // Enhanced Profile Update Handler with detailed debugging
  const handleUpdate = async () => {
    console.log("🚀 Starting profile update...");
    console.log("Current token:", token);
    
    if (!token || token === "undefined" || token === "null") {
      toast.error("Please login first - no valid token found");
      console.error(" Invalid or missing token");
      return;
    }

    try {
      setLoading(true);
      
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("address", formData.address);
      data.append("city", formData.city);
      data.append("postalCode", formData.postalCode);
      data.append("phone", formData.phone);
      data.append("note", formData.note);
      data.append("country", formData.country);

      // Avatar file append only if it's a File instance
      if (formData.avatar instanceof File) {
        data.append("avatar", formData.avatar);
        console.log("📎 Avatar file attached");
      }

      //  Debug request details
      console.log(" Making request to:", "http://localhost:4000/user/profile");
      console.log(" Authorization header:", `Bearer ${token}`);
      
      // Log FormData contents
      console.log(" FormData contents:");
      for (let pair of data.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const res = await axios.put("http://localhost:4000/user/profile", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log(" Profile update successful:", res.data);
      toast.success("Profile updated successfully!");
      
      // Update localStorage with new user data
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setFormData(res.data.user);
      
    } catch (err) {
      console.error(" Profile update error:", err);
      
      // Detailed error logging
      if (err.response) {
        console.error("Response status:", err.response.status);
        console.error("Response headers:", err.response.headers);
        console.error("Response data:", err.response.data);
        
        if (err.response.status === 401) {
          toast.error("Session expired. Please login again.");
          // Optionally clear localStorage and redirect to login
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          // window.location.href = "/login"; // Uncomment if you want auto-redirect
        } else {
          toast.error(err.response?.data?.message || "Failed to update profile");
        }
      } else if (err.request) {
        console.error("Request error:", err.request);
        toast.error("Network error. Please check your connection.");
      } else {
        console.error("Error:", err.message);
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  // Test token validity function
  const testTokenValidity = async () => {
    if (!token) {
      console.error(" No token to test");
      return;
    }

    try {
      console.log(" Testing token validity...");
      const response = await axios.get("http://localhost:4000/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log(" Token is valid:", response.data);
      toast.success("Token is valid!");
    } catch (error) {
      console.error(" Token test failed:", error.response?.data);
      toast.error(`Token invalid: ${error.response?.data?.message || error.message}`);
    }
  };

  // Input change handler
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Avatar upload handler
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please upload an image file");
        return;
      }

      console.log("📷 Avatar file selected:", file.name, file.size, file.type);
      setFormData({ ...formData, avatar: file });
    }
  };

  // // Function to clear localStorage and reset
  // const clearStorageAndReset = () => {
  //   localStorage.removeItem("token");
  //   localStorage.removeItem("user");
  //   toast.success("Storage cleared. Please login again.");
  //   window.location.reload();
  // };

  return (
    <div className="profile-container">
      <h2>My Profile</h2>
      
   

      {/* Avatar Section */}
      <div className="avatar-section">
        {formData.avatar && !(formData.avatar instanceof File) ? (
          <img
            src={formData.avatar}
            alt="User Avatar"
            className="avatar-img"
          />
        ) : (
          <div className="default-avatar">
            {formData.name ? formData.name.charAt(0).toUpperCase() : "U"}
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={handleAvatarUpload}
        />
      </div>

      {/* Form Fields */}
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        readOnly
      />

      <input
        type="text"
        name="address"
        placeholder="Address"
        value={formData.address}
        onChange={handleChange}
      />

      <div className="row">
        <input
          type="text"
          name="city"
          placeholder="City"
          value={formData.city}
          onChange={handleChange}
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={formData.country}
          readOnly
        />
      </div>

      <div className="row">
        <input
          type="text"
          name="postalCode"
          placeholder="Postal Code"
          value={formData.postalCode}
          onChange={handleChange}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      <textarea
        name="note"
        placeholder="Additional Note (Optional)"
        value={formData.note}
        onChange={handleChange}
      ></textarea>

      <button 
        className="update-profile-btn" 
        onClick={handleUpdate}
        disabled={loading || !token}
      >
        {loading ? "Updating..." : "Update Profile"}
      </button>
    </div>
  );
};

export default ProfilePage;



