// Drawer.jsx (FULL RESPONSIVE, TOKEN-DRIVEN)
import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import AppIcon from "../Component/AppIcon";

/* ---------- ROOT ---------- */
export const Drawer = Dialog.Root;
export const DrawerTrigger = Dialog.Trigger;

/* ---------- OVERLAY ---------- */
export const DrawerOverlay = React.forwardRef((props, ref) => (
  <Dialog.Overlay
    ref={ref}
    className="fixed inset-0 bg-[var(--drawer-overlay-bg)] backdrop-blur-sm animate-in fade-in"
    {...props}
  />
));
DrawerOverlay.displayName = "DrawerOverlay";

/* ---------- VARIANTS ---------- */
const drawerVariants = cva(
  "fixed bg-[var(--drawer-bg)] shadow-xl flex flex-col animate-in",
  {
    variants: {
      side: {
        right:
          "right-0 top-0 h-screen slide-in-from-right-full",
        left:
          "left-0 top-0 h-screen slide-in-from-left-full",
        bottom:
          "bottom-0 left-0 w-full slide-in-from-bottom-full",
      },
      size: {
        sm: "",
        md: "",
        lg: "",
        full: "w-full h-screen rounded-none",
      },
    },
    compoundVariants: [
      { side: "right", size: "sm", className: "w-[var(--drawer-sm-w)]" },
      { side: "right", size: "md", className: "w-[var(--drawer-md-w)]" },
      { side: "right", size: "lg", className: "w-[var(--drawer-lg-w)]" },

      { side: "left", size: "sm", className: "w-[var(--drawer-sm-w)]" },
      { side: "left", size: "md", className: "w-[var(--drawer-md-w)]" },
      { side: "left", size: "lg", className: "w-[var(--drawer-lg-w)]" },

      {
        side: "bottom",
        size: "sm",
        className: "h-[50vh] w-full rounded-t-[var(--drawer-radius)]",
      },
      {
        side: "bottom",
        size: "md",
        className: "h-[var(--drawer-bottom-h)] w-full rounded-t-[var(--drawer-radius)]",
      },
      {
        side: "bottom",
        size: "lg",
        className: "h-[85vh] w-full rounded-t-[var(--drawer-radius)]",
      },
    ],
    defaultVariants: {
      side: "right",
      size: "md",
    },
  }
);

/* ---------- CONTENT ---------- */
export const DrawerContent = React.forwardRef(
  ({ className, side, size, ...props }, ref) => (
    <Dialog.Portal>
      <DrawerOverlay />
      <Dialog.Content
        ref={ref}
        className={cn(drawerVariants({ side, size }), className)}
        {...props}
      />
    </Dialog.Portal>
  )
);
DrawerContent.displayName = "DrawerContent";

/* ---------- HEADER ---------- */
export function DrawerHeader({ title, description, closable = true }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b px-[var(--drawer-md-p)] py-3">
      <div className="grid gap-1">
        <h3 className="text-[var(--drawer-title)] font-medium">
          {title}
        </h3>
        {description && (
          <p className="text-[var(--drawer-text)] text-gray-500">
            {description}
          </p>
        )}
      </div>

      {closable && (
        <Dialog.Close className="opacity-60 hover:opacity-100">
          <AppIcon name="X" className="h-4 w-4" />
        </Dialog.Close>
      )}
    </div>
  );
}

/* ---------- BODY ---------- */
export function DrawerBody({ children }) {
  return (
    <div className="flex-1 overflow-y-auto px-[var(--drawer-md-p)] py-3">
      {children}
    </div>
  );
}

/* ---------- FOOTER ---------- */
export function DrawerFooter({ children }) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2 border-t px-[var(--drawer-md-p)] py-3">
      {children}
    </div>
  );
}
