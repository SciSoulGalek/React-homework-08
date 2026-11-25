import { createSlice } from "@reduxjs/toolkit";

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: {
    filter: "all",
  },
  reducers: {
    setDashboardFilter(state, action) {
      state.filter = action.payload;
    },
  },
});

export const { setDashboardFilter } = dashboardSlice.actions;

export default dashboardSlice.reducer;
