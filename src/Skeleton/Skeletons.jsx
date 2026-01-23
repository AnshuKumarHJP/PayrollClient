// SkeletonsUltra.jsx
// 🚀 EXTENDED / ADVANCED SKELETON COLLECTION (ONE FILE)
// Covers almost every real-world UI case

import React from "react";
import { cn } from "../Library/utils"

/* =================================================
   BASE SHIMMER
================================================= */
export const Skeleton = ({ className }) => (
  <div
    className={cn(
      "relative overflow-hidden rounded-md bg-gray-200 dark:bg-gray-800",
      "before:absolute before:inset-0 before:-translate-x-full",
      "before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent",
      "before:animate-[shimmer_1.5s_infinite]",
      className
    )}
  />
);

/* =================================================
   LAYOUT SKELETONS
================================================= */

// Page
export const SkeletonPage = () => (
  <div className="space-y-6 p-4">
    <Skeleton className="h-8 w-1/3" />
    <SkeletonText lines={5} />
  </div>
);

// Sidebar
export const SkeletonSidebar = ({ items = 6 }) => (
  <div className="space-y-4 p-4 w-64">
    <Skeleton className="h-6 w-2/3" />
    {Array.from({ length: items }).map((_, i) => (
      <Skeleton key={i} className="h-4 w-full" />
    ))}
  </div>
);

// Navbar
export const SkeletonNavbar = () => (
  <div className="flex items-center justify-between px-4 py-3 border-b">
    <Skeleton className="h-6 w-32" />
    <div className="flex gap-3">
      <SkeletonAvatar size={32} />
      <SkeletonAvatar size={32} />
    </div>
  </div>
);

/* =================================================
   TEXT
================================================= */
export const SkeletonText = ({ lines = 3 }) => (
  <div className="space-y-2">
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        className={`h-4 ${i === lines - 1 ? "w-2/3" : "w-full"}`}
      />
    ))}
  </div>
);

/* =================================================
   MEDIA
================================================= */
export const SkeletonAvatar = ({ size = 40 }) => (
  <Skeleton className="rounded-full" style={{ width: size, height: size }} />
);

export const SkeletonImage = ({ aspect = "aspect-video" }) => (
  <Skeleton className={`w-full ${aspect}`} />
);

export const SkeletonVideo = () => (
  <Skeleton className="w-full aspect-video rounded-lg" />
);

/* =================================================
   CONTROLS
================================================= */
export const SkeletonButton = ({ w = "w-24", h = "h-10" }) => (
  <Skeleton className={`${w} ${h}`} />
);

export const SkeletonInput = () => (
  <Skeleton className="h-10 w-full" />
);

export const SkeletonSwitch = () => (
  <Skeleton className="h-6 w-12 rounded-full" />
);

export const SkeletonCheckbox = () => (
  <Skeleton className="h-4 w-4 rounded-sm" />
);

/* =================================================
   COMPLEX COMPONENTS
================================================= */

// Card
export const SkeletonCard = () => (
  <div className="space-y-3 rounded-xl border p-4">
    <Skeleton className="h-40 w-full" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
  </div>
);

// Table
export const SkeletonTable = ({ rows = 5, cols = 4 }) => (
  <div className="space-y-3">
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols},1fr)` }}>
      {Array.from({ length: cols }).map((_, i) => (
        <Skeleton key={i} className="h-4" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols},1fr)` }}>
        {Array.from({ length: cols }).map((_, c) => (
          <Skeleton key={c} className="h-4" />
        ))}
      </div>
    ))}
  </div>
);

// Timeline
export const SkeletonTimeline = ({ items = 4 }) => (
  <div className="space-y-6">
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="flex gap-4">
        <SkeletonAvatar size={24} />
        <SkeletonText lines={2} />
      </div>
    ))}
  </div>
);

// Chat
export const SkeletonChat = ({ messages = 5 }) => (
  <div className="space-y-4">
    {Array.from({ length: messages }).map((_, i) => (
      <div
        key={i}
        className={`flex gap-3 ${i % 2 === 0 ? "" : "justify-end"}`}
      >
        {i % 2 === 0 && <SkeletonAvatar size={28} />}
        <Skeleton className="h-12 w-2/3 rounded-xl" />
      </div>
    ))}
  </div>
);

// Kanban
export const SkeletonKanban = ({ columns = 3 }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {Array.from({ length: columns }).map((_, i) => (
      <div key={i} className="space-y-3 border rounded-lg p-3">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    ))}
  </div>
);

// Dashboard Stats
export const SkeletonStatsGrid = ({ items = 4 }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {Array.from({ length: items }).map((_, i) => (
      <div key={i} className="border rounded-lg p-4 space-y-2">
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-6 w-2/3" />
      </div>
    ))}
  </div>
);

/* =================================================
   UTILITIES
================================================= */

// Loading Wrapper
export const WithSkeleton = ({ loading, skeleton, children }) =>
  loading ? skeleton : children;

// Suspense-ready fallback
export const SkeletonFallback = ({ type = "page" }) => {
  const map = {
    page: <SkeletonPage />,
    card: <SkeletonCard />,
    table: <SkeletonTable />,
    chat: <SkeletonChat />,
    dashboard: <SkeletonStatsGrid />
  };
  return map[type] || <SkeletonText />;
};

/* =================================================
   EXPORT ALL
================================================= */
export default {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonImage,
  SkeletonVideo,
  SkeletonButton,
  SkeletonInput,
  SkeletonSwitch,
  SkeletonCheckbox,
  SkeletonCard,
  SkeletonTable,
  SkeletonTimeline,
  SkeletonChat,
  SkeletonKanban,
  SkeletonStatsGrid,
  SkeletonSidebar,
  SkeletonNavbar,
  SkeletonPage,
  WithSkeleton,
  SkeletonFallback
};
