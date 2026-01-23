import React, { useState, useMemo, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../Library/Card";
import Button from "../Library/Button";
import { Input } from "../Library/Input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../Lib/table";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "../Library/DropdownMenu";
import PaginationAdvance from "../Library/Table/PaginationAdvance";
import { motion } from "framer-motion";
import {
  computeLeftOffsets,
  computeRightOffsets,
  getColStyle,
  EllipsisCell,
  ResizeHandle,
  normalizeValue
} from "./TableHelper";
import { Switch } from "../Library/Switch";
import AppIcon from "./AppIcon";
import { Density, DownloadTypes } from "../Data/StaticData";
import DropdownSelect from "./DropdownSelect";
import Tableskeleton from "../Skeleton/Tableskeleton";


/* ---------------- SAFE HELPERS ---------------- */
const safeArray = (v) => (Array.isArray(v) ? v : []);

/* ---------------- READ NESTED ---------------- */
const getValue = (obj, path) =>
  path ? path.split(".").reduce((o, k) => o?.[k], obj) : obj;

/* ---------------- FORMATTER ---------------- */
const formatValue = (v, type) => {
  if (type === "date" && v) return new Date(v).toLocaleString();
  if (type === "boolean") return v ? "Yes" : "No";
  if (type === "number") return Number(v);
  if (Array.isArray(v)) return v.join(", ");
  if (typeof v === "object" && v !== null) return JSON.stringify(v);
  return v === null || v === undefined || v === "" ? "-" : v;
};

const rowAnim = {
  hidden: { opacity: 0, y: 5 },
  show: { opacity: 1, y: 0, transition: { duration: 0.12 } }
};

const AdvanceTable = ({
  title,
  columns = [],
  columnGroups = [],
  data = [],
  renderActions,
  renderActionsWidth = 90,
  stickyRight = false,
  isLoading = false,
  icon,
  showIndex = false
}) => {
  const safeData = useMemo(() => safeArray(data), [data]);
  const [cols, setCols] = useState(columns);
  const [visibleCols, setVisibleCols] = useState(columns.map((c) => c.key));
  const [sortConfig, setSortConfig] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [colFilters, setColFilters] = useState({});
  const [sizeMode, setSizeMode] = useState("normal");

  const [hoveredCol, setHoveredCol] = useState(null); // ⭐ FULL COLUMN HOVER

  const [isSmall, setIsSmall] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const resizing = useRef({
    columnIndex: null,
    startX: 0,
    startWidth: 0
  });

  /* ---------------- SORT TOGGLE ---------------- */
  const toggleSort = (key) => {
    setSortConfig((prev) => {
      if (!prev || prev.key !== key) {
        return { key, direction: "asc" };
      }
      if (prev.direction === "asc") {
        return { key, direction: "desc" };
      }
      return null; // reset (no sort)
    });
  };

  /* ---------------- SORT ROWS ---------------- */
  const sortRows = (rows) => {
    if (!sortConfig) return rows;

    const { key, direction } = sortConfig;

    return [...rows].sort((a, b) => {
      const A = normalizeValue(getValue(a, key));
      const B = normalizeValue(getValue(b, key));

      if (A < B) return direction === "asc" ? -1 : 1;
      if (A > B) return direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  /* ---------------- FILTER ---------------- */
  const filtered = useMemo(() => {
    let rows = [...safeArray(data)];

    if (searchTerm.trim()) {
      const low = searchTerm.toLowerCase();
      rows = rows.filter((r) =>
        cols.some((c) =>
          String(getValue(r, c.key)).toLowerCase().includes(low)
        )
      );
    }

    Object.entries(colFilters).forEach(([key, val]) => {
      if (val.trim().length > 0) {
        const low = val.toLowerCase();
        rows = rows.filter((r) =>
          String(getValue(r, key)).toLowerCase().includes(low)
        );
      }
    });

    return sortRows(rows);
  }, [data, searchTerm, colFilters, sortConfig, cols]);

  /* ---------------- PAGINATION ---------------- */
  const totalPages = Math.ceil(filtered.length / rowsPerPage);
  const pageRows = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filtered.slice(start, start + rowsPerPage);
  }, [filtered, currentPage, rowsPerPage]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages || 1);
  }, [filtered.length, totalPages]);

  useEffect(() => {
    const detect = () =>
      setIsSmall(typeof window !== "undefined" && window.innerWidth < 770);
    detect();
    window.addEventListener("resize", detect);
    return () => window.removeEventListener("resize", detect);
  }, []);

  /* ---------------- RESIZE ---------------- */
  const handleMove = (e) => {
    if (!resizing.current || resizing.current.columnIndex === null) return;

    const diff = e.clientX - resizing.current.startX;
    const newW = resizing.current.startWidth + diff;

    if (newW > 60) {
      setCols((prev) =>
        prev.map((c, i) =>
          i === resizing.current.columnIndex ? { ...c, width: newW } : c
        )
      );
    }
  };

  const stopResize = () => {
    resizing.current = { columnIndex: null, startX: 0, startWidth: 0 };
    document.removeEventListener("mousemove", handleMove);
    document.removeEventListener("mouseup", stopResize);
  };

  const startResize = (e, idx, width) => {
    resizing.current = {
      columnIndex: idx,
      startX: e.clientX,
      startWidth: width || 150
    };
    document.addEventListener("mousemove", handleMove);
    document.addEventListener("mouseup", stopResize);
  };

  /* ---------------- STICKY ---------------- */
  const leftOffsets = computeLeftOffsets(cols, showIndex);
  const rightOffsets = stickyRight
    ? computeRightOffsets(cols)
    : cols.map(() => 0);

  const sizeClass =
    sizeMode === "compact"
      ? "[&_td]:py-1 [&_th]:py-1"
      : sizeMode === "comfortable"
        ? "[&_td]:py-5 [&_th]:py-5"
        : "[&_td]:py-4 [&_th]:py-4";


  const exportFile = (type) => {
    if (type === "excel") return exportExcel();
    if (type === "csv") return exportCSV();
    if (type === "json") return exportJSON();
    if (type === "pdf") return exportPDF();
  };


  /* ---------------- UI ---------------- */
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <Card className="mt-5 border-t-4 border-indigo-300 shadow-md">
        {/* HEADER */}
        <CardHeader className="px-4 py-2">
          {title && (
            <div className="flex items-center gap-2 mb-2">
              <AppIcon name={icon} size={20} />
              <CardTitle>{title}</CardTitle>
            </div>
          )}

          {/* TOP BAR */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Columns */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <AppIcon name="Columns" size={20} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="p-2 max-h-64 overflow-auto">
                  {cols.map((c) => (
                    <DropdownMenuItem
                      key={c.key}
                      className="flex gap-4 items-center justify-between"
                      onClick={() =>
                        setVisibleCols((prev) =>
                          prev.includes(c.key)
                            ? prev.filter((x) => x !== c.key)
                            : [...prev, c.key]
                        )
                      }
                    >
                      {c.label}
                      <Switch size="sm" checked={visibleCols.includes(c.key)} />
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Density */}
              <DropdownSelect
                items={Density}
                triggerIcon="Grid2x2"
                triggerSize={20}
                onSelect={(val) => setSizeMode(val)}
              />
              {/* Export */}
              <DropdownSelect
                items={DownloadTypes}
                triggerIcon="Download"
                triggerSize={18}
                onSelect={(val) => exportFile(val)}   // your function
              />

            </div>

            {/* SEARCH */}
            <div className="flex border px-2 rounded-md w-full sm:w-64 items-center gap-2">
              <AppIcon
                name="Search"
                className="h-4 w-4 text-gray-400 shrink-0"
              />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className=" w-full border-0 outline-none  ring-0  ring-offset-0 shadow-none focus:border-0 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:shadow-none
     focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 bg-transparent "
              />

              {searchTerm && (
                <AppIcon
                  name="X"
                  onClick={() => setSearchTerm("")}
                  className="cursor-pointer"
                  size={14}
                />
              )}
            </div>
          </div>
        </CardHeader>

        {/* TABLE */}
        <CardContent className="px-4">
          {/* 🔥 LOADING STATE */}
          {isLoading && (
            <div className="flex items-center justify-center h-52">
              <Tableskeleton />
            </div>
          )}

          {/* ❌ EMPTY STATE */}
          {!isLoading && safeData.length === 0 && (
            <Tableskeleton />
          )}

          {/* ✅ TABLE */}
          {!isLoading && safeData.length > 0 && (
            <>
              <div className="border rounded-md overflow-x-auto">
                <Table
                  className={`
                text-sm w-full ${sizeClass}
                [&_th]:px-0 [&_td]:px-0
                [&_tbody_tr:nth-child(odd)>td]:bg-gray-50
                [&_tbody_tr:hover>td]:bg-indigo-50
                [&_thead_th]:border-t [&_thead_th]:border-b [&_thead_th]:border-gray-300
                [&_tbody_tr>td]:border-t [&_tbody_tr>td]:border-gray-200
                [&_tbody_tr:not(:last-child)>td]:border-b
                [&_tbody_td]:border-l [&_tbody_td]:border-r [&_tbody_td]:border-gray-200
                [&_thead_th]:border-l [&_thead_th]:border-r [&_thead_th]:border-gray-300
              `}
                >
                  <TableHeader className="bg-indigo-100">
                    {/* GROUP HEADERS */}
                    {columnGroups.length > 0 && (
                      <TableRow>
                        {showIndex && (
                          <TableCell
                            onMouseEnter={() => setHoveredCol("__index__")}
                            onMouseLeave={() => setHoveredCol(null)}
                            className={`
                          border-l border-r border-gray-300
                          ${hoveredCol === "__index__" ? "bg-indigo-200" : "bg-indigo-100"}
                        `}
                            style={{
                              position: isSmall ? "relative" : "sticky",
                              left: isSmall ? "auto" : 0,
                              zIndex: 10,
                              width: 60,
                              paddingLeft: "10px"
                            }}
                          >
                            {/* # */}
                          </TableCell>
                        )}

                        {columnGroups.map((grp) => (
                          <TableHead
                            key={grp.title}
                            colSpan={grp.span}
                            className="bg-indigo-100 text-center font-semibold border-l border-r border-gray-300"
                          >
                            {grp.title}
                          </TableHead>
                        ))}

                        {renderActions && (
                          <TableHead
                            onMouseEnter={() => setHoveredCol("__actions__")}
                            onMouseLeave={() => setHoveredCol(null)}
                            style={{ padding: "5px", width: renderActionsWidth }}
                            className={`
                        md:sticky right-0 border-gray-300
                        text-center px-3 z-10
                        transition-colors
                        ${hoveredCol === "__actions__" ? "bg-indigo-200" : "bg-indigo-100"}
                      `}
                          >
                            {/* Actions */}
                          </TableHead>
                        )}
                      </TableRow>
                    )}

                    {/* MAIN HEADER */}
                    <TableRow className="group">
                      {/* INDEX HEADER */}
                      {showIndex && (
                        <TableHead
                          onMouseEnter={() => setHoveredCol("__index__")}
                          onMouseLeave={() => setHoveredCol(null)}
                          className={`
                        border-l border-r border-gray-300 
                        transition-colors
                        ${hoveredCol === "__index__" ? "bg-indigo-200" : "bg-indigo-100"}
                      `}
                          style={{
                            position: isSmall ? "relative" : "sticky",
                            left: isSmall ? "auto" : 0,
                            zIndex: 10,
                            width: 60,
                            paddingLeft: "10px"
                          }}
                        >
                          #
                        </TableHead>
                      )}

                      {/* DYNAMIC HEADERS */}
                      {cols
                        .filter((c) => visibleCols.includes(c.key))
                        .map((col, idx) => (
                          <TableHead
                            key={col.key}
                            onMouseEnter={() => setHoveredCol(col.key)}
                            onMouseLeave={() => setHoveredCol(null)}
                            className={`
                          border-l border-r border-gray-300 
                          transition-colors duration-200
                          ${hoveredCol === col.key ? "bg-indigo-200" : "bg-indigo-100"}
                        `}
                            style={getColStyle(
                              col,
                              idx,
                              leftOffsets,
                              isSmall,
                              rightOffsets,
                              true
                            )}
                          >
                            {/* FILTER */}
                            <div className="px-2">
                              <Input
                                placeholder={`Search ${col.label}`}
                                className=" h-7 px-1text-xs  bg-transparent border-0 border-b border-gray-400 rounded-none outline-none
                           ring-0 ring-offset-0 focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-b focus:border-indigo-600
                            shadow-none focus:shadow-none px-0"
                                value={colFilters[col.key] || ""}
                                onChange={(e) =>
                                  setColFilters((p) => ({
                                    ...p,
                                    [col.key]: e.target.value
                                  }))
                                }
                              />
                            </div>

                            {/* LABEL / SORT */}
                            <div
                              onClick={() => toggleSort(col.key)}
                              className="mt-3 cursor-pointer flex items-center justify-between px-2 select-none"
                            >
                              {col.label}
                              {sortConfig?.key === col.key &&
                                (sortConfig.direction === "asc" ? (
                                  <AppIcon name="ArrowUpNarrowWide" size={14} />
                                ) : (
                                  <AppIcon name="ArrowDownWideNarrow" size={14} />
                                ))}
                            </div>

                            <ResizeHandle
                              onMouseDown={(e) =>
                                startResize(e, idx, col.width || col.minWidth)
                              }
                            />
                          </TableHead>
                        ))}

                      {/* ACTION HEADER */}
                      {renderActions && (
                        <TableHead
                          onMouseEnter={() => setHoveredCol("__actions__")}
                          onMouseLeave={() => setHoveredCol(null)}
                          style={{ padding: "5px", width: renderActionsWidth }}
                          className={`
                        md:sticky right-0 border-l border-r border-gray-300
                        text-center px-3 z-10
                        transition-colors
                        ${hoveredCol === "__actions__" ? "bg-indigo-200" : "bg-indigo-100"}
                      `}
                        >
                          Actions
                        </TableHead>
                      )}
                    </TableRow>
                  </TableHeader>

                  {/* BODY */}
                  <TableBody>
                    {pageRows.map((row, i) => {
                      const rowId =
                        row.id || row._id || row.empCode || `row-${i}`;

                      return (
                        <motion.tr
                          key={rowId}
                          variants={rowAnim}
                          initial="hidden"
                          animate="show"
                        >
                          {/* INDEX CELL */}
                          {showIndex && (
                            <TableCell
                              onMouseEnter={() => setHoveredCol("__index__")}
                              onMouseLeave={() => setHoveredCol(null)}
                              className={`
                            border-l border-r border-gray-200 pl-4
                            ${hoveredCol === "__index__" ? "bg-indigo-100" : "bg-white"}
                          `}
                              style={{
                                position: isSmall ? "relative" : "sticky",
                                left: isSmall ? "auto" : 0,
                                zIndex: 10,
                                width: 60,
                                paddingLeft: "10px"
                              }}
                            >
                              {(currentPage - 1) * rowsPerPage + i + 1}
                            </TableCell>
                          )}

                          {/* BODY CELLS */}
                          {cols
                            .filter((c) => visibleCols.includes(c.key))
                            .map((col, idx) => {
                              const raw = getValue(row, col.key);
                              const val = col.render
                                ? col.render(raw, row)
                                : formatValue(raw, col.type);

                              return (
                                <TableCell
                                  key={`${rowId}-${col.key}`}
                                  onMouseEnter={() => setHoveredCol(col.key)}
                                  onMouseLeave={() => setHoveredCol(null)}
                                  className={`
                                px-2 border-l border-r border-gray-200
                                transition-colors
                                ${hoveredCol === col.key ? "bg-indigo-100" : ""}
                              `}
                                  style={getColStyle(
                                    col,
                                    idx,
                                    leftOffsets,
                                    isSmall,
                                    rightOffsets,
                                    false
                                  )}
                                >
                                  <EllipsisCell
                                    width={col.width || col.minWidth || 150}
                                  >
                                    {val}
                                  </EllipsisCell>
                                </TableCell>
                              );
                            })}

                          {/* ACTIONS CELL */}
                          {renderActions && (
                            <TableCell
                              onMouseEnter={() => setHoveredCol("__actions__")}
                              onMouseLeave={() => setHoveredCol(null)}
                              style={{ padding: "5px", width: renderActionsWidth }}
                              className={`
                            md:sticky right-0 bg-white z-10 
                            border-l border-r border-gray-200 
                            text-center px-3
                            ${hoveredCol === "__actions__" ? "bg-indigo-100" : ""}
                          `}
                            >
                              {renderActions(row)}
                            </TableCell>
                          )}
                        </motion.tr>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* PAGINATION */}
              <PaginationAdvance
                count={totalPages}
                page={currentPage}
                rowsPerPage={rowsPerPage}
                onChangePage={setCurrentPage}
                onChangePageSize={setRowsPerPage}
              />
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdvanceTable;
