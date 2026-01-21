import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

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
