import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../Lib/card";
import { Button } from "../Lib/button";
import { Input } from "../Lib/input";
import { Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../Lib/table";
import PaginationAdvance from "../Lib/PaginationAdvance";


// ⭐ UNIVERSAL NESTED VALUE READER
const getValue = (obj, path) => {
  if (!path) return obj;
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
};

// ⭐ UNIVERSAL VALUE FORMATTER
const formatValue = (value, type) => {
  if (type === "date" && value) {
    const d = new Date(value);
    return isNaN(d) ? value : d.toLocaleString();
  }

  if (type === "boolean") return value ? "Yes" : "No";

  if (type === "number") return value ?? 0;

  if (Array.isArray(value)) return value.length ? value.join(", ") : "-";

  if (typeof value === "object" && value !== null)
    return JSON.stringify(value);

  return value ?? "-";
};


const AdvanceTable = ({
  title,
  columns = [],
  data = [],
  renderActions,
  onBack,
  icon = null,
  showIndex = true,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return data.filter((row) =>
      columns.some((col) => {
        const rawValue = getValue(row, col.key);
        const cellValue = col.render
          ? col.render(rawValue, row)
          : formatValue(rawValue, col.type);
        return String(cellValue).toLowerCase().includes(lowerSearchTerm);
      })
    );
  }, [data, searchTerm, columns]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const currentRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(startIndex, startIndex + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages || 1);
  }, [filteredData.length, rowsPerPage, currentPage, totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);


  if (!filteredData.length) return null;

  return (
    <Card className="mt-5 border-t-4 border-emerald-300 shadow-lg">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-center">
        {title && (
          <div className="flex items-center gap-2">
            {icon && <div className="text-blue-600">{icon}</div>}
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
          </div>
        )}

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-64"
            />
          </div>

          {onBack && (
            <Button variant="outline" onClick={onBack}>
              ↩ Back
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4 overflow-x-auto">
        <div className="border rounded-md">
          <Table className="text-sm">
            <TableHeader>
              <TableRow>
                {showIndex && <TableHead>#</TableHead>}
                {columns.map((col) => (
                  <TableHead key={col.key}>{col.label}</TableHead>
                ))}
                {renderActions && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>

            <TableBody>
              {currentRecords.map((row, i) => {
                const rowKey =
                  row.id ||
                  row.empCode ||
                  row._id ||
                  `row-${(currentPage - 1) * rowsPerPage + i}`;

                return (
                  <TableRow key={rowKey}>
                    {showIndex && (
                      <TableCell className="font-medium text-gray-600">
                        {(currentPage - 1) * rowsPerPage + i + 1}
                      </TableCell>
                    )}

                    {/* ⭐ Render Each Column */}
                    {columns.map((col) => {
                      const rawValue = getValue(row, col.key);
                      const cellValue = col.render
                        ? col.render(rawValue, row)
                        : formatValue(rawValue, col.type);

                      return (
                        <TableCell key={`${rowKey}-${col.key}`}>
                          {cellValue}
                        </TableCell>
                      );
                    })}

                    {renderActions && (
                      <TableCell key={`${rowKey}-actions`}>
                        {renderActions(row)}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <PaginationAdvance
            count={totalPages}
            page={currentPage}
            rowsPerPage={rowsPerPage}
            onChangePage={setCurrentPage}
            onChangePageSize={setRowsPerPage}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default AdvanceTable;
