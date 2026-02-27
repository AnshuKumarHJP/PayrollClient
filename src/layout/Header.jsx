/* =====================================================
   ✅ FINAL FIXED Header.jsx (DESKTOP + MOBILE SAFE)
   - Desktop: collapse sidebar
   - Mobile: open overlay drawer
   ===================================================== */

import React, { useEffect, useMemo } from "react";
import AppIcon from "../Component/AppIcon";
import UserDropdown from "../Component/UserDropdown";
import { useDispatch, useSelector } from "react-redux";
import {
  setIsSidebarOpen,
  setISMenuOpen,
} from "../Store/Slices/GlobalSlice";
import useScreen from "../Hooks/useScreen";
import { setTheme } from "../Store/Auth/AuthSlice";
import NotificationDropdown from "../Component/NotificationDropdown";

const Header = () => {
  const dispatch = useDispatch();
  const { isMobile } = useScreen();
  const { Common } = useSelector((state) => state.Auth);
  const theme = Common?.theme || 'light';
  const isSidebarOpen = useSelector((state) => state.GlobalStore.isSidebarOpen);
  /* =====================================================
     🔐 SESSION AUTH (READ ONCE)
     ===================================================== */
  const AUTH_DATA = useSelector((state) => state.Auth.LogResponce.data);

  /* =====================================================
     🎨 THEME SYNC (Redux -> DOM)
     ===================================================== */
  useEffect(() => {
    // Ensure the DOM matches the Redux state
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    dispatch(setTheme(newTheme));
  };

  const toggleSidebar = () => {
    if (isMobile) {
      dispatch(setISMenuOpen(true));
      dispatch(setIsSidebarOpen(!isSidebarOpen)); // ✅ MOBILE → overlay
    } else {
      dispatch(setIsSidebarOpen(!isSidebarOpen)); // ✅ DESKTOP → collapse
    }
  };

  return (
    <header
      className="
        bg-white/80 dark:bg-slate-900/80 text-slate-800 dark:text-white 
          backdrop-blur-xl  border-b border-slate-200/50 dark:border-slate-700/50 px-4 py-2
      "
    >
      <div className="flex justify-between items-center">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="
              p-2 rounded-lg
              text-slate-600 dark:text-slate-300
              bg-slate-100 dark:bg-slate-800
            "
          >
            <AppIcon name={isSidebarOpen ? "ArrowRightToLine" : 'ArrowLeftToLine'} className="w-5 h-5" />
          </button>

          <div className="hidden md:block">
            <h1 className="text-lg font-bold text-slate-800 dark:text-white">
              Dashboard
            </h1>
            <p className="text-xs text-slate-500">
              Welcome back, {AUTH_DATA?.UserSession?.PersonName}
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="
              p-2.5 rounded-lg
              text-slate-600 dark:text-slate-300
              hover:bg-slate-100 dark:hover:bg-slate-800
            "
          >
            <AppIcon name={theme === "light" ? "Moon" : "Sun"} size={17} />
          </button>
          <NotificationDropdown />

          {/* <button className="p-2.5 rounded-lg">
            <AppIcon name="Settings" className="w-5 h-5" />
          </button> */}

          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default Header;
