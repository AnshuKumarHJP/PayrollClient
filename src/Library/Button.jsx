/* =====================================================
   FULLY RESPONSIVE BUTTON COMPONENT (EXTENDED VARIANTS)
   - Theme-consistent
   - Product-ready
   - No class conflicts
===================================================== */

import React from "react";
import { cn } from "./utils";

/* =====================================================
   BASE STYLES
===================================================== */
const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-md font-[400] " +
  "transition-all duration-200 select-none " +
  "focus:outline-none focus:ring-2 focus:ring-offset-2 " +
  "disabled:cursor-not-allowed disabled:opacity-60 " +
  "active:scale-[0.98]";

/* =====================================================
   VARIANTS (EXTENDED)
===================================================== */
const variants = {
  /* PRIMARY ACTION */
  primary:
    "bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-300",

  /* SECONDARY / OUTLINE */
  outline:
    "border border-primary-500 text-primary-600 hover:bg-primary-50 focus:ring-primary-300",

  /* SOFT / SUBTLE */
  soft:
    "bg-primary-50 text-primary-700 hover:bg-primary-100 focus:ring-primary-200",

  /* SUCCESS */
  success:
    "bg-success text-white hover:bg-success/90 focus:ring-success/30",

  successSoft:
    "bg-success/10 text-success hover:bg-success/20 focus:ring-success/20",

  /* WARNING */
  warning:
    "bg-warning text-white hover:bg-warning/90 focus:ring-warning/30",

  warningSoft:
    "bg-warning/10 text-warning hover:bg-warning/20 focus:ring-warning/20",

  /* DANGER */
  danger:
    "bg-danger text-white hover:bg-danger/90 focus:ring-danger/30",

  dangerSoft:
    "bg-danger/10 text-danger hover:bg-danger/20 focus:ring-danger/20",

  /* GHOST */
  ghost:
    "text-gray-700 hover:bg-gray-100 focus:ring-gray-300",

  /* LINK STYLE */
  link:
    "text-primary-600 underline-offset-4 hover:underline hover:text-primary-700 focus:ring-primary-300",

};

/* =====================================================
   RESPONSIVE SIZES
===================================================== */
const sizes = {
  sm: "h-8 px-3 text-xs sm:h-9 sm:px-3 sm:text-sm",
  md: "h-9 px-4 text-sm sm:h-10 sm:px-4 md:text-base",
  lg: "h-10 px-4 text-base sm:h-11 sm:px-5 md:h-12 md:px-6 md:text-lg",
};

/* =====================================================
   ICON-ONLY SIZES
===================================================== */
const iconSizes = {
  sm: "h-8 w-8 sm:h-9 sm:w-9",
  md: "h-9 w-9 sm:h-10 sm:w-10",
  lg: "h-10 w-10 sm:h-11 sm:w-11 md:h-12 md:w-12",
};

/* =====================================================
   BUTTON
===================================================== */
const Button = React.forwardRef(
  (
    {
      children,
      variant = "primary",
      size = "md",
      icon,
      iconPosition = "left",
      loading = false,
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    const isIconOnly = !children && icon;

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          baseStyles,
          variants[variant],
          isIconOnly ? iconSizes[size] : sizes[size],
          "touch-manipulation",
          className
        )}
        {...props}
      >
        {!loading && icon && iconPosition === "left" && (
          <span className="flex items-center shrink-0">{icon}</span>
        )}

        {children && (
          <span className="truncate whitespace-nowrap max-w-[12rem] sm:max-w-none">
            {children}
          </span>
        )}

        {!loading && icon && iconPosition === "right" && (
          <span className="flex items-center shrink-0">{icon}</span>
        )}

        {loading && (
          <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
export {Button}

/* =====================================================
   VARIANT HELPER (FOR COMPOUND COMPONENTS)
===================================================== */
export const buttonVariants = ({ variant = "primary", size = "md" }) =>
  cn(baseStyles, variants[variant], sizes[size]);

/* =====================================================
   AVAILABLE VARIANTS (REFERENCE)
-----------------------------------------------------
primary | outline | soft
success | successSoft
warning | warningSoft
danger  | dangerSoft
ghost   | link
===================================================== */
