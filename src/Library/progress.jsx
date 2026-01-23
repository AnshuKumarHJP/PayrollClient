/* =========================================================
   PROGRESS COMPONENT (PRODUCTION-READY)
   - Radix UI based
   - Smooth animation
   - Gradient variants
   - Accessible (ARIA)
   - Dark mode ready
   - Optional label / percentage
========================================================= */

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "./utils";

/* =========================================================
   VARIANT STYLES
========================================================= */
const VARIANTS = {
  default:
    "bg-gradient-to-r from-indigo-500 via-blue-500 to-indigo-600",
  success:
    "bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600",
  warning:
    "bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500",
  error:
    "bg-gradient-to-r from-rose-500 via-red-500 to-rose-600",
  info:
    "bg-gradient-to-r from-sky-500 via-cyan-500 to-sky-600",
};

/* =========================================================
   PROGRESS
========================================================= */
const Progress = React.forwardRef(
  (
    {
      value = 0,
      variant = "default",
      showValue = true,
      label,
      className,
      ...props
    },
    ref
  ) => {
    const safeValue = Math.min(100, Math.max(0, value));

    return (
      <div className="w-full space-y-1">
        {/* Optional Label */}
        {label && (
          <div className="flex items-center justify-center text-xs font-medium text-muted-foreground">
            <span>{label} : </span>
            &nbsp;{showValue && <span>{Math.round(safeValue)}%</span>}
          </div>
        )}

        <ProgressPrimitive.Root
          ref={ref}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={safeValue}
          className={cn(
            "relative h-3 w-full overflow-hidden rounded-full",
            "bg-muted/40 dark:bg-muted/25",
            "shadow-inner",
            className
          )}
          {...props}
        >
          <ProgressPrimitive.Indicator
            className={cn(
              "h-full w-full flex-1",
              "transition-transform duration-500 ease-out",
              "animate-[progress_1.5s_ease-in-out_infinite]",
              VARIANTS[variant]
            )}
            style={{
              transform: `translateX(-${100 - safeValue}%)`,
            }}
          />
        </ProgressPrimitive.Root>
      </div>
    );
  }
);

Progress.displayName = "Progress";

/* =========================================================
   KEYFRAMES (GLOBAL CSS)
========================================================= */
/*
@keyframes progress {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}
*/

export { Progress };
