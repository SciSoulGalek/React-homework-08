import { configureStore } from "@reduxjs/toolkit";
import gamesReducer from "./games/gamesSlice";
import libraryReducer from "./library/librarySlice";
import dashboardReducer from "./dashboard/dashboardSlice";

export const store = configureStore({
  reducer: {
    games: gamesReducer,
    library: libraryReducer,
    dashboard: dashboardReducer,
  },
});
