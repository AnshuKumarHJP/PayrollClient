import React from "react";
import clsx from "clsx";

const sizeMap = {
  sm: {
    box: "w-[var(--control-sm)] h-[var(--control-sm)]",
    radius: "rounded-[var(--control-radius-sm)]",
  },
  md: {
    box: "w-[var(--control-md)] h-[var(--control-md)]",
    radius: "rounded-[var(--control-radius-md)]",
  },
  lg: {
    box: "w-[var(--control-lg)] h-[var(--control-lg)]",
    radius: "rounded-[var(--control-radius-lg)]",
  },
};

const variantMap = {
  primary: "border-[var(--control-primary)] bg-[var(--control-primary)]",
  success: "border-[var(--control-success)] bg-[var(--control-success)]",
  danger: "border-[var(--control-danger)] bg-[var(--control-danger)]",
};

export function Checkbox({
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
    setInternal(!isChecked);
    onChange?.(!isChecked);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={disabled}
      className={clsx(
        "flex items-center justify-center border transition",
        sizeMap[size].box,
        sizeMap[size].radius,
        isChecked
          ? variantMap[variant]
          : "border-[var(--control-muted)] bg-[var(--control-bg)]",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {isChecked && (
        <i className="pi pi-check text-white text-[10px]" />
      )}
    </button>
  );
}