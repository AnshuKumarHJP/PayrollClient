import React, { useEffect, useState, useMemo, memo, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import AppIcon from "../Component/AppIcon";
import useScreen from "../Hooks/useScreen";
import { buildMenuTree, removeEmptyGroups, cleanupRedundantNodes } from "../services/menuUtils";
import { setISMenuOpen } from "../Store/Slices/GlobalSlice";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../Library/tooltip";
import { useMappedForms } from "../Hooks/useMappedForms";
import { SkeletonSidebar } from "../Skeleton/Skeletons";

/* =====================================================
   HELPER COMPONENTS
   ===================================================== */

const MenuItem = memo(({
  item,
  level = 0,
  openMenus,
  toggleMenu,
  isRouteActive,
  navigate,
  dispatch,
  onItemClick,
  isMobile,
  isSidebarOpen,
  searchQuery
}) => {
  const showLabel = (isMobile && isSidebarOpen) || (!isMobile && !isSidebarOpen);

  if (item.type === "divider") {
    if (!showLabel) return <div className="h-px bg-slate-200 dark:bg-slate-800 my-2 mx-4 opacity-50" />;
    return (
      <div className="px-4 py-2 mt-4 mb-1">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500">
          {item.label}
        </span>
      </div>
    );
  }

  const hasChildren = item.children?.length > 0;
  const isOpen = openMenus[item.id];
  const isActive = isRouteActive(item.route) || item.children?.some((c) => isRouteActive(c.route));

  const handleItemClick = () => {
    if (hasChildren) {
      toggleMenu(item.id);
    } else {
      navigate(item.route);
      if (isMobile) {
        dispatch(setISMenuOpen(false));
        onItemClick?.();
      }
    }
  };

  const getLabel = () => {
    if (!searchQuery) return item.label;
    const regex = new RegExp(`(${searchQuery})`, "gi");
    return item.label.replace(regex, '<mark class="bg-amber-300 dark:bg-yellow-800 text-inherit px-0 rounded-sm">$1</mark>');
  };

  return (
    <div>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            style={{ marginLeft: `${Math.min(level * 8, 24)}px` }}
            onClick={handleItemClick}
            className={`w-full flex items-center justify-between p-2.5 text-sm transition-all rounded-lg
                ${isActive
                ? level === 0
                  ? "bg-primary-500 text-white font-bold shadow-md shadow-primary-500/20"
                  : "text-primary-500 dark:text-primary-200 relative before:absolute before:left-0 before:top-1 before:bottom-1 before:w-1 before:bg-primary-500 px-3"
                : "text-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800"
              }`}
          >
            <div className="flex items-center gap-3">
              <AppIcon name={item.icon} className={level === 0 ? "w-5 h-5" : "w-4 h-4"} />
              {showLabel && (
                <span dangerouslySetInnerHTML={{ __html: getLabel() }} />
              )}
            </div>
            {showLabel && hasChildren && (
              <AppIcon name="ChevronDown" className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            )}
          </button>
        </TooltipTrigger>
        {!showLabel && <TooltipContent side="right">{item.label}</TooltipContent>}
      </Tooltip>

      {hasChildren && isOpen && (
        <div className="space-y-1 mt-1">
          {item.children.map((child) => (
            <MenuItem
              key={child.id}
              item={child}
              level={level + 1}
              openMenus={openMenus}
              toggleMenu={toggleMenu}
              isRouteActive={isRouteActive}
              navigate={navigate}
              dispatch={dispatch}
              onItemClick={onItemClick}
              isMobile={isMobile}
              isSidebarOpen={isSidebarOpen}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      )}
    </div>
  );
});

/* =====================================================
   MAIN COMPONENT
   ===================================================== */

const SidebarMenu = memo(({ onItemClick, searchQuery = "" }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { isMobile } = useScreen();

  const { forms: dynamicForms } = useMappedForms();

  // Selectors
  const isSidebarOpen = useSelector((state) => state.GlobalStore.isSidebarOpen);
  const selectedRole = useSelector((state) => state.Auth?.Common?.SelectedRole);
  const AUTH_DATA = useSelector((state) => state.Auth.LogResponce?.data);
  const isLoading = useSelector((state) => state.GlobalStore.isLoading);

  const CurrentUserRole = useMemo(() => AUTH_DATA?.UIRoles || [], [AUTH_DATA]);
  const activeRole = useMemo(() => selectedRole || CurrentUserRole[0]?.Role?.Code, [selectedRole, CurrentUserRole]);
  const ModuleCode = "APPI_PAYROLL";

  // Menu Logic
  const menu = useMemo(() => {
    if (!CurrentUserRole.length || !activeRole) return [];

    const roleObj = CurrentUserRole.find(r => r?.Role?.Code === activeRole);
    if (!roleObj?.WebMenuItemList) return [];

    const rootMenus = roleObj.WebMenuItemList.filter(
      m => m.ModuleCode === ModuleCode && m.IsVisible === true
    );

    // 1. Build initial tree structure from backend
    const rawTree = buildMenuTree(rootMenus);

    /**
     * Dynamically injects forms as children of menus with matching labels.
     */
    const injectForms = (items) => items.map(item => {
      // Recursively process children first
      const children = item.children ? injectForms(item.children) : [];

      // Find dynamic forms that belong to this menu label
      const matchedForms = dynamicForms.filter(f => f.ModuleLabel === item.label);

      return {
        ...item,
        children: [...children, ...matchedForms]
      };
    });

    // 2. Inject dynamic forms into the tree
    const treeWithForms = injectForms(rawTree);

    // 3. Clean up: remove empty groups (those with no route and no children)
    const cleanedTree = removeEmptyGroups(treeWithForms);

    // 4. Final normalization
    return cleanupRedundantNodes(cleanedTree);
  }, [CurrentUserRole, activeRole, dynamicForms, ModuleCode]);

  // Search & Filter
  const filteredMenu = useMemo(() => {
    if (!searchQuery) return menu;
    const lowerQuery = searchQuery.toLowerCase();

    const filterTree = (items) => {
      return items.map((item) => {
        const children = item.children || [];
        const filteredChildren = filterTree(children);
        const nameMatch = item.label?.toLowerCase().includes(lowerQuery);
        if (nameMatch || filteredChildren.length > 0) {
          return { ...item, children: filteredChildren };
        }
        return null;
      }).filter(Boolean);
    };
    return filterTree(menu);
  }, [menu, searchQuery]);

  const [openMenus, setOpenMenus] = useState({});

  // Auto-expand Logic
  useEffect(() => {
    if (!menu.length) return;

    const openState = {};
    if (searchQuery) {
      const expandAll = (items) => items.forEach(i => {
        if (i.children?.length) {
          openState[i.id] = true;
          expandAll(i.children);
        }
      });
      expandAll(filteredMenu);
    } else {
      const walk = (items) => items.forEach(i => {
        if (i.children?.some(c => c.route && location.pathname.startsWith(c.route))) {
          openState[i.id] = true;
        }
        if (i.children?.length) walk(i.children);
      });
      walk(menu);
    }
    setOpenMenus(openState);
  }, [location.pathname, menu, searchQuery, filteredMenu]);

  // Handlers
  const toggleMenu = useCallback((id) => setOpenMenus(p => ({ ...p, [id]: !p[id] })), []);

  const isRouteActive = useCallback((route) => {
    if (!route) return false;

    try {
      if (route.includes("?")) {
        const [path, search] = route.split("?");
        if (location.pathname !== path) return false;

        const params = new URLSearchParams(location.search);
        const searchParams = new URLSearchParams(search);

        // Ensure all params in the route match the current URL
        for (const [key, value] of searchParams.entries()) {
          if (params.get(key) !== value) return false;
        }
        return true;
      }

      // For exact path matches (like /dashboard), we often want to ensure no query params
      // unless the route itself has them.
      return location.pathname === route;
    } catch (e) {
      return false;
    }
  }, [location.pathname, location.search]);

  if (isLoading) return <SkeletonSidebar items={6} />;
  if (filteredMenu.length === 0) return <div className="p-4 text-center text-gray-500 text-sm">No menu available</div>;

  return (
    <TooltipProvider delayDuration={0}>
      <div className="w-full space-y-1">
        <nav className="space-y-1 w-full px-1">
          {filteredMenu.map((item) => (
            <MenuItem
              key={item.id}
              item={item}
              openMenus={openMenus}
              toggleMenu={toggleMenu}
              isRouteActive={isRouteActive}
              navigate={navigate}
              dispatch={dispatch}
              onItemClick={onItemClick}
              isMobile={isMobile}
              isSidebarOpen={isSidebarOpen}
              searchQuery={searchQuery}
            />
          ))}
        </nav>
      </div>
    </TooltipProvider>
  );
});

export default SidebarMenu;