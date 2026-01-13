import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";


export const buttonVariants = cva(
  `
    inline-flex items-center justify-center gap-2
    rounded-md font-medium 
    transition-all duration-150
    ring-offset-background
    whitespace-nowrap

    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-ring
    focus-visible:ring-offset-2

    disabled:pointer-events-none
    disabled:opacity-50

    /* --- RESPONSIVE IMPROVEMENTS --- */
    w-full sm:w-auto
    text-[0.72rem] xs:text-[0.78rem] sm:text-sm

    /* SVG responsive */
    [&_svg]:pointer-events-none 
    [&_svg]:shrink-0
    [&_svg]:w-4 [&_svg]:h-4 
    xs:[&_svg]:w-[18px] xs:[&_svg]:h-[18px]
  `,
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",

        destructive:
          "hover:bg-destructive text-destructive-foreground bg-destructive/90",

        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",

        warning: "bg-amber-500 text-white hover:bg-amber-600",

        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",

        ghost: "hover:bg-accent hover:text-accent-foreground",

        link: "text-primary underline-offset-4 hover:underline",

        purple: "text-white bg-purple-600 hover:bg-purple-700",

        action: `
          bg-transparent 
          hover:bg-gray-200/60
          text-gray-700
          active:scale-90
        `,

        actionDanger: `
          bg-transparent 
          hover:bg-red-100
          text-red-600
          active:scale-90
        `,

        actionSuccess: `
          bg-transparent 
          hover:bg-green-100
          text-green-700
          active:scale-90
        `,
      },

      size: {
        default: "h-7 md:h-10 px-4 sm:px-6",
        sm: "h-6 sm:h-8  px-3 sm:h-7 sm:px-2",
        md: "h-7 sm:h-9 px-3 sm:px-4",
        lg: "h-12 px-6 sm:px-8",

        iconSm: "h-8 w-8 sm:h-7 sm:w-7",
        icon: "h-10 w-10 sm:h-9 sm:w-9",
        iconLg: "h-12 w-12 sm:h-11 sm:w-11",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);


export const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
