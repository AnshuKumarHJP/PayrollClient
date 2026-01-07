import { useState } from "react";
import { Link } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../Lib/dropdown-menu";

// ⭐ ADD FRAMER MOTION
import { motion, AnimatePresence } from "framer-motion";
import AppIcon from "./AppIcon";

export default function NotificationDropdown() {
  const [notifying, setNotifying] = useState(true);

  return (
    <DropdownMenu onOpenChange={() => setNotifying(false)}>
      
      {/* TRIGGER BUTTON ANIMATED */}
      <DropdownMenuTrigger asChild>
        <motion.button
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.15 }}
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
          <AppIcon name={"Bell"} size={18} className="text-emerald-700"/>
        </motion.button>
      </DropdownMenuTrigger>

      {/* DROPDOWN CONTENT WITH ANIMATION */}
      <DropdownMenuContent asChild side="bottom" align="end">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -6 }}
          transition={{ duration: 0.18 }}
          className="
            mt-3 w-[320px] sm:w-[360px] max-h-[480px]
            rounded-md border border-emerald-200/60 bg-emerald-50/60
            backdrop-blur-xl shadow-xl p-3 flex flex-col
          "
        >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-emerald-200/60">
              <h5 className="text-lg font-semibold text-emerald-800">
                Notifications
              </h5>
            </div>

            {/* LIST with animated items */}
            <ul className="flex flex-col overflow-y-auto custom-scrollbar">
              {Array.from({ length: 5 }).map((_, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.2,
                    delay: index * 0.06, // staggered effect
                  }}
                >
                  <DropdownMenuItem
                    className="
                      flex gap-3 rounded-lg border-b border-emerald-200/40 p-3 
                      hover:!bg-emerald-100/60 focus:!bg-emerald-100/60
                      transition-all cursor-pointer
                    "
                  >
                    {/* Avatar */}
                    <span className="relative block w-10">
                      <img
                        src="https://firebasestorage.googleapis.com/v0/b/linkedin-clone-d79a1.appspot.com/o/man.png?alt=media&token=4b126130-032a-45b5-bea4-87adb0d096dc%22"
                        alt="User"
                        className="w-10 h-10 rounded-full"
                      />
                      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-500 rounded-full border border-white"></span>
                    </span>

                    {/* Text */}
                    <div className="flex-1">
                      <p className="text-[10px] md:text-sm text-gray-700">
                        <span className="font-semibold text-gray-900">Terry Franci</span>{" "}
                        requested permission to modify{" "}
                        <span className="font-semibold text-gray-900">Project – Nganter App</span>
                      </p>

                      <p className="text-[8px] md:text-xs flex items-center gap-2 text-gray-500">
                        <span>Project</span>
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        <span>5 min ago</span>
                      </p>
                    </div>
                  </DropdownMenuItem>
                </motion.li>
              ))}
            </ul>

            {/* FOOTER with animation */}
            <motion.div whileTap={{ scale: 0.97 }} className="mt-3">
              <Link
                to="/notifications"
                className="
                  px-4 py-2 font-medium text-center rounded-lg
                  border border-emerald-200 bg-emerald-100/40
                  hover:bg-emerald-200/60 text-emerald-800
                  transition-all shadow-sm block text-[10px] md:text-sm
                "
              >
                View All Notifications
              </Link>
            </motion.div>
          </motion.div>
        </DropdownMenuContent>
    </DropdownMenu>
  );
}
