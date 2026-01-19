import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setISMenuOpen } from "../Store/Slices/GlobalSlice";

import FullLogo from "../Image/hfactor-logo-dark.png";
import Logo from "../Image/HFLogo.png";
import AppIcon from "../Component/AppIcon";
import UserDropdown from "../Component/UserDropdown";
import NotificationDropdown from "../Component/NotificationDropdown";

import DesktopMenu from "./DesktopMenu";
import MobileMenu from "./MobileMenu";
import useScreen from "../Hooks/useScreen";
import { useState, useEffect } from "react";

// 🔥 Menu dictionary to map API menu codes → actual UI menu
export const menuData = [
  { id: 1, code: "dashboard", label: "Dashboard", icon: "LayoutGrid", link: "/" },

  {
    id: 2,
    code: "payroll-inputs",
    label: "Payroll Inputs",
    icon: "Users",
    children: [
      { id: 21, code: "input-module", label: "Input Module", link: "/inputs" },
      { id: 23, code: "input-history", label: "Import History", link: "/inputs/history" },
    ],
  },

  { id: 3, code: "employees", label: "Employees", link: "/employee", icon: "IdCardLanyard" },

  { id: 4, code: "configuration", label: "Configuration", link: "/config", icon: "Settings" },

  {
    id: 5,
    code: "verification",
    label: "Verification",
    icon: "Workflow",
    children: [
      { id: 41, code: "workflow-dashboard", label: "Workflow Dashboard", link: "/workflow" },
      { id: 42, code: "task-list", label: "Task List", link: "/workflow/tasks" },
      { id: 43, code: "audit-logs", label: "Audit Logs", link: "/workflow/audit" },
    ],
  },

  {
    id: 6,
    code: "team-operations",
    label: "Team Operations",
    icon: "Users2",
    children: [
      { id: 51, code: "ops-dashboard", label: "Operations Dashboard", link: "/ops/dashboard" },
      { id: 52, code: "unclaimed", label: "Unclaimed Tasks", link: "/ops/unclaimed" },
      { id: 53, code: "actions", label: "Actions", link: "/ops/action" },
      { id: 54, code: "performance", label: "Performance", link: "/ops/performance" },
    ],
  },

  {
    id: 7,
    code: "payroll-processing",
    label: "Payroll Processing",
    icon: "ClipboardList",
    children: [
      { id: 61, code: "run-payroll", label: "Run Payroll", link: "/processing/run" },
      { id: 62, code: "salary-register", label: "Salary Register", link: "/processing/register" },
      { id: 63, code: "payslips", label: "Payslips", link: "/processing/payslips" },
    ],
  },
];


function StickyHeader() {
  const dispatch = useDispatch();
  const { GlobalStore } = useSelector((state) => state);
  const { isMenuOpen } = GlobalStore;
  const LogResponce = useSelector((state) => state.Auth?.LogResponce?.data);
  const CurrentUserRole = LogResponce?.UIRoles || [];
  const selectedRole = useSelector((state) => state.Auth?.Common?.SelectedRole || "");
  const activeRole = selectedRole || (CurrentUserRole.length > 0 ? CurrentUserRole[0].Role.Code : null);
  const [filteredMenu, setFilteredMenu] = useState([]);
  const { isMobile } = useScreen();
  const ModuleCode = "APPI_PAYROLL";


// console.log(LogResponce);

  /* ----------------------------------------------------
🔥 BUILD MENU FROM BACKEND (FILTER + SORT + CHILDREN)
---------------------------------------------------- */
useEffect(() => {
  if (!CurrentUserRole || CurrentUserRole.length === 0) return;
  // 1️⃣ Get Active Role Obj
  const roleObj = CurrentUserRole.find(
    (r) => r?.Role?.Code === activeRole
  );

  if (!roleObj) {
    setFilteredMenu([]);
    return;
  }

  // 2️⃣ Filter backend menu based on:
  // - ModuleCode
  // - IsVisible = true
  // - Order by DisplayOrder
  const moduleMenus = (roleObj.WebMenuItemList || [])
    .filter(
      (m) =>
        m.ModuleCode === ModuleCode &&
        m.IsVisible === true
    )
    .sort((a, b) => a.DisplayOrder - b.DisplayOrder);

  // 3️⃣ Build Menu Tree (Parents + Children)
  const menuTree = moduleMenus
    .filter((m) => !m.ParentMenuId) // only root menus
    .map((parent) => {
      
      // 🔥 Filter and order children
      const childItems = (parent.ChildMenuItems || [])
        .filter((cm) => cm.IsVisible === true)
        .sort((a, b) => a.DisplayOrder - b.DisplayOrder)
        .map((child) => ({
          label: child.MenuName,
          link: child.Route || "#",
          icon: child.Icon || "",
          displayOrder: child.DisplayOrder,
          module: child.ModuleCode,
        }));

      return {
        label: parent.MenuName,
        icon: parent.Icon || "",
        link: parent.Route || "#",
        displayOrder: parent.DisplayOrder,
        module: parent.ModuleCode,
        children: childItems,
      };
    });

  setFilteredMenu(menuTree);

}, [CurrentUserRole, activeRole]);

  // console.log("filteredMenu",filteredMenu);


  return (
    <header className="fixed top-2 left-0 w-full z-50 px-2 md:px-8">
      <div className="
        backdrop-blur-lg bg-emerald-100/10 
        border-2 border-emerald-500 rounded-3xl md:rounded-full 
        shadow-sm px-4 py-2 flex items-center justify-between
      ">

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
          <DesktopMenu menu={filteredMenu} />
        </div>

        <div className="flex items-center gap-3">
          <NotificationDropdown />
          <UserDropdown />
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMobile && isMenuOpen && (
        <MobileMenu menu={filteredMenu} />
      )}
    </header>
  );
}

export default StickyHeader;
