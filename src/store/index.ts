import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../reducers/authSlice';
import refreshSlice from './refreshSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    refreshVersion: refreshSlice,
  },
  devTools: true,
});

store.subscribe(() => {
  const state = store.getState();
  if ((state as any).auth.isAuthenticated && (state as any).auth.user) {
    localStorage.setItem('authToken', (state as any).auth.user.token || '');
    localStorage.setItem('authUser', JSON.stringify((state as any).auth.user));
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
