import * as React from "react";
import { cn } from "@/lib/utils";

/* ============================================================
   FIXED TABLE — horizontal scroll now works on all devices
   ============================================================ */
const Table = React.forwardRef(({ className, ...props }, ref) => (
  <div
    className="
      relative 
      w-full 
      overflow-x-auto 
      overflow-y-visible 
      min-w-0
      touch-pan-x 
      overscroll-x-contain
    "
  >
    <table
      ref={ref}
      className={cn(
        // ❗ CRITICAL FIX:
        // w-max + min-w-max allows the table to grow wider than screen
        "w-max min-w-max caption-bottom text-sm",
        className
      )}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

/* ============================================================
   Table Header
   ============================================================ */
const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

/* ============================================================
   Table Body
   ============================================================ */
const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

/* ============================================================
   Table Footer
   ============================================================ */
const TableFooter = React.forwardRef(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

/* ============================================================
   Table Row
   ============================================================ */
const TableRow = React.forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors text-sm md:text-md data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

/* ============================================================
   Table Head
   ============================================================ */
const TableHead = React.forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground whitespace-nowrap",
      className
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

/* ============================================================
   Table Cell
   ============================================================ */
const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "p-2 text-xs md:text-sm align-middle whitespace-nowrap",
      className
    )}
    {...props}
  />
));
TableCell.displayName = "TableCell";

/* ============================================================
   Table Caption
   ============================================================ */
const TableCaption = React.forwardRef(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption
};
