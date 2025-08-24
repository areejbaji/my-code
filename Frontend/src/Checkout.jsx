import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { clearCart } from "./redux/cartSlice";
import "./Checkout.css";

const CheckoutPage = () => {
  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    phone: "",
    note: ""
  });

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  const handlePlaceOrder = async () => {
    if (!formData.name || !formData.city || !formData.phone) {
      return alert("Please fill all required fields!");
    }
    if (cartItems.length === 0) return alert("Cart is empty!");

    try {
      const order = {
        items: cartItems,
        shipping: formData,
        total: cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        paymentMethod: "Cash on Delivery",
        country: "Pakistan"
      };

      await axios.post("http://localhost:4000/api/orders", order);
      alert("Order placed successfully!");
      dispatch(clearCart());
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Failed to place order. Try again.");
    }
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      {/* Cart Summary */}
      <div className="checkout-items">
        {cartItems.map(item => (
          <div key={item.id} className="checkout-item">
            <img src={item.image} alt={item.name} className="checkout-img" />
            <div className="checkout-details">
              <h4>{item.name}</h4>
              <p>PKR {item.price} x {item.quantity}</p>
              <p>Size: <span className="size-box">{item.size}</span></p>

              <div className="measurement-section">
                <div>
                  <h5>Shirt</h5>
                  <div className="measurements-boxes">
                    {['Length','Shoulder','Armhole','Chest','Waist','Hip','Sleeve Length','Wrist','Bottom/Damman']
                      .filter(f => item.measurements[f])
                      .map(f => <div key={f} className="measure-box">{f}: {item.measurements[f]}</div>)}
                  </div>
                </div>
                <div>
                  <h5>Trouser</h5>
                  <div className="measurements-boxes">
                    {['Length','Waist','Knee','Thigh','Hip','Bottom']
                      .filter(f => item.measurements[f])
                      .map(f => <div key={f} className="measure-box">{f}: {item.measurements[f]}</div>)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Shipping Form */}
      <div className="checkout-form">
        <h3>Shipping Details</h3>
        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} />
        <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} />
        <input type="text" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />
        <textarea name="note" placeholder="Note (Optional)" value={formData.note} onChange={handleChange}></textarea>
        <button className="place-order-btn" onClick={handlePlaceOrder}>Place Order</button>
      </div>
    </div>
  );
};

export default CheckoutPage;
