import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import AppIcon from "../Component/AppIcon";
import SidebarMenu from "./SidebarMenu";
import useScreen from "../Hooks/useScreen";
import HFFulllogoLight from "../Image/hfactor-logo.png";
import HFFulllogoDark from "../Image/hfactor-logo-dark.png";
import { setIsSidebarOpen } from "../Store/Slices/GlobalSlice";
import { setTheme } from "../Store/Auth/AuthSlice";

const SidebarHeader = ({ collapsed, theme, onClose, isMobile }) => (
  <div className="p-2.5 border-b border-slate-200/50 dark:border-slate-700/50 relative flex items-center h-16">
    <div className={collapsed ? "flex" : "hidden"}>
      <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-primary-600 to-blue-600 flex items-center justify-center shadow-md">
        <AppIcon name="Building2" className="w-5 h-5 text-white" />
      </div>
    </div>

    <img
      src={theme === "light" ? HFFulllogoDark : HFFulllogoLight}
      alt="HFactor"
      className={`h-10 object-contain ${collapsed ? "hidden" : "block"}`}
    />

    {isMobile && (
      <AppIcon
        name="X"
        size={15}
        onClick={onClose}
        className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-black dark:text-white"
      />
    )}
  </div>
);

const Sidebar = () => {
  const dispatch = useDispatch();
  const { isMobile } = useScreen();
  const { isSidebarOpen } = useSelector((state) => state.GlobalStore);
  const { Common } = useSelector((state) => state.Auth);
  const { theme } = Common;

  const closeSidebar = useCallback(() => {
    dispatch(setIsSidebarOpen(false));
  }, [dispatch]);

  const toggleTheme = () => {
    dispatch(setTheme(theme === "light" ? "dark" : "light"));
  };

  const [searchQuery, setSearchQuery] = useState("");

  const containerBase = `
    bg-white/95 dark:bg-slate-900/95
    backdrop-blur-xl
    border-r border-slate-200/50 dark:border-slate-700/50
    flex flex-col
  `;

  /* ================= MOBILE ================= */
  if (isMobile) {
    return (
      <>
        {isSidebarOpen && (
          <div
            onClick={closeSidebar}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />
        )}

        <aside
          className={`
            fixed top-0 left-0 z-50 h-full w-72
            transform transition-transform duration-300
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            ${containerBase}
          `}
        >
          <SidebarHeader
            collapsed={false}
            theme={theme}
            onClose={closeSidebar}
            isMobile
          />

          <div className="px-3 py-2">
            <div className="relative group">
              <div className={`
                flex items-center px-3 py-2.5 rounded-xl
                bg-slate-50 dark:bg-slate-800/50 
                border border-slate-200 dark:border-slate-700/50
                focus-within:bg-white dark:focus-within:bg-slate-800
                focus-within:border-indigo-500/50 dark:focus-within:border-indigo-500/50
                focus-within:ring-4 focus-within:ring-indigo-500/10
                transition-all duration-200 ease-out shadow-sm
              `}>
                <AppIcon
                  name="Search"
                  className={`w-4 h-4 mr-2.5 transition-colors duration-200 ${searchQuery ? 'text-indigo-500' : 'text-slate-400 group-hover:text-slate-500'}`}
                />
                <input
                  type="text"
                  placeholder="Fast Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent text-sm font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-400/80 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <AppIcon name="X" size={12} />
                  </button>
                )}
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-2">
            <SidebarMenu onItemClick={closeSidebar} searchQuery={searchQuery} />
          </nav>

        </aside>
      </>
    );
  }

  /* ================= DESKTOP ================= */
  const collapsed = isSidebarOpen;

  return (
    <aside
      className={`
        hidden sm:flex h-full
        ${collapsed ? "w-16" : "w-72"}
        transition-all duration-300
        ${containerBase}
      `}
    >
      <SidebarHeader
        collapsed={collapsed}
        theme={theme}
        isMobile={false}
      />

      {!collapsed && (
        <div className="px-3 py-2 transition-all duration-300">
          <div className="relative group">
            <div className={`
              flex items-center px-3 py-2.5 rounded-xl
              bg-slate-50 dark:bg-slate-800/50 
              border border-slate-200 dark:border-slate-700/50
              focus-within:bg-white dark:focus-within:bg-slate-800
              focus-within:border-indigo-500/50 dark:focus-within:border-indigo-500/50
              focus-within:ring-4 focus-within:ring-indigo-500/10
              transition-all duration-200 ease-out shadow-sm
            `}>
              <AppIcon
                name="Search"
                className={`w-4 h-4 mr-2.5 transition-colors duration-200 ${searchQuery ? 'text-indigo-500' : 'text-slate-400 group-hover:text-slate-500'}`}
              />
              <input
                type="text"
                placeholder="Fast Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-400/80 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-rose-500 transition-colors"
                >
                  <AppIcon name="X" size={12} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto overflow-x-hidden p-2">
        <SidebarMenu searchQuery={searchQuery} />
      </nav>
    </aside>
  );
};

export default Sidebar;
