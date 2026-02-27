import React from "react";
import { cn } from "../utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Library/Select";

const PaginationAdvance = ({
  count = 1,
  page = 1,
  rowsPerPage = 10,
  onChangePage = () => { },
  onChangePageSize = () => { },
  rowsPerPageOptions = [5, 10, 20, 50],
}) => {
  const handlePrev = () => page > 1 && onChangePage(page - 1);
  const handleNext = () => page < count && onChangePage(page + 1);

  const handlePageSize = (value) => {
    onChangePageSize(Number(value));
    onChangePage(1);
  };

  const pages = [];
  const maxVisible = 5;
  const start = Math.max(1, page - Math.floor(maxVisible / 2));
  const end = Math.min(count, start + maxVisible - 1);

  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
      {/* Page size */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600 dark:text-gray-300">
          Rows per page:
        </span>

        <Select value={rowsPerPage.toString()} onValueChange={handlePageSize}>
          <SelectTrigger className="w-20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="">
            {rowsPerPageOptions.map((size) => (
              <SelectItem
                key={size}
                value={size.toString()}
                className=""
              >
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center gap-1">
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className={cn(
            "px-3 py-1 text-sm rounded-md border transition",
            page === 1
              ? "opacity-50 cursor-not-allowed border-gray-300 dark:border-gray-700"
              : "border-primary-300 text-primary-600 hover:bg-primary-500 hover:text-white dark:border-primary-600 dark:text-primary-400 dark:hover:bg-primary-600"
          )}
        >
          Prev
        </button>

        {start > 1 && (
          <span className="px-2 text-gray-500 dark:text-gray-400">…</span>
        )}

        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onChangePage(p)}
            className={cn(
              "w-8 h-8 text-sm rounded-md border transition",
              p === page
                ? "bg-primary-500 text-white border-primary-500"
                : "border-gray-300 text-gray-700 hover:bg-primary-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            )}
          >
            {p}
          </button>
        ))}

        {end < count && (
          <span className="px-2 text-gray-500 dark:text-gray-400">…</span>
        )}

        <button
          onClick={handleNext}
          disabled={page === count}
          className={cn(
            "px-3 py-1 text-sm rounded-md border transition",
            page === count
              ? "opacity-50 cursor-not-allowed border-gray-300 dark:border-gray-700"
              : "border-primary-300 text-primary-600 hover:bg-primary-500 hover:text-white dark:border-primary-600 dark:text-primary-400 dark:hover:bg-primary-600"
          )}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default PaginationAdvance;
