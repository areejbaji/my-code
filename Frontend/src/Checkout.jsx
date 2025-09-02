
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { clearCart } from "./redux/cartSlice";
import "./Checkout.css";

// Toast notification component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = () => {
    if (type === "success") {
      return "✅";
    } else if (type === "error") {
      return "❌";
    }
    return "ℹ️";
  };

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-content">
        <span className="toast-icon">{getIcon()}</span>
        <span className="toast-message">{message}</span>
      </div>
    </div>
  );
};

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

  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);

  // Regex patterns for validation
  const patterns = {
    name: /^[a-zA-Z\s]{2,15}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^(\+92|0)?[0-9]{10,11}$/,
    postalCode: /^[0-9]{5}$/,
    city: /^[a-zA-Z\s]{2,15}$/,
    address: /^.{5,100}$/
  };

  // Show toast notification
  const showToast = (message, type = "error") => {
    setToast({ message, type });
  };

  // Validate individual field
  const validateField = (name, value) => {
    if (!value.trim() && ["name", "email", "address", "city", "phone"].includes(name)) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} is required`;
    }

    switch (name) {
      case "name":
        if (!patterns.name.test(value)) {
          return "Name must contain only letters and spaces (2-15 characters)";
        }
        break;
      case "email":
        if (value && !patterns.email.test(value)) {
          return "Please enter a valid email address";
        }
        break;
      case "phone":
        if (!patterns.phone.test(value)) {
          return "Phone number must be 10-11 digits (e.g., 03001234567)";
        }
        break;
      case "postalCode":
        if (value && !patterns.postalCode.test(value)) {
          return "Postal code must be 5 digits";
        }
        break;
      case "city":
        if (!patterns.city.test(value)) {
          return "City must contain only letters and spaces (2-15 characters)";
        }
        break;
      case "address":
        if (!patterns.address.test(value)) {
          return "Address must be between 5-100 characters";
        }
        break;
      default:
        return "";
    }
    return "";
  };

  // Validate all fields
  const validateForm = () => {
    const newErrors = {};
    const requiredFields = ["name", "email", "address", "city", "phone"];

    requiredFields.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });

    // Validate optional fields if they have values
    if (formData.postalCode) {
      const postalError = validateField("postalCode", formData.postalCode);
      if (postalError) newErrors.postalCode = postalError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Input length restrictions
    const maxLengths = {
      name: 15,
      email: 50,
      phone: 11,
      postalCode: 5,
      city: 15,
      address: 100,
      note: 200
    };
    
    // Prevent entering more characters than allowed
    if (maxLengths[name] && value.length > maxLengths[name]) {
      return;
    }
    
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const userData = localStorage.getItem("user");
  const user = userData && userData !== "undefined" ? JSON.parse(userData) : null;
  const userId = user?._id;

  const handlePlaceOrder = async () => {
    // Validate form
    if (!validateForm()) {
      showToast("Please fix the errors in the form", "error");
      return;
    }

    // Check if cart is empty
    if (cartItems.length === 0) {
      showToast("Your cart is empty!", "error");
      return;
    }

    // Check stock availability
    for (let item of cartItems) {
      if (item.quantity > item.stock) {
        showToast(`Only ${item.stock} items available for ${item.name} (${item.size})`, "error");
        return;
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

      showToast("Order placed successfully! 🎉", "success");
      
      // Clear cart and navigate after a short delay
      setTimeout(() => {
        dispatch(clearCart());
        navigate("/receipt", { state: { order: res.data } });
      }, 1500);

    } catch (err) {
      console.error("❌ Order placement error:", err.response?.data || err.message);
      showToast("Failed to place order. Please try again.", "error");
    }
  };

  return (
    <div className="checkout-container">
      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Left: Shipping Form */}
      <div className="checkout-form">
        <h2>Shipping Details</h2>
        
        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Full Name "
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.name ? "error" : ""}
            maxLength={15}
          />
          <div className="char-counter">{formData.name.length}/15</div>
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.email ? "error" : ""}
            maxLength={50}
          />
          <div className="char-counter">{formData.email.length}/50</div>
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={formData.address}
            onChange={handleChange}
            onBlur={handleBlur}
            className={errors.address ? "error" : ""}
            maxLength={100}
          />
          <div className="char-counter">{formData.address.length}/100</div>
          {errors.address && <span className="error-message">{errors.address}</span>}
        </div>

        <div className="row">
          <div className="form-group">
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.city ? "error" : ""}
              maxLength={15}
            />
            <div className="char-counter">{formData.city.length}/15</div>
            {errors.city && <span className="error-message">{errors.city}</span>}
          </div>
          
          <div className="form-group">
            <input
              type="text"
              name="country"
              placeholder="Country"
              value={formData.country}
              readOnly
            />
          </div>
        </div>

        <div className="row">
          <div className="form-group">
            <input
              type="text"
              name="postalCode"
              placeholder="Postal Code ( Optional)"
              value={formData.postalCode}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.postalCode ? "error" : ""}
              maxLength={5}
            />
            <div className="char-counter">{formData.postalCode.length}/5</div>
            {errors.postalCode && <span className="error-message">{errors.postalCode}</span>}
          </div>
          
          <div className="form-group">
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              className={errors.phone ? "error" : ""}
              maxLength={11}
            />
            <div className="char-counter">{formData.phone.length}/11</div>
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>
        </div>

        <div className="form-group">
          <textarea
            name="note"
            placeholder="Additional Note (Optional)"
            value={formData.note}
            onChange={handleChange}
            maxLength={200}
            rows={4}
          ></textarea>
          <div className="char-counter">{formData.note.length}/200</div>
        </div>

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
