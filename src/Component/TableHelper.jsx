// =============================================================
//  TABLE HELPER UTILITIES  (FINAL MERGED VERSION)
// =============================================================

 /* ---------------- NORMALIZE VALUE ---------------- */
export const normalizeValue = (value) => {
  if (value === null || value === undefined) return "";

  // date
  if (value instanceof Date) return value.getTime();

  // numeric string → number
  if (typeof value === "string" && !isNaN(value)) {
    return Number(value);
  }

  // boolean
  if (typeof value === "boolean") {
    return value ? 1 : 0;
  }

  // string (case-insensitive)
  if (typeof value === "string") {
    return value.toLowerCase();
  }

  return value;
};


// -------------------------------------------------------------
// LEFT sticky offsets
// -------------------------------------------------------------
export const computeLeftOffsets = (columns, showIndex) => {
  let offsets = [];
  let left = showIndex ? 56 : 0;

  columns.forEach((col) => {
    offsets.push(left);

    if (col.sticky) {
      const w = col.width || col.minWidth || 120;
      left += w;
    }
  });

  return offsets;
};

// -------------------------------------------------------------
// RIGHT sticky offsets
// -------------------------------------------------------------
export const computeRightOffsets = (columns) => {
  let offsets = [];
  let right = 0;

  [...columns].reverse().forEach((col) => {
    offsets.unshift(right);

    if (col.stickyRight) {
      const w = col.width || col.minWidth || 140;
      right += w;
    }
  });

  return offsets;
};

// -------------------------------------------------------------
// COLUMN STYLE BUILDER (CORRECTED)
// -------------------------------------------------------------
export const getColStyle = (
  col,
  index,
  leftOffsets,
  isSmall,
  rightOffsets,
  isHeader = false
) => {
  const width = col.width || col.minWidth || undefined;

  const style = {
    width: width ? `${width}px` : "auto",
    minWidth: col.minWidth ? `${col.minWidth}px` : "auto",
    maxWidth: col.width ? `${col.width}px` : "none",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    position: (col.sticky || col.stickyRight) ? "sticky" : "relative",
    zIndex: (col.sticky || col.stickyRight) ? 30 : 1,
    padding: "10px"
  };

  // ⭐ FIX: Only body sticky cells forced white
  if (col.sticky || col.stickyRight) {
    style.background = isHeader ? undefined : "#fff";
  }

  // Left sticky
  if (col.sticky) {
    if (!isSmall) {
      style.left = `${leftOffsets[index]}px`;
      style.boxShadow = "2px 0 4px rgba(0,0,0,0.08)";
    } else {
      style.position = "relative";
      style.left = "unset";
      style.boxShadow = "none";
    }
  }

  // Right sticky
  if (col.stickyRight) {
    if (!isSmall) {
      style.right = `${rightOffsets[index]}px`;
      style.boxShadow = "-2px 0 4px rgba(0,0,0,0.08)";
    } else {
      style.position = "relative";
      style.right = "unset";
      style.boxShadow = "none";
    }
  }

  return style;
};

// -------------------------------------------------------------
// TEXT ELLIPSIS WRAPPER
// -------------------------------------------------------------
export const EllipsisCell = ({ width = 150, children }) => (
  <div
    style={{
      maxWidth: width,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }}
    title={String(children)}
  >
    {children}
  </div>
);

// -------------------------------------------------------------
// RESIZE HANDLE
// -------------------------------------------------------------
export const ResizeHandle = ({ onMouseDown }) => (
  <div
    onMouseDown={onMouseDown}
    style={{
      position: "absolute",
      right: 0,
      top: 0,
      width: "6px",
      cursor: "col-resize",
      height: "100%",
      zIndex: 100
    }}
  />
);
