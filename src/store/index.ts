import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../reducers/authSlice';
import refreshSlice from '../reducers/refreshSlice';

// Step 1: Create the Redux store
export const store = configureStore({
  reducer: {
    auth: authSlice,  // Handles authentication state
    refreshVersion: refreshSlice, // Handles refresh triggers
  },
  devTools: true,
});


// Step 2: Subscribe to store changes
// Runs every time Redux state changes
store.subscribe(() => {
  const state = store.getState();
  if ((state as any).auth.isAuthenticated && (state as any).auth.user) {
    localStorage.setItem('authToken', (state as any).auth.user.token || '');
    localStorage.setItem('authUser', JSON.stringify((state as any).auth.user));
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
