// src/layout/LayoutContent.jsx
import { Outlet } from "react-router";
import { TooltipProvider } from "@/Lib/tooltip";

import { Toaster } from "@/Library/Toaster";

import ClientDropdown from "../Component/ClientDropdown";
import MonthYearSelector from "../Component/MonthYearSelector";

import { useSelector, useDispatch } from "react-redux";
import { setSelectedMonth,setSelectedClient, setSelectedClientContract } from "../Store/Auth/AuhtSlice";

import Header from "./StickyHeader";
import NavigatorBinder from "../Component/NavigatorBinder";
import ClientContractDropdown from "../Component/ClientContractDropdown";

const LayoutContent = () => {
  const dispatch = useDispatch();
  const { Auth } = useSelector((state) => state);

  // console.log(LogResponce);

  return (
    <TooltipProvider>
      <Toaster />
       <NavigatorBinder />

      <div className="min-h-screen bg-white w-full overflow-x-hidden">

        {/* FIXED HEADER */}
        <Header />

        {/* Add padding-top = header height */}
        <div className="pt-[80px] md:pt-[70px]">

          {/* FILTER BAR */}
          <div className="w-full px-4 py-1 flex flex-wrap gap-4 items-center justify-end backdrop-blur-md">

            {/* Month */}
            <div className="w-full sm:w-1/3">
              <MonthYearSelector
                value={Auth?.Common?.SelectedMonth}
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
                value={Auth?.Common?.SelectedClient || ""}
                onChange={(c) => dispatch(setSelectedClient(c))}
                placeholder="Select Client"
                className="w-full"
                UserClient={true}
                FstindexSelected={true}
              />
            </div>
             {/* ClientContractDropdown */}
            <div className="w-full sm:w-[300px]">
              <ClientContractDropdown
                value={Auth?.Common?.SelectedClientContract || ""}
                onChange={(c) => dispatch(setSelectedClientContract(c))}
                placeholder="Select Client"
                className="w-full"
                UserClient={true}
                FstindexSelected={true}
              />
            </div>

          </div>

          {/* PAGE CONTENT */}
          <div className="px-4 py-2 min-h-[calc(100vh-200px)]">
            <Outlet />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default LayoutContent;
