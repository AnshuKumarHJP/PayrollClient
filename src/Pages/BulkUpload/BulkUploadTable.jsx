import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "../../Lib/table";

import AppIcon from "../../Component/AppIcon";
import FormInputTypes from "../../Component/FormInputTypes";
import PaginationAdvance from "../../Lib/PaginationAdvance";

const BulkUploadTable = ({
  column = [],
  data = [],
  errors = [],
  onValidateRow,
  disabled = false, // 🔑 single source of truth
}) => {
  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    setRows(data || []);
    setPage(1); // Reset to first page when data changes
  }, [data]);

  /* ---------------- ERROR MAP ---------------- */
  const errorMap = useMemo(() => {
    const map = {};
    (errors || []).forEach((e) => {
      if (!map[e.row]) map[e.row] = {};
      map[e.row][e.field] = e.message;
    });
    return map;
  }, [errors]);

  /* ---------------- PAGINATION ---------------- */
  const totalPages = useMemo(() => {
    return Math.ceil(rows.length / rowsPerPage);
  }, [rows.length, rowsPerPage]);

  const paginatedRows = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return rows.slice(startIndex, endIndex);
  }, [rows, page, rowsPerPage]);

  /* ---------------- UPDATE CELL ---------------- */
  const updateCell = useCallback(
    (rowIndex, field, value) => {
      if (disabled) return;

      const updatedRow = {
        ...rows[rowIndex],
        [field]: value,
      };

      setRows((prev) => {
        const copy = [...prev];
        copy[rowIndex] = updatedRow;
        return copy;
      });

      onValidateRow?.(rowIndex, updatedRow);
    },
    [rows, onValidateRow, disabled]
  );

  return (
    <div className="w-full overflow-auto border rounded">
      <Table className="
       text-sm w-full 
                [&_tbody_tr:nth-child(odd)>td]:bg-gray-50
                [&_tbody_tr:hover>td]:bg-emerald-50
                [&_thead_th]:border-t [&_thead_th]:border-b [&_thead_th]:border-gray-300
                [&_tbody_tr>td]:border-t [&_tbody_tr>td]:border-gray-200
                [&_tbody_tr:not(:last-child)>td]:border-b
                [&_tbody_td]:border-l [&_tbody_td]:border-r [&_tbody_td]:border-gray-200
                [&_thead_th]:border-l [&_thead_th]:border-r [&_thead_th]:border-gray-300
      ">
        <TableHeader className="bg-emerald-100">
          <TableRow>
            <TableHead className="w-10 text-center">#</TableHead>
            {column.map((c) => (
              <TableHead key={c.name}>
                {c.label}
                {c.Required && <span className="text-red-500 ml-0.5">*</span>}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {paginatedRows.map((row, rowIndex) => {
            const actualRowIndex = (page - 1) * rowsPerPage + rowIndex;
            const rowErrors = errorMap[actualRowIndex + 1] || {};

            return (
              <TableRow
                key={actualRowIndex}
                className={Object.keys(rowErrors).length ? "bg-red-50/40" : ""}
              >
                <TableCell className="text-center text-gray-500">
                  {actualRowIndex + 1}
                </TableCell>

                {column.map((col) => {
                  const err = rowErrors[col.name];

                  const config = {
                    InputType: col.type,
                    Label: col.label,
                    Placeholder:
                      col.Placeholder?.trim() || `Enter ${col.label}`,
                    Options: col.options,
                    Disabled: Boolean(col.Disabled) || disabled, // ✅ FIXED
                  };

                  return (
                    <TableCell key={col.name} className="align-top p-2">
                      <FormInputTypes
                        f={config}
                        value={row[col.name]}
                        onChange={(v) =>
                          updateCell(actualRowIndex, col.name, v)
                        }
                        hasError={!!err}
                      />

                      {err && (
                        <div className="mt-1 flex items-center gap-1 text-[11px] text-red-600">
                          <AppIcon name="AlertTriangle" size={12} />
                          <span>{err}</span>
                        </div>
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {rows.length > 0 && (
        <PaginationAdvance
          count={totalPages}
          page={page}
          rowsPerPage={rowsPerPage}
          onChangePage={setPage}
          onChangePageSize={setRowsPerPage}
        />
      )}
    </div>
  );
};

export default BulkUploadTable;
