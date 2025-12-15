import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setISMenuOpen } from "../Store/Slices/GlobalSlice";

import FullLogo from "../Image/hfactor-logo-dark.png";
import Logo from "../Image/HFLogo.png";
import AppIcon from "../Component/AppIcon";
import UserDropdown from "../Component/header/UserDropdown";

import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import useScreen from "../Hooks/useScreen";

export const menuData = [
  {
    id: 1,
    label: "Dashboard",
    icon: "LayoutGrid",
    link: "/",
  },
  {
    id: 2,
    label: "Payroll Inputs",
    icon: "Users",
    children: [
      { id: 21, label: "Input Module", link: "/inputs" },
      { id: 23, label: "Import History", link: "/inputs/history" },
    ],
  },
  {
    id: 3,
    label: "Employees",
    link: "/employee",
    icon: "IdCardLanyard",
  },
  {
    id: 4,
    label: "Configuration",
    link: "/config",
    icon: "Settings",
  },
  {
    id: 5,
    label: "Verification",
    icon: "Workflow",
    children: [
      { id: 41, label: "Workflow Dashboard", link: "/workflow" },
      { id: 42, label: "Task List", link: "/workflow/tasks" },
      { id: 43, label: "Audit Logs", link: "/workflow/audit" },
    ],
  },
  {
    id: 6,
    label: "Team Operations",
    icon: "Users2",
    children: [
      { id: 51, label: "Operations Dashboard", link: "/ops/dashboard" },
      { id: 52, label: "Unclaimed Tasks", link: "/ops/unclaimed" },
      { id: 53, label: "Actions", link: "/ops/action" },
      { id: 54, label: "Performance", link: "/ops/performance" },
    ],
  },
  {
    id: 7,
    label: "Payroll Processing",
    icon: "ClipboardList",
    children: [
      { id: 61, label: "Run Payroll", link: "/processing/run" },
      { id: 62, label: "Salary Register", link: "/processing/register" },
      { id: 63, label: "Payslips", link: "/processing/payslips" },
    ],
  },
];
function StickyHeader() {
  const dispatch = useDispatch();
  const { GlobalStore } = useSelector((state) => state);
  const { isMenuOpen } = GlobalStore;

  const { isMobile } = useScreen(); // 👈 AUTO DETECT SCREEN SIZE

  return (
    <header className="fixed top-2 left-0 w-full z-50 px-2 md:px-8">
      <div className="
        backdrop-blur-lg bg-emerald-100/10 
        border-2 border-emerald-500 rounded-3xl md:rounded-full 
        shadow-sm px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {isMobile && (
            <AppIcon
              name="Menu"
              className="text-emerald-700 cursor-pointer block lg:hidden"
              onClick={() => dispatch(setISMenuOpen(true))}
            />
          )}
          {/* LOGO */}
          <Link to="/" className="flex items-center">
            <img src={FullLogo} className="hidden md:block h-8" />
            <img src={Logo} className="md:hidden h-8" />
          </Link>

        </div>
        {/* DESKTOP MENU */}
        <div className="hidden lg:flex">
          <DesktopMenu menu={menuData} />
        </div>

        {/* RIGHT SIDE  */}
        <div className="flex items-center gap-3">
          <AppIcon name="Bell" className="text-emerald-700" />
          {/* MOBILE MENU TRIGGER */}


          <UserDropdown />
        </div>
      </div>

      {/* MOBILE MENU DRAWER */}
      {isMobile && isMenuOpen && (
        <MobileMenu menu={menuData} />
      )}
    </header>
  );
}

export default StickyHeader;