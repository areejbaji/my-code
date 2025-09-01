// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "./Profile.css";

// const ProfilePage = () => {
//   const storedUser = JSON.parse(localStorage.getItem("user")) || {};
//   const token = localStorage.getItem("accessToken");

//   const [formData, setFormData] = useState({
//     name: storedUser.name || "",
//     email: storedUser.email || "",
//     address: storedUser.address || "",
//     city: storedUser.city || "",
//     postalCode: storedUser.postalCode || "",
//     phone: storedUser.phone || "",
//     note: storedUser.note || "",
//     country: storedUser.country || "Pakistan",
//     avatar: storedUser.avatar || ""
//   });

//   useEffect(() => {
//     if (storedUser) {
//       setFormData((prev) => ({ ...prev, ...storedUser }));
//     }
//   }, []);

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleUpdate = async () => {
//     try {
//       const res = await axios.put(
//         "http://localhost:4000/api/users/profile",
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       alert("✅ Profile updated successfully!");
//       localStorage.setItem("user", JSON.stringify(res.data.user));
//     } catch (err) {
//       console.error("❌ Profile update error:", err.response?.data || err.message);
//       alert("Failed to update profile.");
//     }
//   };

//   return (
//     <div className="profile-container">
//       <h2>My Profile</h2>

//       {/* Avatar */}
//       <div className="avatar-section">
//         <img
//           src={formData.avatar || "https://via.placeholder.com/100"}
//           alt="User Avatar"
//           className="avatar-img"
//         />
//         <input
//           type="text"
//           name="avatar"
//           placeholder="Avatar URL"
//           value={formData.avatar}
//           onChange={handleChange}
//         />
//       </div>

//       <input
//         type="text"
//         name="name"
//         placeholder="Full Name"
//         value={formData.name}
//         onChange={handleChange}
//       />

//       <input
//         type="email"
//         name="email"
//         placeholder="Email"
//         value={formData.email}
//         readOnly
//       />

//       <input
//         type="text"
//         name="address"
//         placeholder="Address"
//         value={formData.address}
//         onChange={handleChange}
//       />

//       <div className="row">
//         <input
//           type="text"
//           name="city"
//           placeholder="City"
//           value={formData.city}
//           onChange={handleChange}
//         />
//         <input
//           type="text"
//           name="country"
//           placeholder="Country"
//           value={formData.country}
//           readOnly
//         />
//       </div>

//       <div className="row">
//         <input
//           type="text"
//           name="postalCode"
//           placeholder="Postal Code"
//           value={formData.postalCode}
//           onChange={handleChange}
//         />
//         <input
//           type="text"
//           name="phone"
//           placeholder="Phone"
//           value={formData.phone}
//           onChange={handleChange}
//         />
//       </div>

//       <textarea
//         name="note"
//         placeholder="Additional Note (Optional)"
//         value={formData.note}
//         onChange={handleChange}
//       ></textarea>

//       <button className="update-profile-btn" onClick={handleUpdate}>
//         Update Profile
//       </button>
//     </div>
//   );
// };

// export default ProfilePage;
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css";

const ProfilePage = () => {
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
  const token = localStorage.getItem("accessToken");

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

  useEffect(() => {
    if (storedUser) {
      setFormData((prev) => ({ ...prev, ...storedUser }));
    }
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // 📌 avatar upload handler
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result });
      };
      reader.readAsDataURL(file); // convert image to base64
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        "http://localhost:4000/api/users/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("✅ Profile updated successfully!");
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (err) {
      console.error("❌ Profile update error:", err.response?.data || err.message);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="profile-container">
      <h2>My Profile</h2>

      {/* Avatar Section */}
      <div className="avatar-section">
        {formData.avatar ? (
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

      <input
        type="text"
        name="name"
        placeholder="Full Name"
        value={formData.name}
        onChange={handleChange}
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

      <button className="update-profile-btn" onClick={handleUpdate}>
        Update Profile
      </button>
    </div>
  );
};

export default ProfilePage;
