
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchMenProducts = createAsyncThunk(
  "men/fetchMenProducts",
  async () => {
   
     const response = await axios.get("http://localhost:4000/api/products/category/men");
    return response.data; 
  }
);

const menSlice = createSlice({
  name: "men",
  initialState: {
    products: [],
    status: "idle", 
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

        state.products = action.payload.products || [];
      })
      .addCase(fetchMenProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default menSlice.reducer;

