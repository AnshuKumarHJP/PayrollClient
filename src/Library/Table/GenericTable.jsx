import React, { useMemo, useState, useRef, useEffect } from "react";
import PaginationAdvance from "./PaginationAdvance";
import DropdownSelect from "../../Component/DropdownSelect";
import AppIcon from "../../Component/AppIcon";
import { Density, DownloadTypes } from "../../Data/StaticData";
import { exportExcel, exportCSV, exportJSON, exportPDF } from "./ExportHelper";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../../Library/DropdownMenu";
import { Button } from "../../Lib/button";
import { Switch } from "../../Library/Switch";

import {
  stickyHeaderClass,
  stickyBodyClass,
  stickySystemHeaderCol,
  stickySystemBodyCol,
  TABLE_BG,
} from "./HelperTable";

/* ================= CONSTANTS ================= */
const CHECKBOX_WIDTH = 40;
const INDEX_WIDTH = 56;
const DEFAULT_COL_WIDTH = 160;
const MIN_COL_WIDTH = 80;
const ROW_HEIGHT = 40;

/* ================= HELPERS ================= */
const getValue = (obj, path) =>
  path?.split(".").reduce((o, k) => o?.[k], obj);

/* ================= COMPONENT ================= */
const CustomDataGrid = ({
  title = "Data Grid",
  columns = [],
  data = [],
  showIndex = true,
}) => {
  const wrapRef = useRef(null);
  const headerCheckboxRef = useRef(null);

  const [containerWidth, setContainerWidth] = useState(0);
  const [colWidths, setColWidths] = useState({});
  const [visibleCols, setVisibleCols] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState({ key: null, dir: "asc" });
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]);
  const [sizeMode, setSizeMode] = useState("normal");

  /* ---------- ResizeObserver ---------- */
  useEffect(() => {
    if (!wrapRef.current) return;
    const ro = new ResizeObserver(([e]) =>
      setContainerWidth(e.contentRect.width)
    );
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, []);

  /* ---------- Flatten columns (KEEP GROUP LOGIC) ---------- */
  const allCols = columns.flatMap((g) => g.children || []);
  const actionCol = allCols.find((c) => c.isAction);
  const normalCols = allCols.filter((c) => !c.isAction);

  useEffect(() => {
    setVisibleCols(normalCols.map((c) => c.key));
  }, []);

  /* ================= FILTER ================= */
  const filteredData = useMemo(() => {
    return data.filter((row) =>
      JSON.stringify(row).toLowerCase().includes(search.toLowerCase())
    );
  }, [data, search]);

  /* ================= SORT ================= */
  const toggleSort = (key) => {
    setSort((prev) => ({
      key,
      dir: prev.key === key && prev.dir === "asc" ? "desc" : "asc",
    }));
  };

  const sortedData = useMemo(() => {
    if (!sort.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      const av = getValue(a, sort.key);
      const bv = getValue(b, sort.key);
      if (av === bv) return 0;
      return sort.dir === "asc" ? (av > bv ? 1 : -1) : av < bv ? 1 : -1;
    });
  }, [filteredData, sort]);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const pagedData = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, page, rowsPerPage]);

  /* ================= SELECTION ================= */
  const allIndexes = sortedData.map((_, i) => i);
  const isAllSelected =
    selectedRows.length > 0 && selectedRows.length === allIndexes.length;

  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate =
        selectedRows.length > 0 && !isAllSelected;
    }
  }, [selectedRows, isAllSelected]);

  /* ================= RESIZE ================= */
  const startResize = (e, key) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const startWidth = colWidths[key] || DEFAULT_COL_WIDTH;

    const onMove = (ev) => {
      setColWidths((p) => ({
        ...p,
        [key]: Math.max(MIN_COL_WIDTH, startWidth + ev.clientX - startX),
      }));
    };

    const onUp = () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };

    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
  };

  /* ================= DENSITY ================= */
  const sizeClass =
    sizeMode === "compact"
      ? "[&_td]:h-8 [&_th]:h-8 text-xs"
      : sizeMode === "comfortable"
      ? "[&_td]:h-14 [&_th]:h-14"
      : "[&_td]:h-10 [&_th]:h-10";

  /* ================= ORDERED COLS ================= */
  const orderedCols = [
    ...normalCols.filter((c) => visibleCols.includes(c.key)),
    ...(actionCol ? [{ ...actionCol, sticky: "right" }] : []),
  ];

  /* ================= STICKY LEFT OFFSET ================= */
  const stickyLeftCols = orderedCols.filter((c) => c.sticky === "left");

  const getStickyLeftOffset = (key) => {
    let offset = CHECKBOX_WIDTH + (showIndex ? INDEX_WIDTH : 0);
    for (const col of stickyLeftCols) {
      if (col.key === key) break;
      offset += colWidths[col.key] || col.width || DEFAULT_COL_WIDTH;
    }
    return offset;
  };

  /* ================= AUTO FIT ================= */
  const baseWidth =
    CHECKBOX_WIDTH +
    (showIndex ? INDEX_WIDTH : 0) +
    orderedCols.reduce(
      (s, c) => s + (colWidths[c.key] || c.width || DEFAULT_COL_WIDTH),
      0
    );

  const extra = Math.max(0, containerWidth - baseWidth);

  const getColWidth = (col, idx) => {
    const base = colWidths[col.key] || col.width || DEFAULT_COL_WIDTH;
    const stretch =
      extra > 0 && idx === orderedCols.length - 1 && !col.sticky;
    return stretch ? base + extra : base;
  };

  const cellBase = "whitespace-nowrap overflow-hidden text-ellipsis";

  /* ================= EXPORT ================= */
  const exportFile = (type) => {
    if (type === "excel") return exportExcel(filteredData, columns, `${title}.xlsx`);
    if (type === "csv") return exportCSV(filteredData, columns, `${title}.csv`);
    if (type === "json") return exportJSON(filteredData, columns, `${title}.json`);
    if (type === "pdf") return exportPDF(filteredData, columns, `${title}.pdf`);
  };

  /* ================= RENDER ================= */
  return (
    <>
     <div className="border bg-white rounded shadow-lg">
      {/* ================= TOOLBAR ================= */}
      <div className="flex justify-between items-center px-4 py-3 border-b shadow-md">
        <div className="flex gap-2 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="">
                <AppIcon name="Columns" size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {normalCols.map((col) => (
                <DropdownMenuItem
                  key={col.key}
                  onClick={() =>
                    setVisibleCols((p) =>
                      p.includes(col.key)
                        ? p.filter((k) => k !== col.key)
                        : [...p, col.key]
                    )
                  }
                  className="flex justify-between gap-4"
                >
                  {col.label}
                  <Switch size="sm" checked={visibleCols.includes(col.key)} />
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownSelect
            items={Density}
            triggerIcon="Grid2x2"
            onSelect={setSizeMode}
          />

          <DropdownSelect
            items={DownloadTypes}
            triggerIcon="Download"
            onSelect={exportFile}
          />
        </div>

        <div className="flex items-center gap-2 border rounded px-2 h-8">
          <AppIcon name="Search" size={14} />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="outline-none text-sm"
            placeholder="Search..."
          />
        </div>
      </div>

      {/* ================= TABLE ================= */}
     
      <div ref={wrapRef} className="overflow-x-auto">
        <table className={`table-fixed ${sizeClass}  ${baseWidth < containerWidth ? "w-full" : "w-max"}`}>
          <thead className={`sticky top-0 ${TABLE_BG.header} z-40`}>
            {/* GROUP HEADERS */}
            <tr>
              <th className="w-10 border-b border-gray-300"></th>
              {showIndex && <th className="w-14 border-b border-gray-300"></th>}
              {columns.map((group, i) => {
                const visibleChildren = group.children.filter(c => visibleCols.includes(c.key) || c.isAction);
                return visibleChildren.length > 0 ? (
                  <th
                    key={i}
                    colSpan={visibleChildren.length}
                    className="px-4 py-2 text-center font-medium text-gray-700 border-b"
                    style={{
                      boxShadow: 'inset 1px 0 0 #adaebb, inset -1px 0 0 #adaebb, inset 0 0px 0 #adaebb, inset 0 -1px 0 #adaebb'
                    }}
                  >
                    {group.header}
                  </th>
                ) : null;
              })}
            </tr>

            {/* COLUMN HEADERS */}
            <tr>
              <th className={stickySystemHeaderCol} style={{ width: CHECKBOX_WIDTH, left: 0 }}>
                <input
                  ref={headerCheckboxRef}
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={() =>
                    setSelectedRows(isAllSelected ? [] : allIndexes)
                  }
                />
              </th>

              {showIndex && (
                <th
                  className={stickySystemHeaderCol}
                  style={{ width: INDEX_WIDTH, left: CHECKBOX_WIDTH }}
                >
                  #
                </th>
              )}

              {orderedCols.map((col, idx) => (
                <th
                  key={col.key}
                  onClick={() => !col.isAction && toggleSort(col.key)}
                  style={{
                    width: getColWidth(col, idx),
                    left:
                      col.sticky === "left"
                        ? getStickyLeftOffset(col.key)
                        : undefined,
                    right: col.sticky === "right" ? 0 : undefined,
                  }}
                  className={`
                    relative px-3 border-b select-none
                    ${!col.isAction ? "cursor-pointer hover:bg-gray-300/40" : ""}
                    ${cellBase}
                    ${stickyHeaderClass(col)}
                  `}
                >
                  <div className="flex justify-between items-center font-medium">
                    {col.label}
                    {!col.isAction && sort.key === col.key && (
                      <AppIcon
                        name={
                          sort.dir === "asc"
                            ? "ArrowUpWideNarrow"
                            : "ArrowDownWideNarrow"
                        }
                        size={14}
                      />
                    )}
                  </div>

                  {!col.isAction && (
                    <div
                      onMouseDown={(e) => startResize(e, col.key)}
                      onClick={(e) => e.stopPropagation()}
                      className="absolute right-0 top-0 h-full w-2 cursor-col-resize hover:bg-blue-300/40 z-50"
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {pagedData.map((row, idx) => {
              const globalIndex = (page - 1) * rowsPerPage + idx;
              const isSelected = selectedRows.includes(globalIndex);

              return (
                <tr
                  key={globalIndex}
                  className={`border-b ${
                    isSelected ? "bg-emerald-50" : "hover:bg-gray-50"
                  }`}
                  style={{ height: ROW_HEIGHT }}
                >
                  <td
                    className={`${stickySystemBodyCol} text-center`}
                    style={{ width: CHECKBOX_WIDTH, left: 0 }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() =>
                        setSelectedRows((p) =>
                          p.includes(globalIndex)
                            ? p.filter((i) => i !== globalIndex)
                            : [...p, globalIndex]
                        )
                      }
                    />
                  </td>

                  {showIndex && (
                    <td
                      className={`${stickySystemBodyCol} text-center`}
                      style={{ width: INDEX_WIDTH, left: CHECKBOX_WIDTH }}
                    >
                      {globalIndex + 1}
                    </td>
                  )}

                  {orderedCols.map((col, i) => (
                    <td
                      key={col.key}
                      style={{
                        width: getColWidth(col, i),
                        left:
                          col.sticky === "left"
                            ? getStickyLeftOffset(col.key)
                            : undefined,
                        right: col.sticky === "right" ? 0 : undefined,
                      }}
                      className={`px-3 ${cellBase} ${stickyBodyClass(col)}`}
                    >
                      {col.render
                        ? col.isAction
                          ? col.render(row)
                          : col.render(getValue(row, col.key), row)
                        : getValue(row, col.key) ?? "-"}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="px-4 pb-4">
        <PaginationAdvance
          count={totalPages}
          page={page}
          rowsPerPage={rowsPerPage}
          onChangePage={setPage}
          onChangePageSize={(s) => {
            setRowsPerPage(s);
            setPage(1);
            setSelectedRows([]);
          }}
        />
      </div>
      </div>
    </>
  );
};

export default CustomDataGrid;
