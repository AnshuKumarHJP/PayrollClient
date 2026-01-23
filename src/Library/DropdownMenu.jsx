import * as React from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "./utils"
import AppIcon from "../Component/AppIcon";

/* ------------------------------------------------------------------ */
/* ROOTS */
/* ------------------------------------------------------------------ */
const DropdownMenu = DropdownMenuPrimitive.Root;
const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;
const DropdownMenuGroup = DropdownMenuPrimitive.Group;
const DropdownMenuPortal = DropdownMenuPrimitive.Portal;
const DropdownMenuSub = DropdownMenuPrimitive.Sub;
const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

/* ------------------------------------------------------------------ */
/* SUB TRIGGER */
/* ------------------------------------------------------------------ */
const DropdownMenuSubTrigger = React.forwardRef(
  ({ className, inset, children, ...props }, ref) => (
    <DropdownMenuPrimitive.SubTrigger
      ref={ref}
      className={cn(
        `
        flex cursor-pointer select-none items-center
        rounded-sm px-2 py-1.5 text-sm outline-none

        hover:bg-[var(--primary-50)]
        focus:bg-[var(--primary-50)]
        focus:text-[var(--primary-500)]

        data-[state=open]:bg-[var(--primary-100)]
        `,
        inset && "pl-8",
        className
      )}
      {...props}
    >
      {children}
      <AppIcon name="ChevronRight" className="ml-auto h-4 w-4" />
    </DropdownMenuPrimitive.SubTrigger>
  )
);
DropdownMenuSubTrigger.displayName = "DropdownMenuSubTrigger";

/* ------------------------------------------------------------------ */
/* SUB CONTENT */
/* ------------------------------------------------------------------ */
const DropdownMenuSubContent = React.forwardRef(
  ({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.SubContent
      ref={ref}
      className={cn(
        `
        z-[1100] min-w-32 overflow-hidden rounded-md border
        bg-white p-1 shadow-lg
        data-[state=open]:animate-in
        data-[state=closed]:animate-out
        `,
        className
      )}
      {...props}
    />
  )
);
DropdownMenuSubContent.displayName = "DropdownMenuSubContent";

/* ------------------------------------------------------------------ */
/* CONTENT */
/* ------------------------------------------------------------------ */
const DropdownMenuContent = React.forwardRef(
  ({ className, sideOffset = 4, ...props }, ref) => (
    <DropdownMenuPortal>
      <DropdownMenuPrimitive.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          `
          z-[1100] min-w-32 overflow-hidden rounded-md border
          bg-white p-1 shadow-md
          data-[state=open]:animate-in
          data-[state=closed]:animate-out
          `,
          className
        )}
        {...props}
      />
    </DropdownMenuPortal>
  )
);
DropdownMenuContent.displayName = "DropdownMenuContent";

/* ------------------------------------------------------------------ */
/* ITEM (HOVER ONLY MODIFIED) */
/* ------------------------------------------------------------------ */
const DropdownMenuItem = React.forwardRef(
  ({ className, inset, ...props }, ref) => (
    <DropdownMenuPrimitive.Item
      ref={ref}
      className={cn(
        `
        relative flex cursor-pointer select-none items-center
        rounded-sm px-2 py-1.5 text-sm outline-none transition-colors

        hover:bg-[var(--primary-50)]
        focus:bg-[var(--primary-50)]
        focus:text-[var(--primary-500)]

        data-disabled:pointer-events-none
        data-disabled:opacity-50
        `,
        inset && "pl-8",
        className
      )}
      {...props}
    />
  )
);
DropdownMenuItem.displayName = "DropdownMenuItem";

/* ------------------------------------------------------------------ */
/* CHECKBOX ITEM */
/* ------------------------------------------------------------------ */
const DropdownMenuCheckboxItem = React.forwardRef(
  ({ className, children, checked, ...props }, ref) => (
    <DropdownMenuPrimitive.CheckboxItem
      ref={ref}
      checked={checked}
      className={cn(
        `
        relative flex cursor-pointer select-none items-center
        rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors

        hover:bg-[var(--primary-50)]
        focus:bg-[var(--primary-50)]
        focus:text-[var(--primary-500)]

        data-disabled:pointer-events-none
        data-disabled:opacity-50
        `,
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <AppIcon name="Check" className="h-4 w-4 text-[var(--primary-500)]" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  )
);
DropdownMenuCheckboxItem.displayName = "DropdownMenuCheckboxItem";

/* ------------------------------------------------------------------ */
/* RADIO ITEM */
/* ------------------------------------------------------------------ */
const DropdownMenuRadioItem = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <DropdownMenuPrimitive.RadioItem
      ref={ref}
      className={cn(
        `
        relative flex cursor-pointer select-none items-center
        rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors

        hover:bg-[var(--primary-50)]
        focus:bg-[var(--primary-50)]
        focus:text-[var(--primary-500)]

        data-disabled:pointer-events-none
        data-disabled:opacity-50
        `,
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <AppIcon
            name="Circle"
            className="h-2 w-2 fill-current text-[var(--primary-500)]"
          />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  )
);
DropdownMenuRadioItem.displayName = "DropdownMenuRadioItem";

/* ------------------------------------------------------------------ */
/* LABEL & SEPARATOR */
/* ------------------------------------------------------------------ */
const DropdownMenuLabel = React.forwardRef(
  ({ className, inset, ...props }, ref) => (
    <DropdownMenuPrimitive.Label
      ref={ref}
      className={cn(
        "px-2 py-1.5 text-sm font-medium text-[var(--gray-500)]",
        inset && "pl-8",
        className
      )}
      {...props}
    />
  )
);
DropdownMenuLabel.displayName = "DropdownMenuLabel";

const DropdownMenuSeparator = React.forwardRef(
  ({ className, ...props }, ref) => (
    <DropdownMenuPrimitive.Separator
      ref={ref}
      className={cn("-mx-1 my-1 h-px bg-[var(--stroke-gray-300)]", className)}
      {...props}
    />
  )
);
DropdownMenuSeparator.displayName = "DropdownMenuSeparator";

/* ------------------------------------------------------------------ */
/* SHORTCUT */
/* ------------------------------------------------------------------ */
const DropdownMenuShortcut = ({ className, ...props }) => (
  <span
    className={cn(
      "ml-auto text-xs tracking-widest text-[var(--gray-400)]",
      className
    )}
    {...props}
  />
);
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";

/* ------------------------------------------------------------------ */
/* EXPORTS */
/* ------------------------------------------------------------------ */
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
};
