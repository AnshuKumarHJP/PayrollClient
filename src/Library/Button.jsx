// Button.jsx
import React from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

const baseStyles =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed";

const variants = {
  primary:
    "bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-300",
  outline:
    "border border-primary-500 text-primary-500 hover:bg-primary-50 focus:ring-primary-300",
  danger:
    "bg-danger text-white hover:bg-danger/90 focus:ring-danger/30",
  success:
    "bg-success text-white hover:bg-success/90 focus:ring-success/30",
  ghost: "hover:bg-accent hover:text-accent-foreground",
};

const sizes = {
  sm: "h-8 px-3 text-p11",
  md: "h-10 px-4 text-p",
  lg: "h-12 px-6 text-lead",
};

const iconOnlySizes = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-12 w-12",
};

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
        className={twMerge(clsx(
          baseStyles,
          variants[variant],
          isIconOnly ? iconOnlySizes[size] : sizes[size],
          className
        ))}
        {...props}
      >
        {/* LEFT ICON */}
        {!loading && icon && iconPosition === "left" && (
          <span className="flex items-center shrink-0">
            {icon}
          </span>
        )}

        {/* TEXT */}
        {children && (
          <span className="whitespace-nowrap">
            {children}
          </span>
        )}

        {/* RIGHT ICON */}
        {!loading && icon && iconPosition === "right" && (
          <span className="flex items-center shrink-0">
            {icon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;

export const buttonVariants = ({ variant = "primary", size = "md" }) => {
  const isIconOnly = false; // assuming not icon only for variants
  return twMerge(clsx(
    baseStyles,
    variants[variant],
    isIconOnly ? iconOnlySizes[size] : sizes[size]
  ));
};
