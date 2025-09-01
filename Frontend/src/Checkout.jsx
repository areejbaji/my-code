

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { clearCart } from "./redux/cartSlice";
import "./Checkout.css";

const CheckoutPage = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    note: "",
    country: "Pakistan",
    paymentMethod: "Cash on Delivery"
  });

  // ✅ Autofill if user is logged in
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData && userData !== "undefined") {
      const user = JSON.parse(userData);
      if (user) {
        setFormData((prev) => ({
          ...prev,
          name: user.name || "",
          email: user.email || "",
          address: user.address || "",
          city: user.city || "",
          postalCode: user.postalCode || "",
          phone: user.phone || ""
        }));
      }
    }
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const userData = localStorage.getItem("user");
  const user = userData && userData !== "undefined" ? JSON.parse(userData) : null;
  const userId = user?._id;

  const handlePlaceOrder = async () => {
    if (!formData.name || !formData.city || !formData.phone || !formData.address) {
      return alert("⚠️ Please fill all required fields!");
    }
    if (cartItems.length === 0) return alert("⚠️ Cart is empty!");
    for (let item of cartItems) {
      if (item.quantity > item.stock) {
        return alert(`⚠️ Only ${item.stock} items available for ${item.name} (${item.size})`);
      }
    }

    try {
      const order = {
        userId,
        items: cartItems.map((item) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          image: item.image,
          quantity: item.quantity,
          size: item.size,
          measurements: item.measurements
        })),
        shipping: formData,
        totalAmount,
        paymentMethod: formData.paymentMethod,
        country: formData.country
      };

      const res = await axios.post("http://localhost:4000/api/orders", order);
      console.log("✅ Order saved:", res.data);

      alert("🎉 Order placed successfully!");
      dispatch(clearCart());
      navigate("/receipt", { state: { order: res.data } });
    } catch (err) {
      console.error("❌ Order placement error:", err.response?.data || err.message);
      alert("Failed to place order. Try again.");
    }
  };

  return (
    <div className="checkout-container">
      {/* Left: Shipping Form */}
      <div className="checkout-form">
        <h2>Shipping Details</h2>
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
          onChange={handleChange}
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

        {/* Payment Method */}
        <div className="payment-section">
          <h3 className="payment-heading">Payment Method</h3>
          <div className="payment-circle">{formData.paymentMethod}</div>
        </div>

        <button className="place-order-btn" onClick={handlePlaceOrder}>
          Place Order
        </button>
      </div>

      {/* Right: Order Summary */}
      <div className="checkout-summary">
        <h2>Order Summary</h2>
        {cartItems.map((item, index) => (
          <div key={index} className="summary-item">
            <img src={item.image} alt={item.name} />
            <div>
              <p>{item.name}</p>
              <p>
                PKR {item.price} x {item.quantity}
              </p>
              <p>Size: {item.size}</p>

              {/* Measurements */}
              {item.measurements && (
                <div className="measurement-section">
                  <div>
                    <h5>Shirt</h5>
                    <div className="measurements-boxes">
                      {[
                        "Length",
                        "Shoulder",
                        "Armhole",
                        "Chest",
                        "Waist",
                        "Hip",
                        "Sleeve Length",
                        "Wrist",
                        "Bottom/Damman"
                      ]
                        .filter((f) => item.measurements[f])
                        .map((f) => (
                          <div key={f} className="measure-box">
                            {f}: {item.measurements[f]}
                          </div>
                        ))}
                    </div>
                  </div>
                  <div>
                    <h5>Trouser</h5>
                    <div className="measurements-boxes">
                      {["Length", "Waist", "Knee", "Thigh", "Hip", "Bottom"]
                        .filter((f) => item.measurements[f])
                        .map((f) => (
                          <div key={f} className="measure-box">
                            {f}: {item.measurements[f]}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <p>Rs {item.price * item.quantity}</p>
          </div>
        ))}

        <hr />
        <h3>Total: Rs {totalAmount}</h3>
      </div>
    </div>
  );
};

export default CheckoutPage;
