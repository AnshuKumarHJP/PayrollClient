import React, { useState, useEffect, useMemo } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../Lib/select";
import { Switch } from "../Lib/switch";
import { Input } from "../Lib/input";
import { Button } from "../Lib/button";
import { cn } from "../Lib/utils";
import { UploadCloud, Delete, FileIcon, Loader2 } from "lucide-react";
import { toast } from "../Lib/use-toast";
import axios from "axios";
import { motion } from "framer-motion";

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

const FormInputTypes = (f = {}, value, onChange, hasError = false) => {
  const typeRaw = (f.InputType || f.DataType || "string").toLowerCase();
  const disabled = Boolean(f.DefaultDisable);
  const type = typeRaw;

  /* ---------------- FILE ---------------- */
  if (type === "file" || type === "image" || type === "document") {
    return (
      <motion.div
        variants={fade}
        initial="hidden"
        animate="show"
        className="flex flex-col items-start w-full max-w-[280px]"
      >
        <label className="w-full">
          <motion.div
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            className={cn(
              "flex items-center justify-center w-full h-9 border border-dashed rounded-md text-xs md:text-sm font-medium gap-2",
              disabled
                ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                : hasError
                ? "border-red-400 bg-red-50 text-red-700"
                : "border-emerald-400 text-emerald-700 hover:bg-emerald-50 cursor-pointer"
            )}
          >
            <UploadCloud className="h-4 w-4" />
            <span>{disabled ? "File Disabled" : "Choose File"}</span>
          </motion.div>

          {!disabled && (
            <input
              type="file"
              accept={f.Accept || "*"}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  onChange(file.name);
                  toast({
                    title: "File Selected",
                    description: `${file.name} (${(file.size / 1024).toFixed(1)} KB)`
                  });
                }
              }}
            />
          )}
        </label>

        {value && (
          <motion.div
            variants={fadeFast}
            initial="hidden"
            animate="show"
            className="mt-2 flex items-center gap-2 bg-emerald-50 px-2 py-1 rounded-md text-xs text-emerald-700 border border-emerald-200 w-fit"
          >
            <FileIcon className="h-3 w-3" />
            <span className="truncate max-w-[160px]">{value}</span>

            {!disabled && (
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 text-red-500 hover:text-red-700"
                onClick={() => onChange("")}
                type="button"
              >
                <Delete className="h-3 w-3" />
              </Button>
            )}
          </motion.div>
        )}
      </motion.div>
    );
  }

  /* ---------------- SWITCH ---------------- */
  if (["boolean", "switch"].includes(type)) {
    return (
      <motion.div
        variants={fade}
        initial="hidden"
        animate="show"
        className="flex items-center gap-2"
      >
        <Switch
          checked={Boolean(value)}
          onCheckedChange={(v) => onChange(Boolean(v))}
          disabled={disabled}
        />
        <span className="text-xs text-gray-700">{value ? "True" : "False"}</span>
      </motion.div>
    );
  }

  /* ---------------- RADIO ---------------- */
  if (type === "radio") {
    return (
      <motion.div
        variants={fade}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-2"
      >
        {f.Options?.map((o, i) => (
          <motion.label key={i} variants={fadeFast} className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              disabled={disabled}
              checked={value === o}
              onChange={() => onChange(o)}
            />
            {o}
          </motion.label>
        ))}
      </motion.div>
    );
  }

  /* ---------------- CHECKBOX GROUP ---------------- */
  if (type === "checkbox-group") {
    const arr = Array.isArray(value) ? value : [];

    return (
      <motion.div variants={fade} initial="hidden" animate="show" className="flex flex-col gap-2">
        {f.Options?.map((o, i) => (
          <motion.label key={i} variants={fadeFast} className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              disabled={disabled}
              checked={arr.includes(o)}
              onChange={(e) => {
                const newArr = e.target.checked
                  ? [...arr, o]
                  : arr.filter((x) => x !== o);

                onChange(newArr);
              }}
            />
            {o}
          </motion.label>
        ))}
      </motion.div>
    );
  }

  /* ---------------- SELECT ---------------- */
  if (type === "api-select" || type === "select") {
    return (
      <motion.div variants={fade} initial="hidden" animate="show">
        <SelectComponent
          f={f}
          value={value}
          onChange={onChange}
          hasError={hasError}
          disabled={disabled}
        />
      </motion.div>
    );
  }

  /* ---------------- TEXTAREA ---------------- */
  if (type === "textarea") {
    return (
      <motion.textarea
        variants={fade}
        initial="hidden"
        animate="show"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(
          "w-full p-2 border rounded-md",
          hasError && "border-red-400",
          disabled && "bg-gray-100 text-gray-400 cursor-not-allowed"
        )}
      />
    );
  }

  /* ---------------- DEFAULT TEXT & NUMBER ---------------- */
  
  return (
    <motion.div variants={fade} initial="hidden" animate="show">
      <Input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={f.Placeholder || f.FormFieldName || ""}
        className={cn(hasError && "border-red-400")}
      />
    </motion.div>
  );
};


/* ================= SELECT COMPONENT ================= */

const SelectComponent = ({ f, value, onChange, hasError, disabled }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const staticOptions = useMemo(() => {
    if (Array.isArray(f.Options)) {
      return f.Options.map((o) => ({
        label: typeof o === "object" ? o.label : o,
        value: typeof o === "object" ? o.value : o
      }));
    }
    return [];
  }, [f.Options]);

  useEffect(() => {
    const load = async () => {
      if (f.apiUrl) {
        setLoading(true);
        try {
          const res = await axios.get(f.apiUrl);
          const data = res.data;

          const opts = data.map((item) => ({
            label: item[f.labelKey || "label"] || item.name,
            value: item[f.valueKey || "value"] || item.id
          }));

          setOptions(opts);
        } catch {
          setOptions([]);
        } finally {
          setLoading(false);
        }
      } else {
        setOptions(staticOptions);
      }
    };

    load();
  }, [f.apiUrl, staticOptions]);

  if (loading) return <Loader2 className="h-4 w-4 animate-spin" />;

  return (
    <motion.div variants={fadeFast} initial="hidden" animate="show">
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className={cn(hasError && "border-red-400")}>
          <SelectValue placeholder="Select" />
        </SelectTrigger>

        <SelectContent>
          {options.map((opt, i) => (
            <SelectItem
              key={i}
              value={opt.value}
            >
              <span className="text-sm">{opt.label}</span>
            </SelectItem>
          ))}
        </SelectContent>

      </Select>
    </motion.div>
  );
};

export default React.memo(FormInputTypes);
