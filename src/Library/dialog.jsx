/* =========================================================
   PRODUCTION-READY DIALOG (HEADER / BODY / FOOTER PATTERN)
   ✔ Uses YOUR component contract (header, body, footer)
   ✔ Fully responsive (mobile → desktop)
   ✔ Width issue FIXED
   ✔ Enterprise-grade UI
   ✔ Radix Dialog + Tailwind
========================================================= */

/* ===================== dialog.jsx ===================== */
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "./utils";
import AppIcon from "../Component/AppIcon";

/* ROOT */
export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogClose = DialogPrimitive.Close;

/* OVERLAY */
export const DialogOverlay = React.forwardRef(
  ({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
      ref={ref}
      {...props}
      className={cn(
        "fixed inset-0 z-[1000] bg-black/40 backdrop-blur-sm",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        className
      )}
    />
  )
);
DialogOverlay.displayName = "DialogOverlay";

/* CONTENT (HEADER / BODY / FOOTER API) */
export const DialogContent = React.forwardRef(
  ({ header, body, footer, className, ...props }, ref) => (
    <DialogPrimitive.Portal>
      <DialogOverlay />

      {/* CENTER CONTAINER */}
      <div className="fixed inset-0 z-[1001] flex items-center justify-center p-2 sm:p-4">
        <DialogPrimitive.Content
          ref={ref}
          {...props}
          className={cn(
            `
            /* RESPONSIVE WIDTH */
            w-full
            max-w-[96vw]           /* phones */
            sm:max-w-xl            /* small tablets */
            md:max-w-2xl           /* tablets */
            lg:max-w-3xl           /* laptops */
            xl:max-w-4xl           /* desktop */

            /* HEIGHT */
            max-h-[90vh]

            /* STRUCTURE */
            flex flex-col
            overflow-hidden

            /* VISUAL */
            rounded-2xl
            bg-white
            border border-gray-200
            shadow-[0_30px_80px_-25px_rgba(0,0,0,0.35)]

            /* ANIMATION */
            data-[state=open]:animate-in
            data-[state=closed]:animate-out
            data-[state=open]:zoom-in-95
            data-[state=closed]:zoom-out-95
            `,
            className
          )}
        >
          {/* HIDDEN TITLE FOR ACCESSIBILITY */}
          <DialogPrimitive.Title className="sr-only">
            Dialog
          </DialogPrimitive.Title>

          {/* HEADER */}
          <div className="flex items-center justify-between gap-4 relative">
            <div className="flex-1">{header}</div>
            <DialogPrimitive.Close className="rounded-md absolute right-2 p-2 hover:bg-white/10 focus:outline-none">
              <AppIcon name="X" className="h-5 w-5" />
            </DialogPrimitive.Close>
          </div>

          {/* BODY */}
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {body}
          </div>

          {/* FOOTER */}
          <div className="border-t bg-gray-50 px-6 py-4 flex justify-end gap-2">
            {footer}
          </div>
        </DialogPrimitive.Content>
      </div>
    </DialogPrimitive.Portal>
  )
);
DialogContent.displayName = "DialogContent";

/* TITLE */
export const DialogTitle = ({ children, className }) => (
  <h2 className={cn("text-lg font-semibold leading-none", className)}>
    {children}
  </h2>
);

/* =========================================================
   HOW TO USE (EXAMPLE)
========================================================= */
/*
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent
    header={<DialogTitle>Add New Step</DialogTitle>}
    body={<YourForm />}
    footer={
      <>
        <Button variant="outline">Cancel</Button>
        <Button>Add Step</Button>
      </>
    }
  />
</Dialog>
*/

/* =========================================================
   WHY THIS WORKS
========================================================= */
/*
✔ Width now controlled INSIDE DialogContent
✔ Responsive breakpoints respected
✔ Header / body / footer separation clean
✔ No layout shift
✔ No Radix fighting Tailwind
✔ Production-safe
*/
