
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ClientList: [],
  isMenuOpen: false,
  isSidebarOpen: false
};

const GlobalSlice = createSlice({
  name: "GlobalSlice",
  initialState,
  reducers: {

    setClientList: (state, action) => {
      state.ClientList = action.payload;
    },
    setISMenuOpen: (state, action) => {
      state.isMenuOpen = action.payload;
    },
    setIsSidebarOpen: (state, action) => {
      state.isSidebarOpen = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    resetGlobalStore: () => initialState,
  },
});

export const { setClientList, resetGlobalStore, setISMenuOpen, setIsSidebarOpen, setIsLoading } = GlobalSlice.actions;
export default GlobalSlice.reducer;
