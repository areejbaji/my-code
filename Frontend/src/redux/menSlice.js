// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// // Async API call
// export const fetchMenProducts = createAsyncThunk(
//   "men/fetchMenProducts",
//   async () => {
//     const response = await axios.get("http://localhost:4000/product/category/men");
//     return response.data; // backend se jo array milega
//   }
// );

// const menSlice = createSlice({
//   name: "men",
//   initialState: {
//     products: [],
//     status: "idle", // idle | loading | succeeded | failed
//     error: null
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchMenProducts.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(fetchMenProducts.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.products = action.payload;
//       })
//       .addCase(fetchMenProducts.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.error.message;
//       });
//   }
// });

// export default menSlice.reducer;
// src/redux/menSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async API call
export const fetchMenProducts = createAsyncThunk(
  "men/fetchMenProducts",
  async () => {
    // const response = await axios.get("http://localhost:4000/api/product/category/men");
     const response = await axios.get("http://localhost:4000/api/products/category/men");
    return response.data; // backend se { success, products } aata hai
  }
);

const menSlice = createSlice({
  name: "men",
  initialState: {
    products: [],
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMenProducts.fulfilled, (state, action) => {
        state.status = "succeeded";

        // ✅ Correct: sirf products array nikalna
        state.products = action.payload.products || [];
      })
      .addCase(fetchMenProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default menSlice.reducer;

