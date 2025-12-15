import { useState, useEffect } from "react";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../Lib/select";
import { Switch } from "../Lib/switch";
import { Input } from "../Lib/input";
import { Button } from "../Lib/button";
import { cn } from "../Lib/utils";
import { UploadCloud, Delete, FileIcon, Loader2 } from "lucide-react";
import { toast } from "../Lib/use-toast";
import axios from "axios";

/* ===========================================================
   MAIN INPUT RENDERER
=========================================================== */

const FormInputTypes = (f = {}, value, onChange, hasError = false) => {
  const typeRaw = (f.InputType || f.DataType || "string").toLowerCase();
  const disabled = Boolean(f.DefaultDisable);
  const type = typeRaw;

  /* ---------------- FILE ---------------- */
  if (type === "file" || type === "image" || type === "document") {
    return (
      <div className="flex flex-col items-start w-full max-w-[280px]">
        <label className="w-full">
          <div
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
          </div>

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
          <div className="mt-2 flex items-center gap-2 bg-emerald-50 px-2 py-1 rounded-md text-xs text-emerald-700 border border-emerald-200 w-fit">
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
          </div>
        )}
      </div>
    );
  }

  /* ---------------- SWITCH ---------------- */
  if (["boolean", "switch"].includes(type)) {
    return (
      <div className="flex items-center gap-2">
        <Switch
          checked={Boolean(value)}
          onCheckedChange={(v) => onChange(Boolean(v))}
          disabled={disabled}
        />
        <span className="text-xs text-gray-700">{value ? "True" : "False"}</span>
      </div>
    );
  }

  /* ---------------- RADIO ---------------- */
  if (type === "radio") {
    return (
      <div className="flex flex-col gap-2">
        {f.Options?.map((o, i) => (
          <label key={i} className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              disabled={disabled}
              checked={value === o}
              onChange={() => onChange(o)}
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
          <label key={i} className="flex items-center gap-2 text-sm">
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
          </label>
        ))}
      </div>
    );
  }

  /* ---------------- MULTI SELECT ---------------- */
  if (type === "multi-select") {
    return (
      <MultiSelectComponent
        f={f}
        value={value}
        onChange={onChange}
        hasError={hasError}
        disabled={disabled}
      />
    );
  }

  /* ---------------- API SELECT ---------------- */
  if (type === "api-select" || type === "select") {
    return (
      <SelectComponent
        f={f}
        value={value}
        onChange={onChange}
        hasError={hasError}
        disabled={disabled}
      />
    );
  }

  /* ---------------- TAGS ---------------- */
  if (type === "tags") {
    const tags = Array.isArray(value) ? value : [];
    return (
      <Input
        type="text"
        placeholder="Type and press Enter"
        value=""
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            const v = e.target.value.trim();
            if (v) onChange([...tags, v]);
            e.target.value = "";
          }
        }}
      />
    );
  }

  /* ---------------- TEXTAREA ---------------- */
  if (type === "textarea") {
    return (
      <textarea
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

  /* ---------------- PASSWORD ---------------- */
  if (type === "password") {
    return (
      <Input
        type="password"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(hasError && "border-red-400")}
      />
    );
  }

  /* ---------------- TEL ---------------- */
  if (type === "tel") {
    return (
      <Input
        type="tel"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Phone number"
        disabled={disabled}
        className={cn(hasError && "border-red-400")}
      />
    );
  }

  /* ---------------- URL ---------------- */
  if (type === "url") {
    return (
      <Input
        type="url"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="https://example.com"
        disabled={disabled}
        className={cn(hasError && "border-red-400")}
      />
    );
  }

  /* ---------------- DATE & TIME TYPES ---------------- */
  if (type === "datetime" || type === "datetime-local") {
    return (
      <Input
        type="datetime-local"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(hasError && "border-red-400")}
      />
    );
  }

  if (type === "month") {
    return (
      <Input
        type="month"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    );
  }

  if (type === "year") {
    return (
      <Input
        type="number"
        min="1900"
        max="2100"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    );
  }

  if (type === "time") {
    return (
      <Input
        type="time"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    );
  }

  /* ---------------- COLOR ---------------- */
  if (type === "color") {
    return (
      <Input
        type="color"
        value={value || "#000000"}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    );
  }

  /* ---------------- RANGE ---------------- */
  if (type === "range") {
    return (
      <Input
        type="range"
        min={f.min || 0}
        max={f.max || 100}
        value={value || 0}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    );
  }

  /* ---------------- NUMBER ---------------- */
  if (type === "number") {
    return (
      <Input
        type="number"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={cn(hasError && "border-red-400")}
      />
    );
  }

  /* ---------------- DEFAULT TEXT ---------------- */
  return (
    <Input
      type="text"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={f.FormFieldName || ""}
      disabled={disabled}
      className={cn(hasError && "border-red-400")}
    />
  );
};

/* ================= SELECT COMPONENT ================= */

const SelectComponent = ({ f, value, onChange, hasError, disabled }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

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
      } else if (Array.isArray(f.Options)) {
        setOptions(f.Options.map((o) => ({
          label: typeof o === "object" ? o.label : o,
          value: typeof o === "object" ? o.value : o
        })));
      }
    };

    load();
  }, [f.apiUrl, f.Options]);

  if (loading) return <Loader2 className="h-4 w-4 animate-spin" />;

  return (
    <Select value={value} onValueChange={onChange} disabled={disabled}>
      <SelectTrigger className={cn(hasError && "border-red-400")}>
        <SelectValue placeholder="Select" />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt, i) => (
          <SelectItem key={i} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FormInputTypes;
