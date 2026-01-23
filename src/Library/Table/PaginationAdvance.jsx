import React from "react";
import { cn } from "../utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/Library/Select";

const PaginationAdvance = ({
  count = 1,
  page = 1,
  rowsPerPage = 10,
  onChangePage = () => {},
  onChangePageSize = () => {},
}) => {
  const handlePrev = () => page > 1 && onChangePage(page - 1);
  const handleNext = () => page < count && onChangePage(page + 1);

  const handlePageSize = (value) => {
    onChangePageSize(Number(value));
    onChangePage(1); // reset to first page when size changes
  };

  const pages = [];
  const maxVisible = 5;
  const start = Math.max(1, page - Math.floor(maxVisible / 2));
  const end = Math.min(count, start + maxVisible - 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
      {/* Page size dropdown */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Rows per page:</span>
        <Select value={rowsPerPage.toString()} onValueChange={handlePageSize}>
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 20, 50].map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Page numbers */}
      <div className="flex items-center justify-center gap-1">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className={cn(
            "px-3 py-1 text-sm rounded-md border",
            page === 1
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-primary-500 hover:text-white border-primary-300 text-primary-600"
          )}
        >
          Prev
        </button>

        {start > 1 && <span className="px-2">...</span>}
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onChangePage(p)}
            className={cn(
              "w-8 h-8 text-sm rounded-md border",
              p === page
                ? "bg-primary-500 text-white border-primary-500"
                : "border-gray-300 hover:bg-primary-200"
            )}
          >
            {p}
          </button>
        ))}
        {end < count && <span className="px-2">...</span>}

        <button
          onClick={handleNext}
          disabled={page === count}
          className={cn(
            "px-3 py-1 text-sm rounded-md border",
            page === count
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-primary-500 hover:text-white border-primary-300 text-primary-600"
          )}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginationAdvance;
