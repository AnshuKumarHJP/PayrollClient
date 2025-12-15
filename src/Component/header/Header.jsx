import { useState } from "react";
import { Link } from "react-router";
import { ThemeToggleButton } from "../common/ThemeToggleButton";
import NotificationDropdown from "./NotificationDropdown";
import UserDropdown from "./UserDropdown";

const Header = ({ onClick, onToggle }) => {
  const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);

  const toggleApplicationMenu = () => {
    setApplicationMenuOpen(!isApplicationMenuOpen);
  };

  return (
    <header className="sticky top-0 flex w-full bg-white border-gray-200 z-99999 dark:border-gray-800 dark:bg-gray-900 lg:border-b">
      <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
        
        {/* LEFT SECTION */}
        <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 
          sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">

          {/* Mobile Hamburger */}
          <button
            className="block w-10 h-10 text-gray-500 lg:hidden dark:text-gray-400"
            onClick={onToggle}
          >
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.583252 1C0.583252 0.585788..."
                fill="currentColor"
              />
            </svg>
          </button>

          {/* Desktop Sidebar Toggle */}
          <button
            onClick={onClick}
            className="hidden lg:flex items-center justify-center w-10 h-10 
              text-gray-500 border-gray-200 rounded-lg dark:border-gray-800 
              dark:text-gray-400 lg:h-11 lg:w-11 lg:border"
          >
            <svg className="hidden lg:block" width="16" height="12" viewBox="0 0 16 12" fill="none">
              <path d="M0.583252 1C0.583252..." fill="currentColor" />
            </svg>
          </button>

          {/* Mobile Logo */}
          <Link to="/" className="lg:hidden">
            <img className="dark:hidden" src="./images/logo/logo.svg" alt="Logo" />
            <img className="hidden dark:block" src="./images/logo/logo-dark.svg" alt="Logo" />
          </Link>

          {/* Mobile Menu Dots */}
          <button
            onClick={toggleApplicationMenu}
            className="flex items-center justify-center w-10 h-10 text-gray-700 
            rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
          >
            <svg width="24" height="24" fill="none">
              <path d="M5.99902 10.4951C6.82745..." fill="currentColor" />
            </svg>
          </button>

          {/* Desktop Search */}
          <div className="hidden lg:block">
            <form>
              <div className="relative">
                <button className="absolute left-4 top-1/2 -translate-y-1/2">
                  <svg width="20" height="20" className="fill-gray-500 dark:fill-gray-400">
                    <path d="M3.04175 9.37363..." />
                  </svg>
                </button>

                <input
                  type="text"
                  placeholder="Search or type command..."
                  className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 
                    bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 
                    placeholder:text-gray-400 shadow-theme-xs 
                    dark:border-gray-800 dark:bg-gray-900 
                    dark:text-white/90 dark:placeholder:text-white/30 
                    xl:w-[430px]"
                />

                <button className="absolute right-2.5 top-1/2 -translate-y-1/2 
                  inline-flex items-center gap-0.5 rounded-lg border border-gray-200 
                  bg-gray-50 px-[7px] py-[4.5px] text-xs text-gray-500 
                  dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
                  <span>⌘</span>
                  <span>K</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div
          className={`${
            isApplicationMenuOpen ? "flex" : "hidden"
          } items-center justify-between w-full gap-4 px-5 py-4 
            lg:flex lg:justify-end lg:px-0`}
        >
          <div className="flex items-center gap-2">
            <ThemeToggleButton />
            <NotificationDropdown />
          </div>

          <UserDropdown />
        </div>
      </div>
    </header>
  );
};

export default Header;
