// src/components/AppIcon.jsx
import * as Icons from "lucide-react";

const AppIcon = ({ name, size = 15, className = "", ...props }) => {
  if (!name) return null;

  // Normalize name: kebab-case or underscore_case to PascalCase
  const normalizedName = name
    .split(/[-_]/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");

  const Icon = Icons[normalizedName] || Icons[name];

  if (!Icon) return null;

  return <Icon size={size} className={className} {...props} />;
};

export default AppIcon;
