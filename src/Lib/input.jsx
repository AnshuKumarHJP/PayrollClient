// components/ui/input.jsx
import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef(({ className, type = "text", value, ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      value={value ?? ""}
      className={cn(
        "w-full rounded-sm border border-gray-300 bg-white px-3 py-1.5 text-xs md:text-sm " +
          "placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-accent focus:border-0 focus:ring-offset-1 " +
          "disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";

export { Input };
