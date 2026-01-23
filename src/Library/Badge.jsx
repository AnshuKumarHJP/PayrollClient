import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "./utils"

const badgeVariants = cva(
  `
  inline-flex items-center justify-center
  font-medium
  transition-colors
  whitespace-nowrap
  `,
  {
    variants: {
      variant: {
        /* ---------- STATUS ---------- */
        info:
          "bg-[var(--badge-info-bg)] text-[var(--badge-info-text)]",

        success:
          "bg-[var(--badge-success-bg)] text-[var(--badge-success-text)]",

        warning:
          "bg-[var(--badge-warning-bg)] text-[var(--badge-warning-text)]",

        danger:
          "bg-[var(--badge-danger-bg)] text-[var(--badge-danger-text)]",

        muted:
          "bg-[var(--badge-muted-bg)] text-[var(--badge-muted-text)]",

         // NEW VARIANTS --------------------------

        info: "bg-indigo-500 text-white border-indigo-500",

        dark: "bg-gray-900 text-white border-gray-900",

        light: "bg-gray-100 text-gray-900 border-gray-100",

        ghost: "bg-transparent text-foreground hover:bg-accent",

        muted: "bg-gray-200 text-gray-700 border-gray-200",

        purple: "bg-purple-600 text-white border-purple-600",

        teal: "bg-teal-500 text-white border-teal-500",

        gradient:
          "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-transparent",

        soft:
          "bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100",
      },

      size: {
        xs: "h-[var(--badge-xs)] px-2 text-[9px]",
        sm: "h-[var(--badge-sm)] px-2 text-[10px]",
        md: "h-[var(--badge-md)] px-2.5 text-[11px]",
        lg: "h-[var(--badge-lg)] px-3 text-[12px]",
      },
    },

    defaultVariants: {
      variant: "info",
      size: "sm",
    },
  }
);

const Badge = React.forwardRef(
  ({ variant, size, className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          badgeVariants({ variant, size }),
          "rounded-[var(--badge-radius)]",
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = "Badge";

export { Badge, badgeVariants };
