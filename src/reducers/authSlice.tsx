import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

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
    }
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
