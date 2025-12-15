import { createSlice } from "@reduxjs/toolkit";

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState: {
    isExpanded: true,
    isHovered: false,
    isMobileOpen: false,
    activeItem: null,
    submenu: {},
  },

  reducers: {
    toggleSidebar: (state) => {
      state.isExpanded = !state.isExpanded;
    },

    toggleMobileSidebar: (state) => {
      state.isMobileOpen = !state.isMobileOpen;
    },

    setIsHovered: (state, action) => {
      state.isHovered = action.payload;
    },

    setActiveItem: (state, action) => {
      state.activeItem = action.payload;
    },

    toggleSubmenu: (state, action) => {
      const key = action.payload;
      state.submenu[key] = !state.submenu[key];
    },

    setMobile: (state, action) => {
      state.isMobileOpen = action.payload; // true/false
    },
  },
});

export const {
  toggleSidebar,
  toggleMobileSidebar,
  setIsHovered,
  setActiveItem,
  toggleSubmenu,
  setMobile,
} = sidebarSlice.actions;

export default sidebarSlice.reducer;
