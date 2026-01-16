import React from "react";

function Badge({ children, className = "" }) {
  return <span className={`inline-block text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 ${className}`}>{children}</span>;
}

function IconButton({ children, onClick, title, className = "", type = "button" }) {
  return (
    <button
      type={type}
      title={title}
      onClick={onClick}
      className={`p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors ${className}`}
    >
      {children}
    </button>
  );
}

export { Badge, IconButton };