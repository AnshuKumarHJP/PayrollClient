import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import AppIcon from "../Component/AppIcon";
import { cn } from "../Library/utils"

const ACTIVE_COLOR = "#9747FF";

const DesktopMenu = ({ menu }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  /* -----------------------------
     ACTIVE HELPERS
     ----------------------------- */
  const isActive = (item) => {
    if (item.link && location.pathname === item.link) return true;

    if (item.children?.length) {
      return item.children.some(
        (child) => child.link === location.pathname
      );
    }
    return false;
  };

  /* -----------------------------
     ANIMATIONS
     ----------------------------- */
  const dropdownVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.15 } },
    exit: { opacity: 0, transition: { duration: 0.12 } },
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.12 } },
  };

  /* -----------------------------
     RENDER
     ----------------------------- */
  return (
    <div className="flex items-center gap-6">
      {menu?.map((item, index) => {
        const hasChildren = item.children?.length > 0;
        const active = isActive(item);
        const isOpen = openMenu === item.label;

        return (
          <div
            key={index}
            className="relative group"
            onMouseEnter={() => setOpenMenu(item.label)}
            onMouseLeave={() => setOpenMenu(null)}
            onClick={() => {
              if (item.link) navigate(item.link);
            }}
          >
            {/* =====================
               MAIN MENU ITEM
               ===================== */}
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ duration: 0.15 }}
              className={cn(
                `
                relative flex items-center gap-2
                text-sm font-medium whitespace-nowrap
                transition-colors
                `,
                active
                  ? "text-primary-500"
                  : "text-gray-700 hover:text-primary-500"
              )}
            >
              <AppIcon name={item.icon} size={16}/>
              <span>{item.label}</span>

              {/* SUBMENU INDICATOR */}
              {hasChildren && (
                <span className="ml-0.5 flex items-center">
                  {isOpen ? (
                    <AppIcon name={"ChevronUp"}
                      size={14}
                      strokeWidth={2.5}
                      className={active ? "text-primary-500" : ""}
                    />
                  ) : (
                    <AppIcon name={"ChevronDown"}
                      size={14}
                      strokeWidth={2.5}
                      className="opacity-70"
                    />
                  )}
                </span>
              )}

              {/* ACTIVE UNDERLINE */}
              <span
                className={cn(
                  `
                  absolute -bottom-2 left-0
                  h-[2px] rounded-full
                  bg-primary-500
                  transition-all duration-300
                  `,
                  active
                    ? "w-full opacity-100"
                    : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                )}
              />
            </motion.button>

            {/* =====================
               SUB MENU
               ===================== */}
            <AnimatePresence>
              {hasChildren && isOpen && (
                <motion.div
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  variants={dropdownVariants}
                  className="
                    absolute w-[650px]
                    top-full left-1/2 -translate-x-1/2
                    mt-4
                    bg-white
                    backdrop-blur-xl
                    border border-stroke-gray-300
                    rounded-lg
                    shadow-md
                    p-4
                    z-50
                  "
                >
                  <div className="grid grid-cols-2 gap-3">
                    {item.children.map((sub, i) => {
                      const subActive =
                        location.pathname === sub.link;

                      return (
                        <motion.div key={i} variants={itemVariants}>
                          <Link
                            to={sub.link}
                            className={cn(
                              `
                              flex items-center gap-4 p-3 rounded-md
                              transition-all 
                              `,
                              subActive
                                ? "bg-primary-50 ring-1 ring-primary-500"
                                : "bg-gray-50/90 hover:bg-primary-50"
                            )}
                          >
                            {/* ICON */}
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              transition={{ duration: 0.15 }}
                              className={cn(
                                `
                                w-8 h-8 flex items-center justify-center
                                rounded-md
                                `,
                                subActive
                                  ? "bg-primary-500/10 text-primary-500"
                                  : "bg-primary-50 text-primary-500"
                              )}
                            >
                              <AppIcon name={item.icon} size={20} />
                            </motion.div>

                            {/* TEXT */}
                            <div className="flex-1">
                              <p
                                className={cn(
                                  "text-sm font-medium",
                                  subActive
                                    ? "text-primary-500"
                                    : "text-gray-800"
                                )}
                              >
                                {sub.label}
                              </p>
                              <p className="text-xs text-gray-500">
                                {sub?.description ??
                                  "Latest updates and insights"}
                              </p>
                            </div>

                            {/* ARROW */}
                            <AppIcon name="MoveRight"
                              size={16}
                              className={cn(
                                subActive
                                  ? "text-primary-500"
                                  : "text-primary-500"
                              )}
                            />
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default DesktopMenu;
