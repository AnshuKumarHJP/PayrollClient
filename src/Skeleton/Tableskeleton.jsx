import React from "react";

const TableSkeleton = ({
  rows = 5,
  columns = 4
}) => {
  return (
    <div
      role="status"
      className="p-4 border border-gray-200 rounded-lg shadow-sm animate-pulse md:p-6"
    >
      {/* Header Skeleton */}
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="space-y-2">
          <div className="h-3 bg-gray-300 rounded w-32" />
          <div className="h-2 bg-gray-200 rounded w-48" />
        </div>
        <div className="h-3 bg-gray-300 rounded w-16" />
      </div>

      {/* Table Rows Skeleton */}
      <div className="divide-y divide-gray-200">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div
            key={rowIdx}
            className="grid gap-4 py-4"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`
            }}
          >
            {Array.from({ length: columns }).map((_, colIdx) => (
              <div
                key={colIdx}
                className="h-3 bg-gray-200 rounded"
              />
            ))}
          </div>
        ))}
      </div>

      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default TableSkeleton;
