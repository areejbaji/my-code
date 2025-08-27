import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: null, // login info
  measurements: {} // store last used measurements
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userInfo = action.payload;
    },
    logoutUser: (state) => {
      state.userInfo = null;
      state.measurements = {};
    },
    saveMeasurements: (state, action) => {
      state.measurements = action.payload; // payload = measurements object
    }
  }
});

export const { setUser, logoutUser, saveMeasurements } = userSlice.actions;
export default userSlice.reducer;
