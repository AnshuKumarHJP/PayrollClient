import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/* ROOT EXPORTS */
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

/* OVERLAY */
export const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      `
        fixed inset-0 z-[1000] -top-10
        bg-black/20                         /* dark overlay */
        backdrop-blur-[-5px]                 /* blur background */
        data-[state=open]:animate-in 
        data-[state=closed]:animate-out 
        data-[state=open]:fade-in-0 
        data-[state=closed]:fade-out-0
      `,
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = "DialogOverlay";

/* CONTENT WITH header, body, footer PROPS */
export const DialogContent = React.forwardRef(
  ({ header, body, footer, className, ...props }, ref) => (
    <DialogPortal>
      <DialogOverlay />

      {/* CENTER THE MODAL */}
      <div className="fixed inset-0 z-[1001] flex items-center justify-center p-2">
        <DialogPrimitive.Content
          ref={ref}
          {...props}
          className={cn(
            `
    w-full     /* ← INCREASED WIDTH HERE */
    rounded-lg sm:rounded-xl
    border border-white/20
    bg-white backdrop-blur-[20px]
    shadow-2xl shadow-black/30
    flex flex-col
    max-h-[85vh]
    relative
    animate-in
    data-[state=open]:zoom-in-90 
    data-[state=closed]:zoom-out-90
    `,
            className
          )}
        >

          {/* STICKY HEADER */}
          <div className="sticky top-0 z-20 bg-white backdrop-blur-[20px] border-b border-gray-300 px-6 py-2 rounded-t-lg flex justify-between items-start">
            <div className="w-full">{header}</div>

            {/* CLOSE BUTTON */}
            <DialogPrimitive.Close className="absolute right-4 top-[40%] opacity-70 hover:opacity-100 focus:outline-none">
              <X className="h-5 w-5" />
            </DialogPrimitive.Close>
          </div>

          {/* SCROLLABLE BODY */}
          <div className="overflow-y-auto px-6 py-4 flex-1">
            {body}
          </div>

          {/* STICKY FOOTER */}
          <div className="sticky bottom-0 bg-white backdrop-blur-[20px] px-6 py-2 rounded-b-lg flex justify-end">
            {footer}
          </div>

        </DialogPrimitive.Content>
      </div>
    </DialogPortal>
  )
);
DialogContent.displayName = "DialogContent";

/* HEADER SLOT */
export const DialogHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5", className)} {...props} />
);
DialogHeader.displayName = "DialogHeader";

/* FOOTER SLOT */
export const DialogFooter = ({ className, ...props }) => (
  <div className={cn("flex w-full justify-end gap-2", className)} {...props} />
);
DialogFooter.displayName = "DialogFooter";

/* TITLE */
export const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-xl font-semibold text-black", className)}
    {...props}
  />
));
DialogTitle.displayName = "DialogTitle";

/* DESCRIPTION */
export const DialogDescription = React.forwardRef(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Description
      ref={ref}
      className={cn("text-sm text-black/70", className)}
      {...props}
    />
  )
);
DialogDescription.displayName = "DialogDescription";