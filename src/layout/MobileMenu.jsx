import { useDispatch } from "react-redux";
import { setISMenuOpen } from "../Store/Slices/GlobalSlice";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import FullLogo from "../Image/hfactor-logo-dark.png";
import Logo from "../Image/HFLogo.png";
import AppIcon from "../Component/AppIcon";

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

  return (
    <div className="bg-emerald-200 rounded-3xl shadow-sm p-4 mt-2">
      <div className="flex justify-between">
        <img src={FullLogo} className="h-8" />
        <AppIcon name="X" onClick={closeMenu} className="cursor-pointer" />
      </div>

      <div className="mt-3">
        {menu.map((item) => {
          const isOpen = openMenu === item.id;

          return (
            <div key={item.id} className="mb-2">
              <button
                onClick={() => handleMenuClick(item)}
                className="flex w-full justify-between p-2 rounded-lg hover:bg-emerald-300">
                
                <div className="flex items-center gap-2 text-[12px]">
                  <AppIcon name={item.icon} className="h-4"/>
                  {item.label}
                </div>

                {item.children && (
                  <AppIcon
                    name="ChevronDown"
                    className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                )}
              </button>

              {isOpen && (
                <div className="ml-6 flex flex-col gap-2 bg-emerald-100 p-2 rounded-lg">
                  {item.children.map((sub) => (
                    <Link
                      key={sub.id}
                      to={sub.link}
                      onClick={closeMenu}
                      className="p-2 rounded-lg hover:bg-emerald-300 text-[12px]">
                      {sub.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default MobileMenu;