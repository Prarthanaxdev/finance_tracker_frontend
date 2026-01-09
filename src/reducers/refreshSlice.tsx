import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RefreshState {
  version: number;
}

const initialState: RefreshState = {
  version: 0,
};

export const refreshSlice = createSlice({
  name: "refreshVersion",
  initialState,
  reducers: {
    incrementVersion: (state) => {
      state.version += 1;
    },
  },
});

export const { incrementVersion } = refreshSlice.actions;
export default refreshSlice.reducer;
