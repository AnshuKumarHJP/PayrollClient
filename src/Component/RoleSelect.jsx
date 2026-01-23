import React from "react";
import { STATIC_ROLES } from "../Data/StaticData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../Library/Select";

const RoleSelect = ({ value, onChange, placeholder = "Select your Role", allowNone = false }) => {
  const handleValueChange = (v) => {
    if (v === "none") {
      onChange("");
    } else {
      onChange(v);
    }
  };

  return (
    <Select value={value ? value.toString() : (allowNone ? "none" : "")} onValueChange={handleValueChange}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {allowNone && (
          <SelectItem value="none">None</SelectItem>
        )}
        {STATIC_ROLES.map((role) => (
          <SelectItem key={role.RoleCode} value={role.RoleCode.toString()}>
            {role.Role_Name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default RoleSelect;
