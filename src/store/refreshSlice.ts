import { createSlice } from "@reduxjs/toolkit";

interface RefreshState {
  refreshVersion: number;
}

const initialState: RefreshState = {
  refreshVersion: 0,
};

const refreshSlice = createSlice({
  name: "refresh",
  initialState,
  reducers: {
    incrementVersion: (state) => {
      state.refreshVersion += 1;
    },
  },
});

export const { incrementVersion } = refreshSlice.actions;
export default refreshSlice.reducer;
