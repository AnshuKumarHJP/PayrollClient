import React from "react";
import clsx from "clsx";

/**
 * Props
 * - items: [{ label, value, content, icon }]
 * - value
 * - onChange
 * - size: sm | md | lg
 * - headerVariant: default | pill | outline
 */

const sizeMap = {
  sm: "h-[var(--tab-sm-h)] text-p11 px-3",
  md: "h-[var(--tab-md-h)] text-p px-3.5",
  lg: "h-[var(--tab-lg-h)] text-lead px-4",
};

const headerVariantMap = {
  default: "bg-[var(--tab-header-default-bg)]",
  pill: "bg-[var(--tab-header-pill-bg)] p-1 rounded-[var(--tab-radius)]",
  outline:
    "border border-[var(--tab-header-outline-border)] rounded-[var(--tab-radius)] p-1",
};

export function Tabs({
  items,
  value,
  onChange,
  size = "md",
  headerVariant = "default",
  className,
}) {
  const activeItem = items.find((t) => t.value === value);

  return (
    <div className={clsx("w-full", className)}>
      {/* ---------- TAB HEADER ---------- */}
      <div
        className={clsx(
          "inline-flex gap-1",
          headerVariantMap[headerVariant]
        )}
      >
        {items.map((tab) => {
          const active = tab.value === value;

          return (
            <button
              key={tab.value}
              onClick={() => onChange(tab.value)}
              className={clsx(
                "flex items-center gap-1 rounded-[var(--tab-radius)] transition font-medium",
                sizeMap[size],
                active
                  ? "bg-[var(--tab-active-bg)] text-[var(--tab-active-text)]"
                  : "bg-[var(--tab-inactive-bg)] text-[var(--tab-inactive-text)] hover:bg-white"
              )}
            >
              {tab.icon && <i className={clsx("pi", tab.icon)} />}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ---------- TAB BODY ---------- */}
      <div className="mt-4">
        {activeItem?.content}
      </div>
    </div>
  );
}