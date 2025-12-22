// src/store/Slices/GlobalSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  SelectedMonth: "",
  ClientList : [],
  isMenuOpen: false,
};

const GlobalSlice = createSlice({
  name: "GlobalSlice",
  initialState,
  reducers: {
    setSelectedMonth: (state, action) => {
      state.SelectedMonth = action.payload;
    },
    setClientList: (state, action) => {
      state.ClientList = action.payload;
    },
    setISMenuOpen: (state, action) => {
      state.isMenuOpen = action.payload;
    },
     resetGlobalStore: () => initialState,
  },
});

export const { setSelectedMonth,setClientList,resetGlobalStore,setISMenuOpen } = GlobalSlice.actions;
export default GlobalSlice.reducer;
