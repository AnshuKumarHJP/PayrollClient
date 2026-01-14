import React, { useState, useEffect, useMemo } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../Lib/select";
import { Switch } from "../Lib/switch";
import { Input } from "../Lib/input";
import { Button } from "../Lib/button";
import { cn } from "../Lib/utils";
import { toast } from "../Lib/use-toast";
import axios from "axios";
import { motion } from "framer-motion";
import AppIcon from "./AppIcon";

/* ===========================================================
   ANIMATION VARIANTS
=========================================================== */
const fade = {
  hidden: { opacity: 0, y: 4 },
  show: { opacity: 1, y: 0, transition: { duration: 0.15 } }
};

const fadeFast = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.12 } }
};

/* ===========================================================
   ✅ FIXED COMPONENT SIGNATURE (CRITICAL)
=========================================================== */
const FormInputTypes = ({
  f = {},
  value,
  onChange,
  hasError = false
}) => {
  const type = (f.InputType || f.DataType || "text").toLowerCase();
  // ✅ FIXED
  const disabled = Boolean(f.Disabled);

  const placeholder =
    f.Placeholder && f.Placeholder.trim()
      ? f.Placeholder
      : `${["select", "api-select"].includes(type) ? "Select" : "Enter"} ${f.Label || "Field"}`;

  /* ---------------- FILE ---------------- */
  if (["file", "image", "document"].includes(type)) {
    return (
      <motion.div variants={fade} initial="hidden" animate="show">
        <label className="w-full cursor-pointer">
          <div
            className={cn(
              "flex items-center justify-center h-9 border border-dashed rounded-md gap-2 text-sm",
              disabled
                ? "bg-gray-100 text-gray-400"
                : hasError
                ? "border-red-400 text-red-600"
                : "border-emerald-400 text-emerald-700 hover:bg-emerald-50"
            )}
          >
            <AppIcon name="UploadCloud" className="h-4 w-4" />
            Choose File
          </div>

          {!disabled && (
            <input
              type="file"
              accept={f.Accept || "*"}
              hidden
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onChange?.(file.name);
                  toast({
                    title: "File Selected",
                    description: file.name
                  });
                }
              }}
            />
          )}
        </label>
      </motion.div>
    );
  }

  /* ---------------- SWITCH ---------------- */
  if (["boolean", "switch"].includes(type)) {
    return (
      <Switch
        checked={Boolean(value)}
        onCheckedChange={(v) => onChange?.(Boolean(v))}
        disabled={disabled}
      />
    );
  }

  /* ---------------- RADIO ---------------- */
  if (type === "radio") {
    return (
      <div className="flex flex-col gap-2">
        {f.Options?.map((o, i) => (
          <label key={i} className="flex items-center gap-2">
            <input
              type="radio"
              checked={value === o}
              disabled={disabled}
              onChange={() => onChange?.(o)}
            />
            {o}
          </label>
        ))}
      </div>
    );
  }

  /* ---------------- CHECKBOX GROUP ---------------- */
  if (type === "checkbox-group") {
    const arr = Array.isArray(value) ? value : [];
    return (
      <div className="flex flex-col gap-2">
        {f.Options?.map((o, i) => (
          <label key={i} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={arr.includes(o)}
              disabled={disabled}
              onChange={(e) =>
                onChange?.(
                  e.target.checked ? [...arr, o] : arr.filter((x) => x !== o)
                )
              }
            />
            {o}
          </label>
        ))}
      </div>
    );
  }

  /* ---------------- SELECT ---------------- */
  if (["select", "api-select"].includes(type)) {
    return (
      <SelectComponent
        f={{ ...f, Placeholder: placeholder }}
        value={value}
        onChange={onChange}
        hasError={hasError}
        disabled={disabled}
      />
    );
  }

  /* ---------------- TEXTAREA ---------------- */
  if (type === "textarea") {
    return (
      <textarea
        value={value ?? ""}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className={cn(
          "w-full p-2 border rounded-md",
          hasError && "border-red-400"
        )}
      />
    );
  }

  /* ---------------- DEFAULT INPUT ---------------- */
  return (
    <Input
      type={type}
      value={value ?? ""}
      onChange={(e) => onChange?.(e.target.value)}
      disabled={disabled}
      placeholder={placeholder}
      className={cn(hasError && "border-red-400")}
    />
  );
};

/* ================= SELECT COMPONENT ================= */

const SelectComponent = ({ f, value, onChange, hasError, disabled }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const staticOptions = useMemo(
    () =>
      Array.isArray(f.Options)
        ? f.Options.map((o) => ({
            label: typeof o === "object" ? o.label : o,
            value: typeof o === "object" ? o.value : o
          }))
        : [],
    [f.Options]
  );

  useEffect(() => {
    const load = async () => {
      if (!f.apiUrl) return setOptions(staticOptions);
      setLoading(true);
      try {
        const res = await axios.get(f.apiUrl);
        setOptions(
          res.data.map((x) => ({
            label: x[f.LabelKey || "name"],
            value: x[f.ValueKey || "id"]
          }))
        );
      } catch {
        setOptions([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [f.apiUrl, staticOptions]);

  if (loading) return <AppIcon name="Loader2" className="animate-spin" />;

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className={cn(hasError && "border-red-400")}>
        <SelectValue placeholder={f.Placeholder} />
      </SelectTrigger>

      <SelectContent>
        {options.map((o, i) => (
          <SelectItem key={i} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default React.memo(FormInputTypes);
