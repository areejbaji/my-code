
// import { createSlice } from "@reduxjs/toolkit";

// const cartSlice = createSlice({
//   name: "cart",
//   initialState: {
//     items: []
//   },
//   reducers: {
//     addToCart: (state, action) => {
//       // action.payload must contain quantity
//       const itemInCart = state.items.find(item => item.id === action.payload.id);
//       if (itemInCart) {
//         // Add the selected quantity instead of +1
//         itemInCart.quantity += action.payload.quantity;
//       } else {
//         state.items.push({ ...action.payload });
//       }
//     },
//     removeFromCart: (state, action) => {
//       state.items = state.items.filter(item => item.id !== action.payload);
//     },
//     increaseQuantity: (state, action) => {
//       const item = state.items.find(item => item.id === action.payload);
//       if (item) item.quantity += 1;
//     },
//     decreaseQuantity: (state, action) => {
//       const item = state.items.find(item => item.id === action.payload);
//       if (item && item.quantity > 1) item.quantity -= 1;
//       else if (item && item.quantity === 1) state.items = state.items.filter(i => i.id !== action.payload);
//     },
//     clearCart: (state) => {
//       state.items = [];
//     }
//   }
// });

// export const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } = cartSlice.actions;

// export default cartSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: []
  },
  reducers: {
    // Add to Cart
    addToCart: (state, action) => {
      const itemInCart = state.items.find(item => item.id === action.payload.id);
      if (itemInCart) {
        // Agar pehle se cart me hai to quantity increase karo, lekin stock check karke
        if (itemInCart.quantity < itemInCart.stock) {
          itemInCart.quantity++;
        } else {
          alert(`⚠️ Sirf ${itemInCart.stock} pieces available hain!`);
        }
      } else {
        // Naya product add karo
        state.items.push({
          ...action.payload,
          quantity: 1,          // default quantity
          stock: action.payload.stock || 0   // stock bhi save karna hai
        });
      }
    },

    // Increase Quantity
    increaseQuantity: (state, action) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        if (item.quantity < item.stock) {
          item.quantity++;
        } else {
          alert(`⚠️ Sirf ${item.stock} pieces available hain!`);
        }
      }
    },

    // Decrease Quantity
    decreaseQuantity: (state, action) => {
      const item = state.items.find(item => item.id === action.payload);
      if (item) {
        if (item.quantity > 1) {
          item.quantity--;
        } else {
          state.items = state.items.filter(i => i.id !== action.payload);
        }
      }
    },

    // Remove Item
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },

    // Clear Cart
    clearCart: (state) => {
      state.items = [];
    }
  }
});

export const { addToCart, increaseQuantity, decreaseQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
