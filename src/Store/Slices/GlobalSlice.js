
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ClientList : [],
  isMenuOpen: false,
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
     resetGlobalStore: () => initialState,
  },
});

export const { setClientList,resetGlobalStore,setISMenuOpen } = GlobalSlice.actions;
export default GlobalSlice.reducer;
