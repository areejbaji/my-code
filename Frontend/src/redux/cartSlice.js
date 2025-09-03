// import { createSlice } from "@reduxjs/toolkit";

// const cartSlice = createSlice({
//   name: "cart",
//   initialState: {
//     items: []
//   },
//   reducers: {
//     addToCart: (state, action) => {
//       const itemInCart = state.items.find(item => item.id === action.payload.id);
//       if (itemInCart) {
//         if (itemInCart.quantity < itemInCart.stock) {
//           itemInCart.quantity++;
//         } else {
//           alert(`⚠️ only ${itemInCart.stock} pieces are avaliable!`);
//         }
//       } else {
//         state.items.push({
//           ...action.payload,
//           quantity: 1,
//           stock: action.payload.stock || 0
//         });
//       }
//     },

//     increaseQuantity: (state, action) => {
//       const item = state.items.find(item => item.id === action.payload);
//       if (item) {
//         if (item.quantity < item.stock) {
//           item.quantity++;
//         } else {
//           alert(`⚠️ Sirf ${item.stock} pieces available hain!`);
//         }
//       }
//     },

//     decreaseQuantity: (state, action) => {
//       const item = state.items.find(item => item.id === action.payload);
//       if (item) {
//         if (item.quantity > 1) {
//           item.quantity--;
//         } else {
//           state.items = state.items.filter(i => i.id !== action.payload);
//         }
//       }
//     },

//     updateQuantity: (state, action) => {
//       const { id, quantity } = action.payload;
//       const item = state.items.find(item => item.id === id);
//       if (item) {
//         if (quantity > item.stock) {
//           alert(`⚠️ only ${item.stock} pieces are avaliable!`);
//         } else if (quantity < 1) {
//           state.items = state.items.filter(i => i.id !== id);
//         } else {
//           item.quantity = quantity;
//         }
//       }
//     },

//     removeFromCart: (state, action) => {
//       state.items = state.items.filter(item => item.id !== action.payload);
//     },

//     clearCart: (state) => {
//       state.items = [];
//     }
//   }
// });

// // ✅ Export actions properly
// export const {
//   addToCart,
//   increaseQuantity,
//   decreaseQuantity,
//   updateQuantity,
//   removeFromCart,
//   clearCart
// } = cartSlice.actions;

// export default cartSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existingItem = state.items.find(
        (item) =>
          item.id === action.payload.id && item.size === action.payload.size
      );

      if (existingItem) {
        // Only increase quantity if it won't exceed stock
        if (existingItem.quantity + action.payload.quantity <= action.payload.stock) {
          existingItem.quantity += action.payload.quantity;
        } else {
          existingItem.quantity = action.payload.stock;
        }
      } else {
        state.items.push({ ...action.payload });
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    increaseQuantity: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item && item.quantity < item.stock) {
        item.quantity += 1;
      }
    },
    decreaseQuantity: (state, action) => {
      const item = state.items.find((i) => i.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
