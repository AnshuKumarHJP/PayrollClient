import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useSidebar from "../Hooks/useSidebar";

// Icons
import {
  LayoutGrid,
  UserPlus,
  CalendarCheck,
  Plane,
  HandCoins,
  Receipt,
  Workflow,
  FileSpreadsheet,
  ClipboardList,
  Users,
  ChevronDown,
  MoreHorizontal,
  Upload,
  Settings,
} from "lucide-react";

import FullLogo from "../Image/hfactor-logo-dark.png";
import Logo from "../Image/HFLogo.png";

// ----------------------------------
// PAYROLL MENU
// ----------------------------------

// NOTE: items may use `path` or `link` and subItems may use `path` too.
// The rendering logic below treats either property as the route target.
export const navItems = [
  {
    icon: <LayoutGrid size={20} />,
    name: "Dashboard",
    link: "/",
  },
  {
    name: "Payroll Inputs",
    icon: <Users size={20} />,
    subItems: [
      { name: "Input Module", path: "/inputs", pro: false },
      { name: "Import History", path: "/inputs/history", pro: false },
    ],
  },
  {
    name: "Configuration",
    icon: <Settings size={20} />,
    // top-level link (no subItems) — use `link` or `path`
    link: "/config",
  },
  {
    name: "Verification Workflow",
    icon: <Workflow size={20} />,
    subItems: [
      { name: "Workflow Dashboard", path: "/workflow", pro: false },
      { name: "Task List", path: "/workflow/tasks", pro: false },
      { name: "Audit Log", path: "/workflow/audit", pro: false },
    ],
  },
  {
    name: "Team Operations",
    icon: <Users size={20} />,
    subItems: [
      { name: "Dashboard", path: "/ops/dashboard", pro: false },
      { name: "Unclaimed Tasks", path: "/ops/unclaimed", pro: false },
      { name: "Task Actions", path: "/ops/action", pro: false },
      { name: "Performance View", path: "/ops/performance", pro: false },
    ],
  },
  {
    name: "Payroll Processing",
    icon: <ClipboardList size={20} />,
    subItems: [
      { name: "Run Payroll", path: "/processing/run", pro: false },
      { name: "Salary Register", path: "/processing/register", pro: false },
      { name: "Payslips", path: "/processing/payslips", pro: false },
    ],
  },
];

// ----------------------------------
// Sidebar Component
// ----------------------------------

const AppSidebar = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();

  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [subMenuHeight, setSubMenuHeight] = useState({});
  const subMenuRefs = useRef({});

  // helpers to get path for item (support both `path` and `link`)
  const getItemPath = (item) => item?.path ?? item?.link ?? null;

  const isActive = useCallback(
    (path) => {
      if (!path) return false;
      return location.pathname === path;
    },
    [location.pathname]
  );

  // Auto-open active submenu if any of its subitems match current path
  useEffect(() => {
    let found = null;
    navItems.forEach((nav, index) => {
      if (nav.subItems && Array.isArray(nav.subItems)) {
        for (const sub of nav.subItems) {
          const subPath = getItemPath(sub);
          if (subPath && isActive(subPath)) {
            found = index;
            break;
          }
        }
      }
    });

    if (found !== null) {
      setOpenSubmenu({ type: "main", index: found });
    }
  }, [location.pathname, isActive]);

  // Auto height animation for the opened submenu
  useEffect(() => {
    if (openSubmenu) {
      const key = `main-${openSubmenu.index}`;
      const el = subMenuRefs.current[key];

      if (el) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: el.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu, fieldsLengthOf(navItems)]); // eslint-disable-line

  // Helper to compute a stable toggle behavior
  const toggleSubmenu = (index) => {
    setOpenSubmenu((prev) =>
      prev?.index === index ? null : { type: "main", index }
    );
  };

  // Render menu items (handles items with subItems OR top-level links)
  const renderMenuItems = (items) => (
    <ul className="flex flex-col gap-2 w-full">
      {items.map((nav, index) => {
        const hasSub = Array.isArray(nav.subItems) && nav.subItems.length > 0;
        const topPath = getItemPath(nav);

        return (
          <li key={nav.name + index}>
            {hasSub ? (
              <button
                onClick={() => toggleSubmenu(index)}
                className={`menu-item ${
                  openSubmenu?.index === index
                    ? "menu-item-active"
                    : "menu-item-inactive"
                }`}
              >
                <span className="menu-item-icon-size">{nav.icon}</span>

                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text text-xs">{nav.name}</span>
                )}

                {(isExpanded || isHovered || isMobileOpen) && (
                  <ChevronDown
                    size={18}
                    className={`ml-auto transition-transform ${
                      openSubmenu?.index === index ? "rotate-180" : ""
                    }`}
                  />
                )}
              </button>
            ) : topPath ? (
              // top-level link (no subItems)
              <Link
                to={topPath}
                className={`menu-item ${
                  isActive(topPath) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span className="menu-item-icon-size">{nav.icon}</span>

                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text text-xs">{nav.name}</span>
                )}
              </Link>
            ) : (
              // No link and no subItems — render disabled button (or simple div)
              <div
                className={`menu-item menu-item-disabled cursor-default opacity-70`}
                title={nav.name}
              >
                <span className="menu-item-icon-size">{nav.icon}</span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text text-xs">{nav.name}</span>
                )}
              </div>
            )}

            {/* Submenu (only render when nav.subItems exists) */}
            {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
              <div
                ref={(el) => (subMenuRefs.current[`main-${index}`] = el)}
                className="overflow-hidden transition-all duration-300"
                style={{
                  height:
                    openSubmenu?.index === index
                      ? `${subMenuHeight[`main-${index}`]}px`
                      : "0px",
                }}
              >
                <ul className="mt-2 ml-9 space-y-1">
                  {nav.subItems.map((sub) => {
                    const subPath = getItemPath(sub);
                    // if subPath missing, render as disabled label
                    return (
                      <li key={sub.name + (subPath ?? Math.random())}>
                        {subPath ? (
                          <Link
                            to={subPath}
                            className={`menu-dropdown-item text-xs ${
                              isActive(subPath) ? "menu-dropdown-item-active" : ""
                            }`}
                          >
                            {sub.name}
                          </Link>
                        ) : (
                          <div className="menu-dropdown-item-disabled text-xs opacity-70">
                            {sub.name}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );

  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen px-3 bg-green-50/60 backdrop-blur-lg dark:bg-green-900/60
        border-r border-green-200 dark:border-green-800 transition-all duration-300 z-[999]
        ${isExpanded || isMobileOpen ? "w-[270px]" : isHovered ? "w-[270px]" : "w-[70px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 lg:mt-0
      `}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo */}
      <div className="py-1 flex">
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <img src={FullLogo} width={150} className="h-10" alt="Full Logo" />
          ) : (
            <img src={Logo} width={32} alt="Logo" />
          )}
        </Link>
      </div>

      {/* Menu */}
      <div className="flex flex-col overflow-y-auto">
        <nav className="mb-6">
          <h2 className="text-xs uppercase text-gray-400 mb-3 flex">
            {isExpanded || isHovered ? "Menu" : <MoreHorizontal size={18} />}
          </h2>

          {renderMenuItems(navItems)}
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;

/**
 * Utility: compute total number of sub-items to trigger submenu height recalculation
 * (keeps dependency stable — optional helper used above)
 */
function fieldsLengthOf(items) {
  try {
    return items.reduce((acc, cur) => acc + (cur.subItems ? cur.subItems.length : 0), 0);
  } catch {
    return 0;
  }
}
