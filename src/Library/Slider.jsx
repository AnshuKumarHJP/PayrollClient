import React from "react";
import clsx from "clsx";

const sizeMap = {
  sm: {
    track: "h-[var(--slider-sm-h)]",
    thumb: "h-[var(--slider-thumb-sm)] w-[var(--slider-thumb-sm)]",
  },
  md: {
    track: "h-[var(--slider-md-h)]",
    thumb: "h-[var(--slider-thumb-md)] w-[var(--slider-thumb-md)]",
  },
  lg: {
    track: "h-[var(--slider-lg-h)]",
    thumb: "h-[var(--slider-thumb-lg)] w-[var(--slider-thumb-lg)]",
  },
};

const variantMap = {
  primary: "bg-[var(--variant-primary)]",
  success: "bg-[var(--variant-success)]",
  danger: "bg-[var(--variant-danger)]",
};

export function Slider({
  value,
  defaultValue = 0,
  min = 0,
  max = 100,
  size = "md",
  variant = "primary",
  onChange,
}) {
  const [internal, setInternal] = React.useState(defaultValue);
  const current = value ?? internal;
  const percent = ((current - min) / (max - min)) * 100;

  return (
    <div className="w-full">
      <div
        className={clsx(
          "relative rounded-full bg-[var(--variant-muted)]",
          sizeMap[size].track
        )}
      >
        <div
          className={clsx(
            "absolute left-0 top-0 rounded-full",
            sizeMap[size].track,
            variantMap[variant]
          )}
          style={{ width: `${percent}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={current}
          onChange={(e) => {
            const v = +e.target.value;
            setInternal(v);
            onChange?.(v);
          }}
          className="absolute inset-0 w-full opacity-0 cursor-pointer"
        />
        <span
          className={clsx(
            "absolute top-1/2 -translate-y-1/2 rounded-full",
            sizeMap[size].thumb,
            variantMap[variant]
          )}
          style={{ left: `calc(${percent}% - 8px)` }}
        />
      </div>
    </div>
  );
}