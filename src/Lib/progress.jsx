import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "@/lib/utils";

/**
 * Animated Progress Bar with color variants
 * Variants: success | warning | error | info | default
 */
const Progress = React.forwardRef(
  ({ className, value = 0, variant = "default", ...props }, ref) => {
    const variantClasses = {
      default: "bg-gradient-to-r from-blue-500 to-indigo-500",
      success: "bg-gradient-to-r from-green-500 to-emerald-500",
      warning: "bg-gradient-to-r from-amber-400 to-yellow-500",
      error: "bg-gradient-to-r from-red-500 to-pink-600",
      info: "bg-gradient-to-r from-sky-500 to-cyan-500",
    };

    return (
      <ProgressPrimitive.Root
        ref={ref}
        className={cn(
          "relative h-4 w-full overflow-hidden rounded-full bg-muted/30 dark:bg-muted/20 shadow-inner",
          className
        )}
        {...props}
      >
        <ProgressPrimitive.Indicator
          className={cn(
            "h-full w-full flex-1 transition-all duration-500 ease-out animate-shimmer bg-[length:200%_100%]",
            variantClasses[variant]
          )}
          style={{ transform: `translateX(-${100 - value}%)` }}
        />
        {/* Optional percentage text overlay */}
        <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white drop-shadow">
          {Math.round(value)}%
        </span>
      </ProgressPrimitive.Root>
    );
  }
);

Progress.displayName = "Progress";

export { Progress };
