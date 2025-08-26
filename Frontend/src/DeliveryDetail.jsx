import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DeliveryDetails.css";

const DeliveryDetails = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!address || !contact) {
      alert("Please fill in all fields.");
      return;
    }
    alert("Order placed successfully!");
    navigate("/"); // home ya kisi aur page pe redirect karna ho to change karo
  };

  return (
    <div className="delivery-container">
      <h2>Enter Delivery Details</h2>
      <form onSubmit={handleSubmit} className="delivery-form">
        
        <label>Delivery Address:</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your delivery address"
        />

        <label>Contact Number:</label>
        <input
          type="number"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="Enter your contact number"
        />

        <div className="form-buttons">
          <button type="submit" className="submit-btn">Submit</button>
          <button
            type="button"
            className="close-btn"
            onClick={() => navigate(-1)}
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

export default DeliveryDetails;
