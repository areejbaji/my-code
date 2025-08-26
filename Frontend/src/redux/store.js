
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import menReducer from "./menSlice";
import womenReducer from "./womenSlice";
import productsReducer from "./productsSlice";
export const store = configureStore({
  reducer: {
    cart: cartReducer,
    men: menReducer,
    women: womenReducer,
     products: productsReducer,
  },
});

