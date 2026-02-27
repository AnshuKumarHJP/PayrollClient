import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { TooltipProvider } from "@/Library/tooltip";

import { Toaster } from "@/Library/Toaster";
import ChatBot from "../ChatBot/ChatBot";


import ClientDropdown from "../Component/ClientDropdown";
import MonthYearSelector from "../Component/MonthYearSelector";

import { useSelector, useDispatch } from "react-redux";
import { setSelectedMonth, setSelectedClient, setSelectedClientContract } from "../Store/Auth/AuthSlice";


import NavigatorBinder from "../Component/NavigatorBinder";
import ClientContractDropdown from "../Component/ClientContractDropdown";
import Loading from "../Component/Loading";
import NotificationBanner from "../Component/NotificationBanner";
import useRole from "../Hooks/useRole";

const SidebarAppLayout = () => {
  const dispatch = useDispatch();
  const { SelectedMonth, SelectedClientCode, SelectedClientContractCode } = useSelector((state) => state.Auth.Common);
  const { data: Authdata } = useSelector((state) => state.Auth.LogResponce);
  const { isLoading } = useSelector((state) => state.GlobalStore);
  const { isSuperAdmin } = useRole();

  return (
    <TooltipProvider>
      <Toaster />
      <ChatBot />
      <NavigatorBinder />
      {isLoading && (
        <Loading />
      )}
      <NotificationBanner />
      <div className="
      min-h-screen
      bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50
      dark:from-slate-900 dark:via-slate-800 dark:to-slate-900
    ">
        <div className="flex md:h-screen md:overflow-hidden min-h-screen relative">
          <Sidebar />

          <div className="flex-1 flex flex-col md:overflow-hidden w-full">
            <div className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl transition-all md:static md:bg-transparent">
              <Header />

              {!isSuperAdmin && (
                <div className="w-full px-4 py-2 flex flex-wrap gap-4 items-center justify-end">
                  {/* Month */}
                  <div className="w-full sm:w-[150px] relative">
                    <MonthYearSelector
                      value={SelectedMonth}
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
                      value={SelectedClientCode || ""}
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
                      value={SelectedClientContractCode || ""}
                      onChange={(c) => dispatch(setSelectedClientContract(c))}
                      placeholder="Select Client"
                      className="w-full"
                      UserClient={true}
                      FstindexSelected={true}
                    />
                  </div>
                </div>
              )}
            </div>
            <main className="flex-1 md:overflow-y-auto p-2 w-full">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default SidebarAppLayout;
