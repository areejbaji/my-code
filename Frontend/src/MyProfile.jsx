import React, { useState, useEffect } from "react";
import "./MyProfile.css";

const MyProfile = () => {
  const [user, setUser] = useState({
    name: "",
    email: "",
    address: "",
    contact: "",
    avatar: null,
  });

  // 🔹 Login data localStorage se load karo
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser({
        name: storedUser.name || "",
        email: storedUser.email || "",
        address: storedUser.address || "",
        contact: storedUser.contact || "",
        avatar: storedUser.avatar || null,
      });
    }
  }, []);

  // 🔹 Handle form input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Handle file upload
  const handleFile = (e) => {
    setUser((prev) => ({ ...prev, avatar: e.target.files[0] }));
  };

  // 🔹 Update button click
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Updated User:", user);

    // Yahan aap API call karogi backend ko
    // axios.put("/api/update-profile", user)
    //  .then(res => console.log(res.data));
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-form">
        <h2>My Profile</h2>
        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input type="text" name="name" value={user.name} onChange={handleChange} />

          <label>Email</label>
          <input type="email" name="email" value={user.email} onChange={handleChange} />

          <label>Address</label>
          <input type="text" name="address" value={user.address} onChange={handleChange} />

          <label>Contact</label>
          <input type="text" name="contact" value={user.contact} onChange={handleChange} />

          <label>Choose Avatar</label>
          <input type="file" onChange={handleFile} />

          <button type="submit" className="update-btn">Update</button>
        </form>
      </div>
    </div>
  );
};

export default MyProfile;
