import * as React from "react";
import { cn } from "./utils"

/* -------------------------------- CARD -------------------------------- */

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      `
      rounded-[var(--control-radius-lg)]
      border border-[var(--stroke-gray-300)]
      bg-[var(--white)]
      text-[var(--gray-800)]
      shadow-sm
      min-w-0
      `,
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

/* ------------------------------ CARD HEADER ----------------------------- */

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      `
      flex flex-col gap-1.5
      p-4
      min-w-0
      `,
      className
    )}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

/* ------------------------------- CARD TITLE ----------------------------- */

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      `
      text-[var(--h6)]
      md:text-[var(--h4)]
      font-medium
      leading-tight
      text-[var(--gray-900)]
      `,
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

/* --------------------------- CARD DESCRIPTION --------------------------- */

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      `
      text-[var(--p)]
      text-[var(--gray-500)]
      `,
      className
    )}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

/* ------------------------------ CARD CONTENT ----------------------------- */

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      `
      px-4 pt-2 pb-4
      min-w-0
      overflow-x-visible
      `,
      className
    )}
    {...props}
  />
));
CardContent.displayName = "CardContent";

/* ------------------------------ CARD FOOTER ------------------------------ */

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      `
      flex items-center
      p-4
      min-w-0
      `,
      className
    )}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

/* ------------------------------------------------------------------------ */

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
