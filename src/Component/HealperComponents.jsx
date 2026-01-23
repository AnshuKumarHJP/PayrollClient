import React from 'react'
import { Badge } from "../Library/Badge";
import { Severities } from '../Data/StaticData';

/* =====================================================
   SEVERITY → BADGE COLOR MAP
===================================================== */
const severityClassMap = {
  None: "bg-gray-200 text-gray-700",
  High: "bg-red-200 text-red-800",
  Medium: "bg-yellow-200 text-yellow-800",
  Low: "bg-green-200 text-green-800"
};

/* =====================================================
   SEVERITY BADGE COMPONENT
===================================================== */
// Usage: <SeverityBadge value={1} />
// Usage: <SeverityBadge label="High" />
export const SeverityBadge = ({ value, label }) => {
  const severity =
    label ??
    Severities.find((s) => s.value === Number(value))?.label ??
    "None";

  return (
    <Badge
      className={`text-xs font-medium ${
        severityClassMap[severity] || severityClassMap.None
      }`}
    >
      {severity}
    </Badge>
  );
};

export const ActiveBadge = ({ value }) => {
  const isActive = value === true || value === 1;

  return (
    <Badge
      className={`text-xs font-medium ${
        isActive
          ? "bg-green-200 text-green-800"
          : "bg-gray-200 text-gray-700"
      }`}
    >
      {isActive ? "Active" : "Inactive"}
    </Badge>
  );
};