import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} from "./redux/cartSlice";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CartPage.css";

const CartPage = () => {
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getTotalPrice = () =>
    cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    navigate("/checkout");
  };

  //  Handle increase quantity with stock check
  const handleIncreaseQuantity = (item) => {
    console.log('Increasing quantity for:', item.name, 'Current:', item.quantity, 'Stock:', item.stock);
    
    // Handle stock as object or number
    const currentStock = typeof item.stock === 'object' ? item.stock[item.size] : item.stock;
    
    if (item.quantity >= currentStock) {
      toast.error(`Only ${currentStock} pieces available!`, { position: "top-right" });
      return;
    }
    
    // Store current quantity to compare after dispatch
    const currentQuantity = item.quantity;
    dispatch(increaseQuantity({ id: item.id, size: item.size }));
    
    // Optional: Add success message
    setTimeout(() => {
      const updatedItem = cartItems.find(i => i.id === item.id && i.size === item.size);
      if (updatedItem && updatedItem.quantity > currentQuantity) {
        console.log('Quantity successfully increased');
      }
    }, 100);
  };

  const handleDecreaseQuantity = (item) => {
    if (item.quantity <= 1) {
      dispatch(removeFromCart({ id: item.id, size: item.size }));
    } else {
      dispatch(decreaseQuantity({ id: item.id, size: item.size }));
    }
  };

  return (
    <div className="cart-container">
      <ToastContainer />
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <h2>Your Shopping Cart</h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={`${item.id}-${item.size}`} className="cart-item">
                <img src={item.image} alt={item.name} className="cart-img" />

                <div className="cart-details">
                  <h3>{item.name}</h3>
                  <p>PKR {item.price}</p>
                  <p>
                    Size: <span className="size-box">{item.size}</span>
                  </p>
                
                 

                  <div className="measurement-section">
                    <div className="shirt-measurements">
                      <h4>Shirt</h4>
                      <div className="measurements-boxes">
                        {[
                          "Length", "Shoulder", "Armhole", "Chest", "Waist", "Hip", 
                          "Sleeve Length", "Wrist", "Bottom/Damman"
                        ]
                          .filter(f => 
                            (item.measurements && item.measurements[f]) ||
                            (item.measurements && item.measurements[`S.${f}`])
                          )
                          .map((f) => (
                            <div key={f} className="measure-box">
                              {f}: {item.measurements[f] || item.measurements[`S.${f}`]}
                            </div>
                          ))}
                      </div>
                    </div>

                    <div className="trouser-measurements">
                      <h4>Trouser</h4>
                      <div className="measurements-boxes">
                        {["Length", "Waist", "Knee", "Thigh", "Hip", "Bottom"]
                          .filter(f => 
                            (item.measurements && item.measurements[f]) ||
                            (item.measurements && item.measurements[`T.${f}`])
                          )
                          .map((f) => (
                            <div key={f} className="measure-box">
                              {f}: {item.measurements[f] || item.measurements[`T.${f}`]}
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>

                  <div className="quantity-remove-row">
                    <div className="quantity-control">
                      <button onClick={() => handleDecreaseQuantity(item)}>-</button>
                      <span>{item.quantity}</span>
                      <button 
                        onClick={() => handleIncreaseQuantity(item)}
                        disabled={item.quantity >= (typeof item.stock === 'object' ? item.stock[item.size] : item.stock)}
                        style={{
                          opacity: item.quantity >= (typeof item.stock === 'object' ? item.stock[item.size] : item.stock) ? 0.5 : 1,
                          cursor: item.quantity >= (typeof item.stock === 'object' ? item.stock[item.size] : item.stock) ? 'not-allowed' : 'pointer'
                        }}
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => dispatch(removeFromCart({ id: item.id, size: item.size }))}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="price-details">
            <h3>Price Details</h3>
            <p>Subtotal: PKR {getTotalPrice()}</p>
            <p>Shipping: Free</p>
            <p><strong>Payment:</strong> Cash on Delivery</p>
            <h4>Total: PKR {getTotalPrice()}</h4>
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
            <button className="checkout-btn" onClick={() => navigate("/")}>
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
