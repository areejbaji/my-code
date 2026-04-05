

// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   items: [],
// };

// const cartSlice = createSlice({
//   name: "cart",
//   initialState,
//   reducers: {
//     addToCart: (state, action) => {
//       const existingItem = state.items.find(
//         (item) =>
//           item.id === action.payload.id && item.size === action.payload.size
//       );

//       if (existingItem) {
//         // Handle stock as object or number
//         const currentStock = typeof action.payload.stock === 'object' 
//           ? action.payload.stock[action.payload.size] 
//           : action.payload.stock;
          
//         const newQuantity = existingItem.quantity + action.payload.quantity;
//         if (newQuantity <= currentStock) {
//           existingItem.quantity = newQuantity;
//         } else {
//           existingItem.quantity = currentStock;
//         }
//       } else {
//         state.items.push({ ...action.payload });
//       }
//     },

//     // increaseQuantity: (state, action) => {
//     //   const item = state.items.find(
//     //     (i) => i.id === action.payload.id && i.size === action.payload.size
//     //   );

//     //   if (item) {
//     //     // Handle stock as object or number
//     //     const currentStock = typeof item.stock === 'object' 
//     //       ? item.stock[item.size] 
//     //       : item.stock;
          
//     //     // Only increase if within stock limit
//     //     if (item.quantity < currentStock) {
//     //       item.quantity += 1;
//     //     }
//     //     // If we hit the stock limit, we could set a flag or do nothing
//     //     // The component should handle the toast message
//     //   }
//     // },
// //     increaseQuantity: (state, action) => {
// //   const item = state.items.find(
// //     i => i.id === action.payload.id && i.size === action.payload.size
// //   );
// //   if (item && item.quantity < item.stock) {
// //     item.quantity += 1;
// //   }
// // },
// increaseQuantity: (state, action) => {
//   const item = state.items.find(
//     (i) => i.id === action.payload.id && i.size === action.payload.size
//   );
  
//   if (item) {
//     const currentStock = typeof item.stock === 'object' 
//       ? item.stock[item.size]
//       : item.stock;
            
//     if (item.quantity < currentStock) {
//       item.quantity += 1;
//     }
//   }
// },


//     decreaseQuantity: (state, action) => {
//       const item = state.items.find(
//         (i) => i.id === action.payload.id && i.size === action.payload.size
//       );
//       if (item && item.quantity > 1) {
//         item.quantity -= 1;
//       }
//     },

//     removeFromCart: (state, action) => {
//       state.items = state.items.filter(
//         (item) =>
//           !(item.id === action.payload.id && item.size === action.payload.size)
//       );
//     },

//     clearCart: (state) => {
//       state.items = [];
//     },

//     updateQuantity: (state, action) => {
//       const { id, size, quantity } = action.payload;
//       const item = state.items.find(
//         (i) => i.id === id && i.size === size
//       );

//       if (item) {
//         // Handle stock as object or number
//         const currentStock = typeof item.stock === 'object' 
//           ? item.stock[size] 
//           : item.stock;
          
//         if (quantity <= 0) {
//           state.items = state.items.filter(
//             (i) => !(i.id === id && i.size === size)
//           );
//         } else if (quantity <= currentStock) {
//           item.quantity = quantity;
//         } else {
//           item.quantity = currentStock;
//         }
//       }
//     },
//   },
// });

// export const {
//   addToCart,
//   removeFromCart,
//   increaseQuantity,
//   decreaseQuantity,
//   clearCart,
//   updateQuantity,
// } = cartSlice.actions;

// export default cartSlice.reducer;
// cartSlice.js - COMPLETE VERSION
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      
      // ✅ Ensure both id and productId are set
      const productId = item.productId || item._id || item.id;
      
      const existingItem = state.items.find(
        i => (i.id || i.productId || i._id) === productId && i.size === item.size
      );

      // Handle stock as object or number
      const currentStock = typeof item.stock === 'object' 
        ? item.stock[item.size] 
        : item.stock;

      if (existingItem) {
        const newQuantity = existingItem.quantity + item.quantity;
        if (newQuantity <= currentStock) {
          existingItem.quantity = newQuantity;
        } else {
          existingItem.quantity = currentStock;
        }
      } else {
        state.items.push({
          ...item,
          id: productId,          // ✅ Store as id for consistency
          productId: productId,   // ✅ Also store as productId
          _id: productId         // ✅ Keep _id for backward compatibility
        });
      }
    },

    increaseQuantity: (state, action) => {
      const item = state.items.find(
        (i) => (i.id || i.productId || i._id) === action.payload.id && i.size === action.payload.size
      );
      
      if (item) {
        const currentStock = typeof item.stock === 'object' 
          ? item.stock[item.size]
          : item.stock;
                
        if (item.quantity < currentStock) {
          item.quantity += 1;
        }
      }
    },

    decreaseQuantity: (state, action) => {
      const item = state.items.find(
        (i) => (i.id || i.productId || i._id) === action.payload.id && i.size === action.payload.size
      );
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        item => !((item.id || item.productId || item._id) === action.payload.id && item.size === action.payload.size)
      );
    },

    clearCart: (state) => {
      state.items = [];
    },

    updateQuantity: (state, action) => {
      const { id, size, quantity } = action.payload;
      const item = state.items.find(
        (i) => (i.id || i.productId || i._id) === id && i.size === size
      );

      if (item) {
        const currentStock = typeof item.stock === 'object' 
          ? item.stock[size] 
          : item.stock;
          
        if (quantity <= 0) {
          state.items = state.items.filter(
            (i) => !((i.id || i.productId || i._id) === id && i.size === size)
          );
        } else if (quantity <= currentStock) {
          item.quantity = quantity;
        } else {
          item.quantity = currentStock;
        }
      }
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  updateQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;