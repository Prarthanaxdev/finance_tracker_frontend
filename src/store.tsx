import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/authSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
  },
  devTools: true,
})

// Persist auth state to localStorage on every state change
store.subscribe(() => {
  const state = store.getState();
  if (state.auth.isAuthenticated && state.auth.user) {
    localStorage.setItem('authToken', state.auth.user.token || '');
    localStorage.setItem('authUser', JSON.stringify(state.auth.user));
  }
});
