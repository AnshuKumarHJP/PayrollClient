import React from "react";
import clsx from "clsx";

const sizeMap = {
  sm: "w-[var(--control-sm)] h-[var(--control-sm)]",
  md: "w-[var(--control-md)] h-[var(--control-md)]",
  lg: "w-[var(--control-lg)] h-[var(--control-lg)]",
};

const variantMap = {
  primary: "border-[var(--control-primary)]",
  success: "border-[var(--control-success)]",
  danger: "border-[var(--control-danger)]",
};

export function Radio({
  checked,
  defaultChecked = false,
  onChange,
  size = "md",
  variant = "primary",
  disabled = false,
}) {
  const [internal, setInternal] = React.useState(defaultChecked);
  const isChecked = checked ?? internal;

  const toggle = () => {
    if (disabled) return;
    setInternal(true);
    onChange?.(true);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={disabled}
      className={clsx(
        "relative flex items-center justify-center rounded-full border transition",
        sizeMap[size],
        variantMap[variant],
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {isChecked && (
        <span
          className={clsx(
            "rounded-full bg-[var(--control-primary)]",
            size === "sm" && "w-1.5 h-1.5",
            size === "md" && "w-2 h-2",
            size === "lg" && "w-2.5 h-2.5"
          )}
        />
      )}
    </button>
  );
}