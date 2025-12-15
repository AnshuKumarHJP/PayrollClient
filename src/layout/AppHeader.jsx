import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

import { Menu, X, Search } from "lucide-react";

import useSidebar from "../Hooks/useSidebar";
import NotificationDropdown from "../Component/header/NotificationDropdown";
import UserDropdown from "../Component/header/UserDropdown";

import FullLogo from "../Image/hfactor-logo-dark.png";
import Logo from "../Image/HFLogo.png";

const AppHeader = () => {
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const { isMobileOpen, toggleSidebar, toggleMobileSidebar, setMobile } =
    useSidebar();

  const inputRef = useRef(null);

  /* Sidebar toggle */
  // const handleToggle = () => {
  //   if (window.innerWidth >= 1024) toggleSidebar();
  //   else toggleMobileSidebar();
  // };

  /* Auto close mobile sidebar on resize */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setMobile(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setMobile]);

  /* CMD + K → Focus Search */
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  return (
    <header className="z-[999] sticky top-0 bg-emerald-200 backdrop-blur-lg">
      <div className="flex items-center justify-between py-2 px-2 md:px-4">

        {/* LEFT SECTION */}
        <div className="flex items-center gap-3">

          {/* Mobile Sidebar Toggle */}
          {/* <button
            onClick={handleToggle}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-md
              border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600"
          >
            {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button> */}

          {/* Logo (Adaptive) */}
          <Link to="/" className="flex items-center">
            <img
              src={FullLogo}
              alt="logo"
              className="hidden md:block h-8"
            />
            <img
              src={Logo}
              alt="logo"
              className="md:hidden h-8"
            />
          </Link>
        </div>

        {/* MIDDLE SECTION (Desktop Search) */}
        <div className="hidden md:flex items-center w-[380px] xl:w-[420px]">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />


            <input
              ref={inputRef}
              type="text"
              placeholder="Search or type command..."
              className="w-full h-10 rounded-sm border border-emerald-300/50 bg-emerald-100/60 pl-12 pr-14 text-sm text-emerald-900
    placeholder:text-emerald-700/60 outline-none shadow-sm  hover:border-emerald-400 focus:border-emerald-500 
    focus:ring-2 focus:ring-emerald-400/30  transition-all duration-200  dark:bg-gray-900 
    dark:border-emerald-700/60  dark:text-white  dark:placeholder:text-emerald-200/60  dark:focus:border-emerald-500
    dark:focus:ring-emerald-400/30
  "
            />
            <button
              type="button"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 px-2 py-[3px] text-xs rounded border 
              bg-emerald-100 text-emerald-600 border-emerald-300 dark:bg-emerald-800 dark:border-emerald-700 dark:text-emerald-300"
            >
              ⌘ K
            </button>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-2 md:gap-3">

          {/* Mobile Search Icon */}
          <button
            className="md:hidden p-2 rounded-lg text-emerald-600"
            onClick={() => setShowMobileSearch(!showMobileSearch)}
          >
            <Search size={20} />
          </button>

          {/* Notification */}
          <NotificationDropdown />

          {/* User Menu */}
          <UserDropdown />
        </div>
      </div>

      {/* MOBILE SEARCH BAR */}
      {showMobileSearch && (
        <div className="md:hidden px-3 pb-3">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />

            <input
              ref={inputRef}
              type="text"
              placeholder="Search or type command..."
              className="w-full h-10 rounded-sm border border-emerald-300/50 bg-emerald-100/60 pl-12 pr-14 text-sm text-emerald-900
    placeholder:text-emerald-700/60 outline-none shadow-sm  hover:border-emerald-400 focus:border-emerald-500 
    focus:ring-2 focus:ring-emerald-400/30  transition-all duration-200  dark:bg-gray-900 
    dark:border-emerald-700/60  dark:text-white  dark:placeholder:text-emerald-200/60  dark:focus:border-emerald-500
    dark:focus:ring-emerald-400/30
  "
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default AppHeader;
