import React, { useState, useEffect, useMemo } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../Library/Select";
import { Switch } from "../Library/Switch";
import { Input } from "../Library/Input";
import Textarea from "../Library/Textarea";
import { cn } from "../Library/utils";
import { toast } from "../Library/use-toast";
import axios from "axios";
import { motion } from "framer-motion";
import AppIcon from "./AppIcon";
import FileInputWithModal from "../Library/FileInputWithModal";
import { Popover, PopoverContent, PopoverTrigger } from "../Library/Popover";
import { Button } from "../Library/Button";
import SimpleCalendar from "./SimpleCalendar";

/* ===========================================================
   ANIMATION VARIANTS
=========================================================== */
const fade = {
  hidden: { opacity: 0, y: 4 },
  show: { opacity: 1, y: 0, transition: { duration: 0.15 } }
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
  const [open, setOpen] = useState(false);

  const placeholder =
    f.Placeholder && f.Placeholder.trim()
      ? f.Placeholder
      : `${["select", "api-select"].includes(type) ? "Select" : "Enter"} ${f.Label || "Field"}`;

  /* ---------------- FILE ---------------- */
  if (["file", "image", "document"].includes(type)) {
    return (
      <motion.div variants={fade} initial="hidden" animate="show">
        <FileInputWithModal
          label={f.Label}
          error={hasError}
          mand={f.Required}
          allowTypes={f.Accept ? f.Accept.split(',').map(t => t.trim()) : [".xlsx", ".xls", ".csv"]}
          view={true}
          download={true}
          onChangeFile={(file) => {
            if (file) {
              // console.log("FormInputTypes - File Changed:", file);
              // Prioritize Document ID (Result), then filename
              const docId = file.Result;
              const fileName = file.name || file.filename;

              // console.log("FormInputTypes - Value to Set:", docId || fileName);

              // Pass the ID if available, otherwise the filename (as placeholder)
              onChange?.(docId || fileName);

              toast({
                title: "File Selected",
                description: fileName || "File uploaded successfully",
              });
            } else {
              // console.log("FormInputTypes - File Cleared");
              onChange?.(null);
            }
          }}
        />
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
      <Textarea
        value={value ?? ""}
        rows={2}
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

  /* ---------------- DATE ---------------- */
  if (type === "date") {
    const displayValue = value ? new Date(value).toLocaleDateString() : "";
    // const [open, setOpen] = useState(false); // Moved to top level

    const handleDateSelect = (date) => {
      if (!date) return;
      // Format to YYYY-MM-DD for form compatibility
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      onChange?.(`${y}-${m}-${d}`);
      setOpen(false);
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            className={cn(
              "flex h-10 w-full items-center bg-white dark:bg-slate-800 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              !value && "text-slate-400",
              hasError && "border-red-400",
              "hover:bg-slate-50 transition-colors border border-slate-200 dark:border-slate-700"
            )}
            disabled={disabled}
          >
            <AppIcon name="Calendar" className="mr-3 h-4 w-4 shrink-0 text-slate-400" />
            <span className="flex-1 truncate text-left">
              {value ? displayValue : placeholder}
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <SimpleCalendar
            selectedDate={value}
            onSelect={handleDateSelect}
            disablePast={f.DisablePast || f.Validation?.DisablePast}
            disableFuture={f.DisableFuture || f.Validation?.DisableFuture}
            minDate={f.MinDate || f.Validation?.MinDate}
            maxDate={f.MaxDate || f.Validation?.MaxDate}
          />
        </PopoverContent>
      </Popover>
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
      className={cn("text-sm", hasError && "border-red-400")}
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
