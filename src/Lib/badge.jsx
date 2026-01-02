import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center font-semibold rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground border-transparent",

        secondary: "bg-secondary text-secondary-foreground border-transparent",

        success: "bg-green-500 text-white border-green-500",

        warning: "bg-yellow-400 text-black border-yellow-400",

        destructive: "bg-red-500 text-white border-red-500",

        outline: "border text-foreground bg-transparent",

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
        xs: "px-2 py-[1px] text-[9px]",
        sm: "px-2.5 py-0.5 text-[10px]",
        md: "px-3 py-1 text-xs",
        lg: "px-3.5 py-1.5 text-sm",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "sm",
    },
  }
);

const Badge = React.forwardRef(({ variant, size, className, children, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export { Badge, badgeVariants };
