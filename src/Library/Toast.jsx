/* =========================
   toast.jsx (TOKEN-DRIVEN, FINAL)
   ========================= */
import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";
import { cva } from "class-variance-authority";
import { cn } from "./utils";
import AppIcon from "../Component/AppIcon";

/* ---------- PROVIDER ---------- */
export const ToastProvider = ToastPrimitive.Provider;

/* ---------- VIEWPORT ---------- */
export const ToastViewport = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      "fixed top-4 right-4 z-[9999] flex max-h-screen w-full max-w-[420px] flex-col gap-3 outline-none",
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = "ToastViewport";

/* ---------- VARIANTS ---------- */
const toastVariants = cva(
  `
    group relative flex w-full items-start gap-3
    rounded-[var(--toast-radius)]
    border-l-4
    bg-[var(--toast-bg)]
    shadow-[var(--toast-shadow)]
    transition-all

    data-[state=open]:animate-in
    data-[state=open]:slide-in-from-top-full
    data-[state=closed]:animate-out
    data-[state=closed]:fade-out-80
  `,
  {
    variants: {
      variant: {
        info: "border-l-[var(--toast-info-border)]",
        success: "border-l-[var(--toast-success-border)]",
        warning: "border-l-[var(--toast-warning-border)]",
        danger: "border-l-[var(--toast-danger-border)]",
      },
      size: {
        sm: "p-[var(--toast-sm-p)]",
        md: "p-[var(--toast-md-p)]",
        lg: "p-[var(--toast-lg-p)]",
      },
    },
    defaultVariants: {
      variant: "info",
      size: "md",
    },
  }
);

/* ---------- ROOT ---------- */
export const Toast = React.forwardRef(
  ({ className, variant, size, ...props }, ref) => (
    <ToastPrimitive.Root
      ref={ref}
      className={cn(toastVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Toast.displayName = "Toast";

/* ---------- ICON ---------- */
export function ToastIcon({ variant = "info" }) {
  const map = {
    info: { icon: "Info", color: "text-[var(--toast-info-icon)]" },
    success: { icon: "CheckCircle", color: "text-[var(--toast-success-icon)]" },
    warning: { icon: "AlertTriangle", color: "text-[var(--toast-warning-icon)]" },
    danger: { icon: "XCircle", color: "text-[var(--toast-danger-icon)]" },
    destructive: { icon: "XCircle", color: "text-[var(--toast-danger-icon)]" },
  };

  const iconData = map[variant] || map.info;

  return (
    <AppIcon
      name={iconData.icon}
      className={cn("mt-0.5 h-5 w-5", iconData.color)}
    />
  );
}

/* ---------- CONTENT ---------- */
export const ToastTitle = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitive.Title
    ref={ref}
    className={cn(
      "text-sm font-medium text-[var(--toast-title-color)]",
      className
    )}
    {...props}
  />
));
ToastTitle.displayName = "ToastTitle";

export const ToastDescription = React.forwardRef(
  ({ className, ...props }, ref) => (
    <ToastPrimitive.Description
      ref={ref}
      className={cn(
        "text-xs text-[var(--toast-desc-color)]",
        className
      )}
      {...props}
    />
  )
);
ToastDescription.displayName = "ToastDescription";

/* ---------- CLOSE ---------- */
export const ToastClose = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitive.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-gray-400 hover:text-gray-600",
      className
    )}
    {...props}
  >
    <AppIcon name="X" className="h-4 w-4" />
  </ToastPrimitive.Close>
));
ToastClose.displayName = "ToastClose";
