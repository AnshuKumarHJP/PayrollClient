// src/components/AppIcon.jsx
import * as Icons from "lucide-react";

const AppIcon = ({ name, size = 20, className = "", ...props }) => {
  const Icon = Icons[name];

  if (!Icon) return null;

  return <Icon size={size} className={className} {...props} />;
};

export default AppIcon;
