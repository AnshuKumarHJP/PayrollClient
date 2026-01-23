import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "./utils";

/* -----------------------------------------
   ROOT
----------------------------------------- */
const Tabs = TabsPrimitive.Root;

/* -----------------------------------------
   TABS LIST (Scrollable + Memoized)
----------------------------------------- */
const TabsListBase = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "flex items-center gap-1",
      "w-full overflow-x-auto scrollbar-none",       // ⭐ scrollable if too many tabs
      "rounded-md bg-muted text-muted-foreground p-1",
      className
    )}
    {...props}
  />
));
TabsListBase.displayName = "TabsList";

export const TabsList = React.memo(TabsListBase);

/* -----------------------------------------
   TABS TRIGGER (Memoized)
----------------------------------------- */
const TabsTriggerBase = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex-1 min-w-[100px]",                       // ⭐ always equal width
      "text-center select-none",
      "inline-flex items-center justify-center whitespace-nowrap",
      "rounded-sm px-3 py-1.5 text-sm font-medium transition-all",
      "ring-offset-background",
      "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      "disabled:pointer-events-none disabled:opacity-50",
      className
    )}
    {...props}
  />
));
TabsTriggerBase.displayName = "TabsTrigger";

export const TabsTrigger = React.memo(TabsTriggerBase);

/* -----------------------------------------
   TABS CONTENT (forceMount + Memoized)
----------------------------------------- */
const TabsContentBase = React.forwardRef(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2",
      "ring-offset-background focus-visible:outline-none",
      "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));

TabsContentBase.displayName = "TabsContent";

export const TabsContent = React.memo(TabsContentBase);

/* -----------------------------------------
   EXPORT ROOT
----------------------------------------- */
export { Tabs };
