import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "@/lib/utils";
import AppIcon from "../Component/AppIcon";

export function MultiSelect({
  options = [],
  value = [],
  onChange = () => {},
  placeholder = "Select options",
}) {
  const [open, setOpen] = React.useState(false);

  const handleItemSelect = (val) => {
    let updated = [...value];
    updated = updated.includes(val)
      ? updated.filter((v) => v !== val)
      : [...updated, val];

    onChange(updated);
  };

  const displayText =
    value.length === 0
      ? placeholder
      : options
          .filter((opt) => value.includes(opt.value))
          .map((opt) => opt.label)
          .join(", ");

  return (
    <div className="w-full"> 
      <SelectPrimitive.Root open={open} onOpenChange={setOpen}>

        {/* Trigger = ALWAYS FULL WIDTH */}
        <SelectPrimitive.Trigger
          className={cn(
            "flex w-full items-center justify-between rounded-md border border-input",
            "bg-background px-3 py-1.5 text-sm",
            "focus:outline-none focus:ring-1 focus:ring-emerald-600"
          )}
        >
          <span className="truncate">{displayText}</span>
          <AppIcon name="ChevronDown" className="h-4 w-4 opacity-50" />
        </SelectPrimitive.Trigger>

        {/* Dropdown = ALSO FULL WIDTH */}
        <SelectPrimitive.Content
          position="popper"
          sideOffset={4}
          className={cn(
            "w-[var(--radix-select-trigger-width)]",  // 🔥 auto matches trigger width
            "rounded-md border bg-white shadow z-50"
          )}
        >
          <SelectPrimitive.Viewport className="p-2 max-h-64 overflow-y-auto w-full">

            {options.map((opt) => {
              const isSelected = value.includes(opt.value);

              return (
                <div
                  key={opt.value}
                  className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-emerald-50 rounded"
                  onClick={() => handleItemSelect(opt.value)}
                >
                  {/* Checkbox */}
                  <div
                    className={cn(
                      "h-4 w-4 border rounded flex items-center justify-center",
                      isSelected ? "bg-emerald-600 border-emerald-600" : ""
                    )}
                  >
                    {isSelected && <AppIcon name="Check" className="h-3 w-3 text-white" />}
                  </div>

                  <span className="text-sm">{opt.label}</span>
                </div>
              );
            })}

          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Root>
    </div>
  );
}
