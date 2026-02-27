/* =====================================================
   services/menuUtils.js
   BACKEND MENU NORMALIZATION (DISPLAYORDER = 0 → LAST)
   ===================================================== */

/**
 * Rule:
 * - DisplayOrder === 0 → ALWAYS pushed to the END
 * - Non-zero DisplayOrder → normal ascending sort
 * - Tie breaker → MenuName
 */

const sortByDisplayOrder = (a, b) => {
  const aOrder = a.DisplayOrder ?? 0;
  const bOrder = b.DisplayOrder ?? 0;

  // ⬇️ BOTH ZERO → alphabetical
  if (aOrder === 0 && bOrder === 0) {
    return a.MenuName.localeCompare(b.MenuName);
  }

  // ⬇️ ONLY A ZERO → A GOES LAST
  if (aOrder === 0) return 1;

  // ⬇️ ONLY B ZERO → B GOES LAST
  if (bOrder === 0) return -1;

  // ⬇️ NORMAL SORT
  if (aOrder !== bOrder) return aOrder - bOrder;

  return a.MenuName.localeCompare(b.MenuName);
};

/* =====================================================
   BUILD TREE
   ===================================================== */
export const buildMenuTree = (menus = []) => {
  return menus
    .filter((m) => m.IsVisible === true)
    .sort(sortByDisplayOrder)
    .map((m, index) => ({
      id: `${m.MenuName}-${index}`,
      label: m.MenuName,
      route: m.Route || null,
      icon: m.Icon || (m.Route ? "Dot" : "Folder"),
      module: m.ModuleCode,
      order: m.DisplayOrder,
      children: m.ChildMenuItems?.length
        ? buildMenuTree(m.ChildMenuItems)
        : [],
    }));
};

/* =====================================================
   REMOVE EMPTY GROUPS
   ===================================================== */
export const removeEmptyGroups = (menus = []) => {
  return menus
    .map((m) => ({
      ...m,
      children: removeEmptyGroups(m.children),
    }))
    .filter((m) => m.route || m.children.length > 0);
};

/* =====================================================
   CLEAN DUPLICATES
   ===================================================== */
export const cleanupRedundantNodes = (menus = []) => {
  return menus.map((menu) => {
    const cleanedChildren = menu.children.filter(
      (child) =>
        !(
          child.label === menu.label &&
          !child.route &&
          child.children.length === 0
        )
    );

    return {
      ...menu,
      children: cleanupRedundantNodes(cleanedChildren),
    };
  });
};

/* =====================================================
   FINAL MENU
   ===================================================== */
export const buildFinalMenu = (backendMenus = []) => {
  const tree = buildMenuTree(backendMenus);
  const cleaned = removeEmptyGroups(tree);
  return cleanupRedundantNodes(cleaned);
};
