// Modal.jsx (FULLY RESPONSIVE)
import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { cva } from "class-variance-authority";
import { cn } from "./utils"
import AppIcon from "../Component/AppIcon";

/* ---------- ROOT ---------- */
export const Modal = Dialog.Root;
export const ModalTrigger = Dialog.Trigger;

/* ---------- OVERLAY ---------- */
export const ModalOverlay = React.forwardRef((props, ref) => (
  <Dialog.Overlay
    ref={ref}
    className="fixed inset-0 bg-[var(--modal-overlay-bg)] backdrop-blur-sm animate-in fade-in"
    {...props}
  />
));
ModalOverlay.displayName = "ModalOverlay";

/* ---------- VARIANTS ---------- */
const modalVariants = cva(
  "fixed left-1/2 top-1/2 w-full max-h-[90vh] -translate-x-1/2 -translate-y-1/2 " +
    "bg-[var(--modal-bg)] rounded-[var(--modal-radius)] shadow-xl " +
    "flex flex-col animate-in fade-in zoom-in-95",
  {
    variants: {
      size: {
        xs: "w-[var(--modal-xs-w)]",
        sm: "w-[var(--modal-sm-w)]",
        md: "w-[var(--modal-md-w)]",
        lg: "w-[var(--modal-lg-w)]",
        xl: "w-[var(--modal-xl-w)]",
        full:
          "w-screen h-screen max-h-screen rounded-none translate-x-0 translate-y-0 left-0 top-0",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

/* ---------- CONTENT ---------- */
export const ModalContent = React.forwardRef(
  ({ className, size, ...props }, ref) => (
    <Dialog.Portal>
      <ModalOverlay />
      <Dialog.Content
        ref={ref}
        className={cn(modalVariants({ size }), className)}
        {...props}
      />
    </Dialog.Portal>
  )
);
ModalContent.displayName = "ModalContent";

/* ---------- HEADER ---------- */
export function ModalHeader({ title, description, closable = true }) {
  return (
    <div className="flex items-start justify-between gap-4 px-[var(--modal-md-p)] pt-[var(--modal-md-p)]">
      <div className="grid gap-1">
        <h3 className="text-[var(--modal-title)] font-medium">
          {title}
        </h3>
        {description && (
          <p className="text-[var(--modal-text)] text-gray-500">
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
export function ModalBody({ children }) {
  return (
    <div className="flex-1 overflow-y-auto px-[var(--modal-md-p)] py-3">
      {children}
    </div>
  );
}

/* ---------- FOOTER ---------- */
export function ModalFooter({ children }) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2 border-t px-[var(--modal-md-p)] py-3">
      {children}
    </div>
  );
}
