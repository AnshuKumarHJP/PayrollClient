import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppIcon from "../Component/AppIcon";
import AngleSVG from "../Image/blob-haikei.svg";

// ⭐ SAFE Fade Animation (NO scale, NO movement)
import { motion, AnimatePresence } from "framer-motion";

const DesktopMenu = ({ menu }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();

  // Fade only — prevents submenu shifting or going out
  const dropdownVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { duration: 0.15 }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.12 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { duration: 0.12 } }
  };

  return (
    <div className="flex items-center gap-6">
      {menu?.map((item) => (
        <div
          key={item.id}
          className="relative group"
          onMouseEnter={() => setOpenMenu(item.id)}
          onMouseLeave={() => setOpenMenu(null)}
          onClick={() => {
            setOpenMenu(item.id);
            if (item.link) navigate(item.link);
          }}
        >
          {/* MAIN MENU BUTTON */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="text-sm cursor-pointer flex items-center gap-1 font-medium text-emerald-800 hover:text-emerald-900 whitespace-nowrap"
          >
            <AppIcon name={item.icon} />
            {item.label}
            {item.children && <AppIcon name="ChevronDown" />}
          </motion.button>

          {/* SUBMENU */}
          <AnimatePresence>
            {item.children && openMenu === item.id && (
              <>
                {/* ARROW TOP */}
                <span className="absolute top-1 right-0 rotate-90">
                  <img src={AngleSVG} alt="arrow" className="h-14" />
                </span>

                {/* DROPDOWN PANEL — NO POSITION CHANGE */}
                <motion.div
                  key="submenu"
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  variants={dropdownVariants}
                  className="
                    absolute w-[650px] top-full left-1/2 -translate-x-1/2
                    mt-4 bg-emerald-200 backdrop-blur-xl rounded-sm 
                    shadow-md p-4 z-50
                  "
                >
                  <div className="grid grid-cols-2 gap-3">
                    {item.children.map((sub) => (
                      <motion.div key={sub.id} variants={itemVariants}>
                        <Link
                          to={sub.link}
                          className="
                            w-[300px] flex items-center gap-4 bg-white p-2 
                            rounded-md shadow-sm hover:bg-emerald-50 
                            transition-all
                          "
                        >
                          {/* ICON */}
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.15 }}
                            className="
                              w-8 h-8 flex items-center justify-center 
                              rounded-xl bg-emerald-100 text-emerald-700
                            "
                          >
                            <AppIcon name={item.icon} size={22} />
                          </motion.div>

                          {/* TEXT */}
                          <div className="flex-1">
                            <p className="font-semibold text-sm text-emerald-900">
                              {sub.label}
                            </p>
                            <p className="text-xs text-emerald-700/80">
                              {sub?.description ??
                                "Latest updates and insights"}
                            </p>
                          </div>

                          {/* ARROW */}
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="text-emerald-700"
                          >
                            <AppIcon name="MoveRight" />
                          </motion.div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default DesktopMenu;
