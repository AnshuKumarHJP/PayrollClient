// Tooltip.jsx
import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Props
 * - content
 * - side: top | bottom | left | right
 * - align: start | center | end
 * - delay
 */

export const TooltipProvider = TooltipPrimitive.Provider;

const tooltipContent = cva(
  "z-50 rounded-[var(--tooltip-radius)] bg-[var(--tooltip-bg)] " +
    "px-[var(--tooltip-px)] py-[var(--tooltip-py)] text-[var(--tooltip-font)] " +
    "text-[var(--tooltip-text)] shadow-md animate-in fade-in zoom-in-95",
  {
    variants: {
      side: {
        top: "slide-in-from-bottom-1",
        bottom: "slide-in-from-top-1",
        left: "slide-in-from-right-1",
        right: "slide-in-from-left-1",
      },
    },
    defaultVariants: {
      side: "top",
    },
  }
);

export function Tooltip({
  children,
  content,
  side = "top",
  align = "center",
  delay = 200,
}) {
  return (
    <TooltipPrimitive.Provider delayDuration={delay}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>
          {children}
        </TooltipPrimitive.Trigger>

        <TooltipPrimitive.Content
          side={side}
          align={align}
          sideOffset={8}
          className={cn(tooltipContent({ side }))}
        >
          {content}
          <TooltipPrimitive.Arrow
            width={varToNumber("--tooltip-arrow")}
            height={varToNumber("--tooltip-arrow")}
            className="fill-[var(--tooltip-bg)]"
          />
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}

/* helper to read css var as number */
function varToNumber(name) {
  if (typeof window === "undefined") return 6;
  return parseInt(
    getComputedStyle(document.documentElement).getPropertyValue(name)
  );
}
