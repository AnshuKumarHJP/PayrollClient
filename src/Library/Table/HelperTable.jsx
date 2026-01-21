// HelperTable.jsx

export const TABLE_BG = {
  header: "bg-gray-200",
  body: "bg-white",
};

/*
Z-INDEX STRATEGY
--------------------------------
Header sticky (L/R) : z-40
Body sticky (L/R)   : z-30
Normal header       : z-20
--------------------------------
*/

export const stickyHeaderClass = (col) => {
  if (col?.sticky === "left")
    return `sticky z-40 ${TABLE_BG.header} border-r border-gray-300`;

  if (col?.sticky === "right")
    return `sticky z-40 ${TABLE_BG.header} border-l border-gray-300`;

  return `${TABLE_BG.header} z-20 border-r border-gray-300`;
};

export const stickyBodyClass = (col) => {
  if (col?.sticky === "left")
    return `sticky z-30 ${TABLE_BG.body} border-r border-gray-300`;

  if (col?.sticky === "right")
    return `sticky z-30 ${TABLE_BG.body} border-l border-gray-300`;

  return "border-r border-gray-200";
};

export const stickySystemHeaderCol =
  `sticky z-40 ${TABLE_BG.header} border-r border-gray-300`;

export const stickySystemBodyCol =
  `sticky z-30 ${TABLE_BG.body} border-r border-gray-300`;
