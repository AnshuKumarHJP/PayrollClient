import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "./utils"

const Switch = React.forwardRef(
  ({ className, variant = "default", size = "md", ...props }, ref) => {
    const variantClasses = {
      default: "data-[state=checked]:bg-emerald-500",
      success: "data-[state=checked]:bg-green-500",
      warning: "data-[state=checked]:bg-amber-500",
      danger: "data-[state=checked]:bg-red-500",
      info: "data-[state=checked]:bg-blue-500",
    };

    const sizeClasses = {
      sm: {
        root: "h-4 w-8",
        thumb: "h-3 w-3 data-[state=checked]:translate-x-4",
      },
      md: {
        root: "h-6 w-11",
        thumb: "h-5 w-5 data-[state=checked]:translate-x-5",
      },
      lg: {
        root: "h-8 w-14",
        thumb: "h-7 w-7 data-[state=checked]:translate-x-7",
      },
    };

    return (
      <SwitchPrimitive.Root
        ref={ref}
        className={cn(
          "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors " +
            "data-[state=unchecked]:bg-gray-300 " +
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-400 " +
            "disabled:cursor-not-allowed disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size].root,
          className
        )}
        {...props}
      >
        <SwitchPrimitive.Thumb
          className={cn(
            "pointer-events-none block rounded-full bg-white shadow-md ring-0 transition-transform " +
              "data-[state=unchecked]:translate-x-0",
            sizeClasses[size].thumb
          )}
        />
      </SwitchPrimitive.Root>
    );
  }
);

Switch.displayName = "Switch";

export { Switch };
