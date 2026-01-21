// Popover.jsx
import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Props
 * - size: sm | md | lg
 * - side: top | bottom | left | right
 * - align: start | center | end
 */

export const Popover = PopoverPrimitive.Root;
export const PopoverTrigger = PopoverPrimitive.Trigger;

const popoverVariants = cva(
  "z-50 rounded-[var(--popover-radius)] border bg-[var(--popover-bg)] " +
    "border-[var(--popover-border)] shadow-md animate-in fade-in zoom-in-95",
  {
    variants: {
      size: {
        sm: "p-[var(--popover-sm-p)]",
        md: "p-[var(--popover-md-p)]",
        lg: "p-[var(--popover-lg-p)]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export const PopoverContent = React.forwardRef(
  ({ className, size, side = "bottom", align = "center", ...props }, ref) => (
    <PopoverPrimitive.Content
      ref={ref}
      side={side}
      align={align}
      sideOffset={8}
      className={cn(popoverVariants({ size }), className)}
      {...props}
    />
  )
);
PopoverContent.displayName = "PopoverContent";

export function PopoverHeader({ title, description }) {
  return (
    <div className="grid gap-1">
      {title && (
        <h4 className="text-[var(--popover-title)] font-medium">
          {title}
        </h4>
      )}
      {description && (
        <p className="text-[var(--popover-text)] text-gray-500">
          {description}
        </p>
      )}
    </div>
  );
}
