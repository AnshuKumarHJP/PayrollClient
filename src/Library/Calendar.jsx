import React from "react";
import { DayPicker } from "react-day-picker";
import { cn } from "./utils"
import "react-day-picker/style.css";
import AppIcon from "../Component/AppIcon";
import { buttonVariants } from "./Button";

export const Calendar = ({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}) => {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-semibold text-slate-900 dark:text-slate-100",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-slate-500 rounded-md w-9 font-normal text-[0.8rem] dark:text-slate-400",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-blue-50 dark:[&:has([aria-selected])]:bg-blue-900/20 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100 text-slate-900 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
        ),
        day_selected:
          "bg-blue-600 text-white hover:bg-blue-600 hover:text-white focus:bg-blue-600 focus:text-white dark:bg-blue-600 dark:text-white",
        day_today: "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100 font-semibold",
        day_outside: "text-slate-300 opacity-50 dark:text-slate-600",
        day_disabled: "text-slate-300 opacity-50 dark:text-slate-600",
        day_range_middle:
          "aria-selected:bg-slate-100 aria-selected:text-slate-900 dark:aria-selected:bg-slate-800 dark:aria-selected:text-slate-50",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <AppIcon name="ChevronLeft" size={16} />,
        IconRight: ({ ...props }) => <AppIcon name="ChevronRight" size={16} />,
      }}
      {...props}
    />
  );
};
