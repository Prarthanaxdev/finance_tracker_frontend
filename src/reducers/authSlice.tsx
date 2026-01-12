import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthUser {
  token?: string;
  _id?: string;
  name?: string;
  email?: string;
  [key: string]: any;
}

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
}

// Setting initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

// Creating the auth slice
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthUser>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
