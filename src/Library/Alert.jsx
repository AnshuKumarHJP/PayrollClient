import clsx from "clsx";

/**
 * Props
 * - variant: info | success | warning | danger
 * - size: sm | md | lg
 * - icon (optional)
 * - closable
 */

const sizeMap = {
  sm: "px-[var(--alert-sm-px)] py-2 text-p11",
  md: "px-[var(--alert-md-px)] py-2.5 text-p",
  lg: "px-[var(--alert-lg-px)] py-3 text-lead",
};

const variantMap = {
  info: {
    wrap:
      "bg-[var(--alert-info-bg)] text-[var(--alert-info-text)] border-[var(--alert-info-border)]",
    icon: "pi pi-info-circle",
  },
  success: {
    wrap:
      "bg-[var(--alert-success-bg)] text-[var(--alert-success-text)] border-[var(--alert-success-border)]",
    icon: "pi pi-check",
  },
  warning: {
    wrap:
      "bg-[var(--alert-warning-bg)] text-[var(--alert-warning-text)] border-[var(--alert-warning-border)]",
    icon: "pi pi-exclamation-triangle",
  },
  danger: {
    wrap:
      "bg-[var(--alert-danger-bg)] text-[var(--alert-danger-text)] border-[var(--alert-danger-border)]",
    icon: "pi pi-times-circle",
  },
};

export function Alert({
  children,
  variant = "info",
  size = "md",
  icon = true,
  closable = false,
  onClose,
  className,
}) {
  return (
    <div
      className={clsx(
        "flex items-start gap-2 border rounded-[var(--alert-radius)]",
        sizeMap[size],
        variantMap[variant].wrap,
        className
      )}
    >
      {icon && (
        <i className={clsx(variantMap[variant].icon, "mt-0.5")} />
      )}

      <div className="flex-1">{children}</div>

      {closable && (
        <button
          onClick={onClose}
          className="ml-2 opacity-70 hover:opacity-100"
        >
          <i className="pi pi-times" />
        </button>
      )}
    </div>
  );
}