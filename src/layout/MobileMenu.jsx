import { useDispatch } from "react-redux";
import { setISMenuOpen } from "../Store/Slices/GlobalSlice";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import FullLogo from "../Image/hfactor-logo-dark.png";
import AppIcon from "../Component/AppIcon";

// ⭐ Animation
import { motion, AnimatePresence } from "framer-motion";

const MobileMenu = ({ menu }) => {
  const dispatch = useDispatch();
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();

  const closeMenu = () => dispatch(setISMenuOpen(false));

  const handleMenuClick = (item) => {
    if (item.children) {
      setOpenMenu(openMenu === item.id ? null : item.id);
    } else if (item.link) {
      navigate(item.link);
      closeMenu();
    }
  };

  // ⭐ Submenu Animation (accordion slide)
  const submenuVariants = {
    hidden: { opacity: 0, height: 0 },
    show: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.25 }
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.25 }}
      className="bg-emerald-200 rounded-3xl shadow-sm p-4 mt-2"
    >
      {/* Header */}
      <div className="flex justify-between">
        <img src={FullLogo} className="h-8" />
        <AppIcon name="X" onClick={closeMenu} className="cursor-pointer" />
      </div>

      {/* Menu List */}
      <div className="mt-3">
        {menu.map((item) => {
          const isOpen = openMenu === item.id;

          return (
            <div key={item.id} className="mb-2">
              {/* MAIN BUTTON */}
              <button
                onClick={() => handleMenuClick(item)}
                className="flex w-full justify-between p-2 rounded-lg hover:bg-emerald-300 transition-all"
              >
                <div className="flex items-center gap-2 text-[12px]">
                  <AppIcon name={item.icon} className="h-4" />
                  {item.label}
                </div>

                {item.children && (
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <AppIcon name="ChevronDown" />
                  </motion.div>
                )}
              </button>

              {/* SUBMENU WITH ANIMATION */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    variants={submenuVariants}
                    initial="hidden"
                    animate="show"
                    exit="exit"
                    className="ml-6 flex flex-col gap-2 bg-emerald-100 p-2 rounded-lg overflow-hidden"
                  >
                    {item.children.map((sub) => (
                      <motion.div
                        key={sub.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link
                          to={sub.link}
                          onClick={closeMenu}
                          className="p-2 rounded-lg hover:bg-emerald-300 text-[12px]"
                        >
                          {sub.label}
                        </Link>
                      </motion.div>
                    ))}
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
