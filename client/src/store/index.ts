import { configureStore } from "@reduxjs/toolkit";

import vehicleReducer from "./vehicleSlice";

export const store = configureStore({
  reducer: {
    vehicle: vehicleReducer,
  },
});

// Type definitions for global state and dispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
