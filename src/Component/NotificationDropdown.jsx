import { useState } from "react";
import { Link } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../Lib/dropdown-menu";

import { Bell } from "lucide-react";

export default function NotificationDropdown() {
  const [notifying, setNotifying] = useState(true);

  return (
    <DropdownMenu onOpenChange={() => setNotifying(false)}>
      <DropdownMenuTrigger asChild>
        <button
          className="
            relative flex items-center justify-center h-9 w-9 rounded-full
            border border-emerald-200/60 bg-emerald-50/40 backdrop-blur-md
            text-emerald-700 shadow-sm hover:bg-emerald-100/60
            transition-all
          "
        >
          {/* Notification Pulse Dot */}
          {notifying && (
            <span className="absolute right-0 top-0.5 z-10 h-2.5 w-2.5 rounded-full bg-orange-400">
              <span className="absolute inset-0 rounded-full bg-orange-400 opacity-75 animate-ping" />
            </span>
          )}

          <Bell size={18} className="text-emerald-700" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        side="bottom"
        align="end"
        className="
          mt-3 w-[350px] sm:w-[360px] max-h-[480px]
          rounded-md border border-emerald-200/60 bg-emerald-50/60 
          backdrop-blur-xl shadow-xl
          p-3 flex flex-col
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-emerald-200/60">
          <h5 className="text-lg font-semibold text-emerald-800">Notifications</h5>
        </div>

        {/* List */}
        <ul className="flex flex-col overflow-y-auto custom-scrollbar">
          {[1, 2, 3, 4, 5].map((_, index) => (
            <li key={index}>
              <DropdownMenuItem
                className="
          flex gap-3 rounded-lg border-b border-emerald-200/40 p-3 
          hover:!bg-emerald-100/60 focus:!bg-emerald-100/60
          transition-all
        "
              >
                {/* Avatar */}
                <span className="relative block w-10">
                  <img
                    src="/images/user/user-02.jpg"
                    alt="User"
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-500 rounded-full border border-white"></span>
                </span>

                {/* Text */}
                <div className="flex-1">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-gray-900">Terry Franci</span>{" "}
                    requested permission to modify{" "}
                    <span className="font-semibold text-gray-900">Project – Nganter App</span>
                  </p>

                  <p className="flex items-center gap-2 text-xs text-gray-500">
                    <span>Project</span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <span>5 min ago</span>
                  </p>
                </div>
              </DropdownMenuItem>
            </li>
          ))}
        </ul>



        {/* Footer */}
        <Link
          to="/notifications"
          className="
            mt-3 px-4 py-2 text-sm font-medium text-center rounded-lg
            border border-emerald-200 bg-emerald-100/40
            hover:bg-emerald-200/60 text-emerald-800
            transition-all shadow-sm
          "
        >
          View All Notifications
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
