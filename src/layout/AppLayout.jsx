// src/layout/LayoutContent.jsx
import useSidebar from "../Hooks/useSidebar";
import { Outlet } from "react-router";
import { Toaster } from "@/Lib/toaster";
import { Toaster as Sonner } from "@/Lib/sonner";
import { TooltipProvider } from "@/Lib/tooltip";

import ClientDropdown from "../Component/ClientDropdown";
import MonthYearSelector from "../Component/MonthYearSelector";

import { useSelector, useDispatch } from "react-redux";
import { setSelectedMonth } from "../Store/Slices/GlobalSlice";
import { setSelectedClient } from "../Store/Slices/GlobalSaveSlice";

import Header from "./StickyHeader";

import { menuData } from "./StickyHeader"; // shared menu

const LayoutContent = () => {
  const { isMobileOpen } = useSidebar();
  const dispatch = useDispatch();
  const { GlobalSaveStore, GlobalStore } = useSelector((state) => state);

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />

      <div className="min-h-screen bg-emerald-50 w-full overflow-x-hidden">

        {/* FIXED HEADER */}
        <Header />

        {/* Add padding-top = header height */}
        <div className="pt-[90px] md:pt-[70px]">

          {/* FILTER BAR */}
          <div className="w-full px-4 py-2 flex flex-wrap gap-4 items-center justify-end backdrop-blur-md">

            {/* Month */}
            <div className="w-full sm:w-1/3">
              <MonthYearSelector
                value={GlobalStore?.SelectedMonth}
                onChange={(m) => dispatch(setSelectedMonth(m))}
                className="w-full"
                showMonthGrid={false}
                showYear={false}
                monthFormat="longYear"
              />
            </div>

            {/* Client */}
            <div className="w-full sm:w-[300px]">
              <ClientDropdown
                value={GlobalSaveStore?.SelectedClient}
                onChange={(c) => dispatch(setSelectedClient(c))}
                placeholder="Select Client"
                className="w-full"
                UserClient={true}
                FstindexSelected={true}
              />
            </div>
          </div>

          {/* PAGE CONTENT */}
          <div className="p-4 min-h-[calc(100vh-200px)]">
            <Outlet />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default LayoutContent;
