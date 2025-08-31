


import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, increaseQuantity, decreaseQuantity } from "./redux/cartSlice";
import { useNavigate } from "react-router-dom";
import "./CartPage.css";

const CartPage = () => {
  const cartItems = useSelector(state => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getTotalPrice = () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="cart-container">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      <h2>Your Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-content">

          {/* Cart Items */}
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-img" />

                <div className="cart-details">
                  <h3>{item.name}</h3>
                  <p>PKR {item.price}</p>
                  
                  {/* Selected Size */}
                  <p>
                    Size: <span className="size-box">{item.size}</span>
                  </p>

                  {/* Measurements */}
                  <div className="measurement-section">
                    <div className="shirt-measurements">
                      <h4>Shirt</h4>
                      <div className="measurements-boxes">
                        {['Length','Shoulder','Armhole','Chest','Waist','Hip','Sleeve Length','Wrist','Bottom/Damman']
                          .filter(f => item.measurements[f])
                          .map(f => (
                            <div key={f} className="measure-box">
                              {f}:{item.measurements[f]}
                            </div>
                          ))}
                      </div>
                    </div>

                    <div className="trouser-measurements">
                      <h4>Trouser</h4>
                      <div className="measurements-boxes">
                        {['Length','Waist','Knee','Thigh','Hip','Bottom']
                          .filter(f => item.measurements[f])
                          .map(f => (
                            <div key={f} className="measure-box">
                              {f}:{item.measurements[f]}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>

                  
<div className="quantity-remove-row">
  <div className="quantity-control">
    <button onClick={() => dispatch(decreaseQuantity(item.id))}>-</button>
    <span>{item.quantity}</span>
    <button onClick={() => dispatch(increaseQuantity(item.id))}>+</button>
  </div>
  <button className="remove-btn" onClick={() => dispatch(removeFromCart(item.id))}>
    Remove
  </button>
</div>

                  {/* Remove button */}
                  {/* <button className="remove-btn" onClick={() => dispatch(removeFromCart(item.id))}>
                    Remove
                  </button> */}
                </div>
              </div>
            ))}
          </div>

          {/* Price Details */}
          <div className="price-details">
            <h3>Price Details</h3>
            <p>Subtotal: PKR {getTotalPrice()}</p>
            <p>Shipping: Free</p>
            <p><strong>Payment:</strong> Cash on Delivery</p>
            <h4>Total: PKR {getTotalPrice()}</h4>
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>

        </div>
      )}
    </div>
  );
};

export default CartPage;
