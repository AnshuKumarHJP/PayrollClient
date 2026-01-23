import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { cn } from "./utils"

/* ------------------------------------------------------------------ */
/* ROOT */
/* ------------------------------------------------------------------ */
const Avatar = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      `
      relative flex shrink-0 overflow-hidden
      rounded-full
      bg-[var(--light-gray-100)]
      text-[var(--gray-700)]
      `,
      className
    )}
    {...props}
  />
));
Avatar.displayName = AvatarPrimitive.Root.displayName;

/* ------------------------------------------------------------------ */
/* IMAGE */
/* ------------------------------------------------------------------ */
const AvatarImage = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn(
      `
      h-full w-full object-cover
      `,
      className
    )}
    {...props}
  />
));
AvatarImage.displayName = AvatarPrimitive.Image.displayName;

/* ------------------------------------------------------------------ */
/* FALLBACK */
/* ------------------------------------------------------------------ */
const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      `
      flex h-full w-full items-center justify-center
      rounded-full
      bg-[var(--light-gray-200)]
      text-[var(--primary-500)]
      font-medium
      `,
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName;

/* ------------------------------------------------------------------ */
/* EXPORTS */
/* ------------------------------------------------------------------ */
export { Avatar, AvatarImage, AvatarFallback };
