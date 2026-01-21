import React from "react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils";
import "react-day-picker/style.css";
import AppIcon from "../Component/AppIcon";
import { buttonVariants } from "./Button";


export const Calendar = ({
  className,
  classNames = {},
  showOutsideDays = true,
  ...props
}) => {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      mode="single"
      className={cn(
        "p-2 sm:p-3 text-[var(--p-small)] sm:text-[var(--p)]",
        className
      )}
      classNames={{
        /* ---------------- MONTH LAYOUT ---------------- */
        months:
          "flex flex-col sm:flex-row gap-4",
        month:
          "space-y-3",

        /* ---------------- CAPTION ---------------- */
        caption:
          "relative flex items-center justify-center py-1",
        caption_label:
          "text-[var(--p)] font-medium text-[var(--gray-800)]",

        /* ---------------- NAV ---------------- */
        nav:
          "flex items-center gap-1",
        nav_button: cn(
         buttonVariants({ variant: "outline", size: "sm" }),
          "h-7 w-7 p-0 opacity-70 hover:opacity-100 bg-red-500"
        ),
        nav_button_previous:
          "absolute left-1",
        nav_button_next:
          "absolute right-1",

        /* ---------------- TABLE ---------------- */
        table:
          "w-full border-collapse space-y-1",
        head_row:
          "flex",
        head_cell:
          "w-8 text-center text-[10px] sm:text-xs font-medium text-[var(--gray-500)]",

        row:
          "flex w-full mt-1",

        /* ---------------- CELLS ---------------- */
        cell:
          `
          relative h-8 w-8 sm:h-9 sm:w-9
          text-center
          focus-within:z-20
          `,

        /* ---------------- DAY BUTTON ---------------- */
        day: cn(
        //  buttonVariants({ variant: "ghost", size: "sm" }),
          `
          h-8 w-8 sm:h-9 sm:w-9
          p-0 font-normal
          text-[var(--gray-800)]
          hover:bg-[var(--primary-50)]
          `
        ),

        day_selected:
          `
          bg-[var(--primary-500)]
          text-[var(--white)]
          hover:bg-[var(--primary-600)]
          `,

        day_today:
          `
          border border-[var(--primary-500)]
          text-[var(--primary-500)]
          `,

        day_outside:
          "text-[var(--gray-400)] opacity-50",

        day_disabled:
          "text-[var(--gray-400)] opacity-40",

        ...classNames,
      }}
      components={{
        IconLeft: () => (
          <AppIcon
            name="ChevronLeft"
            className="h-4 w-4 text-[var(--primary-500)]"
          />
        ),
        IconRight: () => (
          <AppIcon
            name="ChevronRight"
            className="h-4 w-4 text-[var(--primary-500)]"
          />
        ),
      }}
      {...props}
    />
  );
};
