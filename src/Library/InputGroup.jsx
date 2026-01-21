// InputGroup.jsx
import React from "react";
import clsx from "clsx";

export function InputGroup({ children, className }) {
  return (
    <div className={clsx("grid grid-cols-2 gap-3", className)}>
      {children}
    </div>
  );
}
