import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/authSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
  },
  devTools: true,
})

store.subscribe(() => {
  console.log('State updated:', store.getState());
});
