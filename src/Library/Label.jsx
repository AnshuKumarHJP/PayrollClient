import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva } from "class-variance-authority";
import { cn } from "./utils"

/*
  Responsive behavior:
  - Mobile: 12px
  - Tablet+: 13px
  - Desktop+: 14px
*/
const labelVariants = cva(
  `
    font-medium
    leading-tight
    text-tiny
    sm:text-p11
    md:text-p
    text-gray-700

    peer-disabled:cursor-not-allowed
    peer-disabled:opacity-70
  `
);

const Label = React.forwardRef(
  ({ className, ...props }, ref) => (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(labelVariants(), className)}
      {...props}
    />
  )
);

Label.displayName = LabelPrimitive.Root.displayName;

Label.displayName = "Label";
export { Label };
export default Label;
