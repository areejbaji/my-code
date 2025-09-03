
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchWomenProducts = createAsyncThunk(
  "women/fetchWomenProducts",
  async () => {
    const response = await axios.get("http://localhost:4000/api/products/category/women");
    return response.data; 
  }
);

const womenSlice = createSlice({
  name: "women",
  initialState: {
    products: [],
    suits: [],
    frocks: [],
    status: "idle", 
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWomenProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWomenProducts.fulfilled, (state, action) => {
        state.status = "succeeded";

       
        state.products = action.payload.products || [];

      
        state.suits = state.products.filter(
          (item) => item.subCategory?.toLowerCase() === "suit"
        );
        state.frocks = state.products.filter(
          (item) => item.subCategory?.toLowerCase() === "frock"
        );
      })
      .addCase(fetchWomenProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default womenSlice.reducer;
