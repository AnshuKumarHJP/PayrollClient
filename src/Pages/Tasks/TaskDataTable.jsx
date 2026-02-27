import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../Library/table";

import AppIcon from "../../Component/AppIcon";
import FormInputTypes from "../../Component/FormInputTypes";
import PaginationAdvance from "../../Library/Table/PaginationAdvance";

/* =========================================================
   CONSTANTS
========================================================= */

const DEFAULT_STATUS = ["Pending", "Verified", "Under Review"];
const SKELETON_COLS = 5;
const SKELETON_ROWS = 3;

/* ========================================================= */

const TaskDataTable = ({
  column = [],
  data = [],
  errors = [],
  onUpdateRow,
  onBulkUpdate,
  disabled = false,
  onSelectedRows,
}) => {
  const [rows, setRows] = useState([]);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [bulkRemarks, setBulkRemarks] = useState("");
  const selectAllRef = useRef(null);

  /* =========================================================
     DERIVED DATA
  ========================================================= */

  const statusOptions = useMemo(() => {
    const statusCol = column.find((c) =>
      c.name.toLowerCase().includes("status")
    );
    return statusCol?.options || DEFAULT_STATUS;
  }, [column]);

  const errorMap = useMemo(() => {
    const map = {};
    errors.forEach((e) => {
      map[e.row] ??= {};
      map[e.row][e.field] = e.message;
    });
    return map;
  }, [errors]);

  const totalPages = Math.ceil(rows.length / rowsPerPage);

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return rows.slice(start, start + rowsPerPage);
  }, [rows, page, rowsPerPage]);

  /* =========================================================
     EFFECTS
  ========================================================= */

  useEffect(() => {
    setRows(data);
    setPage(1);
    setSelectedRows(new Set());
  }, [data]);

  useEffect(() => {
    onSelectedRows?.(selectedRows);
  }, [selectedRows, onSelectedRows]);

  useEffect(() => {
    if (!selectAllRef.current) return;

    const start = (page - 1) * rowsPerPage;
    const pageIndexes = Array.from(
      { length: paginatedRows.length },
      (_, i) => start + i
    );

    const selectedCount = pageIndexes.filter((i) =>
      selectedRows.has(i)
    ).length;

    selectAllRef.current.indeterminate =
      selectedCount > 0 && selectedCount < pageIndexes.length;
  }, [selectedRows, paginatedRows, page, rowsPerPage]);

  /* =========================================================
     CALLBACKS (STABLE)
  ========================================================= */

  const updateCell = useCallback(
    (rowIndex, field, value) => {
      if (disabled) return;

      setRows((prev) => {
        const next = [...prev];
        next[rowIndex] = { ...next[rowIndex], [field]: value };
        return next;
      });

      onUpdateRow?.(rowIndex, {
        ...rows[rowIndex],
        [field]: value,
      });
    },
    [disabled, onUpdateRow, rows]
  );

  const toggleSelectRow = useCallback((index) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      next.has(index) ? next.delete(index) : next.add(index);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      const start = (page - 1) * rowsPerPage;

      paginatedRows.forEach((_, i) => {
        const idx = start + i;
        next.has(idx) ? next.delete(idx) : next.add(idx);
      });

      return next;
    });
  }, [paginatedRows, page, rowsPerPage]);

  const handleBulkStatusChange = useCallback(
    (status) => {
      if (!selectedRows.size) return;

      setRows((prev) => {
        const next = [...prev];
        selectedRows.forEach((i) => {
          next[i] = { ...next[i], status, remarks: bulkRemarks || next[i].remarks };
        });
        return next;
      });

      onBulkUpdate?.([...selectedRows], status, bulkRemarks);
      setBulkRemarks("");
    },
    [selectedRows, bulkRemarks, onBulkUpdate]
  );

  /* =========================================================
     SKELETON (REUSABLE)
  ========================================================= */

  if (!column.length || !data.length) {
    return (
      <div className="rounded-md border bg-white dark:bg-slate-800 shadow-sm">
        <div className="max-h-[600px] overflow-auto p-1">
          <Table className="text-sm w-full [&_th]:px-2 [&_td]:px-1">
            <TableHeader className="sticky top-0 bg-slate-50 dark:bg-slate-900/40">
              <TableRow>
                <TableHead className="w-12 sticky left-0 bg-inherit" />
                <TableHead className="w-12 sticky left-12 bg-inherit" />
                {Array.from({ length: SKELETON_COLS }).map((_, i) => (
                  <TableHead key={i}>
                    <div className="h-3 w-20 rounded bg-slate-200 dark:bg-slate-700 shimmer-wrapper" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {Array.from({ length: SKELETON_ROWS }).map((_, r) => (
                <TableRow key={r}>
                  <TableCell className="sticky left-0 bg-white dark:bg-slate-800">
                    <div className="h-4 w-4 rounded bg-slate-200 shimmer-wrapper" />
                  </TableCell>
                  <TableCell className="sticky left-12 bg-white dark:bg-slate-800">
                    <div className="h-4 w-6 bg-slate-200 shimmer-wrapper mx-auto" />
                  </TableCell>
                  {Array.from({ length: SKELETON_COLS }).map((_, c) => (
                    <TableCell key={c}>
                      <div className="h-9 rounded-xl bg-slate-100 dark:bg-slate-700 shimmer-wrapper" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="flex flex-col gap-4">
      {/* BULK BAR */}
      {/* BULK ACTION BAR */}
      {selectedRows.size > 0 && (
        <div className="sticky top-6 z-50 animate-in slide-in-from-top-4 fade-in duration-300">
          <div className="flex flex-col sm:flex-row justify-between items-center bg-indigo-700 dark:bg-slate-800/95 backdrop-blur-xl text-white rounded-2xl p-3 sm:px-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-700/50 gap-4">

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center justify-center bg-indigo-500/20 text-indigo-300 rounded-lg p-2">
                <AppIcon name="CheckSquare" size={20} />
              </div>
              <div>
                <span className="font-bold text-sm block leading-tight text-white mb-0.5">
                  {selectedRows.size} {selectedRows.size === 1 ? 'Record' : 'Records'} Selected
                </span>
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest hidden sm:block">
                  Bulk Actions Available
                </span>
              </div>
            </div>

            <div className="flex-1 w-full sm:max-w-xs focus-within:ring-1 focus-within:ring-indigo-500 rounded-lg transition-all hidden md:block">
              <input
                type="text"
                placeholder="Add remarks..."
                value={bulkRemarks}
                onChange={(e) => setBulkRemarks(e.target.value)}
                className="w-full bg-indigo-700/50 dark:bg-slate-900/50 border border-gray-300 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder:text-white outline-none"
              />
            </div>

            <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center w-full sm:w-auto justify-end">
              <div className="flex bg-indigo-700/50 dark:bg-slate-900/50 p-1 rounded-xl border border-gray-300 overflow-hidden shrink-0">
                {statusOptions.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleBulkStatusChange(s)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:bg-indigo-500 hover:text-white text-slate-300"
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="w-px h-6 bg-slate-700 mx-1 hidden sm:block"></div>

              <button
                onClick={() => setSelectedRows(new Set())}
                className="p-2 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 rounded-xl transition-all"
                title="Clear Selection"
              >
                <AppIcon name="X" size={18} />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="rounded-md border bg-white dark:bg-slate-800 shadow-sm">
        <div className="max-h-[600px] overflow-auto rounded-md">
          <Table
            className="text-sm w-full
                        text-gray-900 dark:text-gray-100
                        [&_th]:px-2 [&_td]:px-1

                        /* zebra rows */
                        [&_tbody_tr:nth-child(odd)>td]:bg-gray-50
                        dark:[&_tbody_tr:nth-child(odd)>td]:bg-gray-800

                        /* hover (override zebra correctly) */
                        [&_tbody_tr:hover>td]:bg-indigo-100
                        dark:[&_tbody_tr:hover>td]:bg-slate-700

                        /* header borders */
                        [&_thead_th]:border-gray-300
                        dark:[&_thead_th]:border-gray-600

                        /* body borders */
                        [&_tbody_tr>td]:border-gray-200
                        dark:[&_tbody_tr>td]:border-gray-700 rounded-md
  "

          >
            <TableHeader className="sticky top-0 bg-primary-500 text-white dark:bg-slate-900/40 z-20">
              <TableRow>
                <TableHead className="w-12 sticky left-0 bg-primary-500 dark:bg-slate-800 text-center">
                  <input
                    ref={selectAllRef}
                    type="checkbox"
                    checked={paginatedRows.every((_, i) =>
                      selectedRows.has((page - 1) * rowsPerPage + i)
                    )}
                    onChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead className="w-12 sm:sticky left-12 bg-primary-500 dark:bg-slate-800 text-center">
                  #
                </TableHead>
                {column.map((c) => (
                  <TableHead key={c.name} className="whitespace-nowrap">
                    {c.label}
                    {c.Required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {paginatedRows.map((row, i) => {
                const index = (page - 1) * rowsPerPage + i;
                const rowErrors = errorMap[index + 1] || {};
                const selected = selectedRows.has(index);

                return (
                  <TableRow
                    key={index}
                    className={selected ? "bg-indigo-100 dark:bg-indigo-800" : ""}
                  >
                    <TableCell className="sticky left-0 bg-white dark:bg-slate-800 text-center">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleSelectRow(index)}
                      />
                    </TableCell>

                    <TableCell className="sm:sticky left-12 bg-white dark:bg-slate-800 text-slate-400 text-center">
                      {index + 1}
                    </TableCell>

                    {column.map((col) => (
                      <TableCell key={col.name}>
                        <FormInputTypes
                          f={{
                            InputType: col.type,
                            Label: col.label,
                            Placeholder:
                              col.Placeholder || `Enter ${col.label}`,
                            Options: col.options,
                            Disabled: col.Disabled || disabled,
                          }}
                          value={row[col.name]}
                          onChange={(v) =>
                            updateCell(index, col.name, v)
                          }
                          hasError={!!rowErrors[col.name]}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="border-t p-2 bg-slate-50/30 dark:bg-slate-900/20">
          <PaginationAdvance
            count={totalPages}
            page={page}
            rowsPerPage={rowsPerPage}
            onChangePage={setPage}
            onChangePageSize={setRowsPerPage}
          />
        </div>
      </div>
    </div>
  );
};

export default TaskDataTable;
