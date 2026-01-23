import { useDispatch } from "react-redux";
import { setISMenuOpen } from "../Store/Slices/GlobalSlice";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import FullLogo from "../Image/hfactor-logo-dark.png";
import AppIcon from "../Component/AppIcon";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "../Library/utils"

const ACTIVE_COLOR = "#9747FF";

const MobileMenu = ({ menu }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [openMenu, setOpenMenu] = useState(null);

  const closeMenu = () => dispatch(setISMenuOpen(false));

  /* ---------------- ACTIVE HELPERS ---------------- */
  const isActive = (item) => {
    if (item.link && location.pathname === item.link) return true;
    if (item.children?.length) {
      return item.children.some(
        (child) => child.link === location.pathname
      );
    }
    return false;
  };

  const handleMenuClick = (item) => {
    if (item.children?.length) {
      setOpenMenu(openMenu === item.label ? null : item.label);
    } else if (item.link) {
      navigate(item.link);
      closeMenu();
    }
  };

  /* ---------------- ANIMATIONS ---------------- */
  const submenuVariants = {
    hidden: { height: 0, opacity: 0 },
    show: {
      height: "auto",
      opacity: 1,
      transition: { duration: 0.25 },
    },
    exit: {
      height: 0,
      opacity: 0,
      transition: { duration: 0.2 },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.25 }}
      className="
        bg-white
        border border-stroke-gray-300
        rounded-2xl
        shadow-md
        p-4
        mt-2
      "
    >
      {/* HEADER */}
      <div className="flex items-center justify-between mb-3">
        <img src={FullLogo} className="h-8" alt="logo" />
        <AppIcon
          name="X"
          className="cursor-pointer text-gray-600"
          onClick={closeMenu}
        />
      </div>

      {/* MENU LIST */}
      <div className="space-y-1">
        {menu.map((item) => {
          const hasChildren = item.children?.length > 0;
          const isOpen = openMenu === item.label;
          const active = isActive(item);

          return (
            <div key={item.label}>
              {/* MAIN MENU */}
              <button
                onClick={() => handleMenuClick(item)}
                className={cn(
                  `
                  w-full flex items-center justify-between
                  px-3 py-2 rounded-lg
                  transition-colors
                  `,
                  active
                    ? "text-[color:#9747FF] bg-primary-50"
                    : "text-gray-700 hover:bg-light-gray-100"
                )}
              >
                <div className="flex items-center gap-2 text-p11 font-medium">
                  <AppIcon name={item.icon} size={16} />
                  <span>{item.label}</span>
                </div>

                {hasChildren && (
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      active
                        ? "text-[color:#9747FF]"
                        : "text-gray-500"
                    )}
                  >
                    <ChevronDown size={16} />
                  </motion.div>
                )}
              </button>

              {/* SUB MENU */}
              <AnimatePresence>
                {hasChildren && isOpen && (
                  <motion.div
                    variants={submenuVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    className="
                      ml-4 mt-1
                      flex flex-col gap-1
                      overflow-hidden
                    "
                  >
                    {item.children.map((sub) => {
                      const subActive =
                        location.pathname === sub.link;

                      return (
                        <Link
                          key={sub.label}
                          to={sub.link}
                          onClick={closeMenu}
                          className={cn(
                            `
                            flex items-center gap-2
                            px-3 py-2 rounded-md
                            text-p11
                            transition-colors
                            `,
                            subActive
                              ? "text-[color:#9747FF] bg-primary-50"
                              : "text-gray-600 hover:bg-light-gray-100"
                          )}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-current" />
                          {sub.label}
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default MobileMenu;
