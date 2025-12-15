// src/store/Slices/GlobalSaveSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  SelectedClient: "",
  UserCode: "",
  isAuthenticated: false,
};

const GlobalSaveSlice = createSlice({
  name: "GlobalSaveSlice",
  initialState,
  reducers: {
    setSelectedClient: (state, action) => {
      state.SelectedClient = action.payload;
    },
    setUserCode: (state, action) => {
      state.UserCode = action.payload;
    },
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    resetGlobalSaveStore: () => initialState,
  },
});

export const { setUserCode, setSelectedClient,setIsAuthenticated,resetGlobalSaveStore } = GlobalSaveSlice.actions;
export default GlobalSaveSlice.reducer;
