import clsx from "clsx";
import AppIcon from "../Component/AppIcon";

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
    icon: "Info",
    flexDirection: "flex-row",
  },
  success: {
    wrap:
      "bg-[var(--alert-success-bg)] text-[var(--alert-success-text)] border-[var(--alert-success-border)]",
    icon: "CircleCheckBig",
    flexDirection: "flex-row",
  },
  warning: {
    wrap:
      "bg-[var(--alert-warning-bg)] text-[var(--alert-warning-text)] border-[var(--alert-warning-border)]",
    icon: "AlertTriangle",
    flexDirection: "flex-row",
  },
  danger: {
    wrap:
      "bg-[var(--alert-danger-bg)] text-[var(--alert-danger-text)] border-[var(--alert-danger-border)]",
    icon: "XCircle",
    flexDirection: "flex-row",
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
        variantMap[variant].flexDirection,
        className
      )}
    >
      {icon && (
        <AppIcon name={variantMap[variant].icon} size={16} className="mt-0.5" />
      )}

      <div className="flex-1">{children}</div>

      {closable && (
        <button
          onClick={onClose}
          className="ml-2 opacity-70 hover:opacity-100"
        >
          <AppIcon name="XCircle" size={16} />
        </button>
      )}
    </div>
  );
}