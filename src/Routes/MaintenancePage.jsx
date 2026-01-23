import React, { useEffect, useState } from "react";
import AppIcon from "../Component/AppIcon";
import maintenance from '../Image/underconst.png'

const TARGET_TIME = Date.now() + 1000 * 60 * 60 * 24 * 30; // 30 days from now

const MaintenancePage = () => {
  const [timeLeft, setTimeLeft] = useState(TARGET_TIME - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(TARGET_TIME - Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (ms) => {
    if (ms <= 0) return "00 : 00 : 00 : 00";

    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(days).padStart(2, "0")} : ${String(hours).padStart(2, "0")} : ${String(minutes).padStart(2, "0")} : ${String(seconds).padStart(2, "0")}`;
  };

  return (
    <main className="bg-white flex items-center justify-center px-4 mt-3">
      <div className="w-full max-w-4xl text-center">
        {/* TITLE */}
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900 mb-2">
          Please bear with us! We're currently under maintenance.
        </h1>

        <p className="text-gray-500 max-w-xl mx-auto mb-6">
          It's going to take some time to fix the error. We'll be back online in.
        </p>

        {/* COUNTDOWN */}
        <div className="text-2xl sm:text-3xl font-mono font-semibold tracking-widest text-gray-900 mb-6">
          {formatTime(timeLeft)}
        </div>

        {/* NOTIFY */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 mb-10">
          <input
            type="email"
            placeholder="Your mail"
            className="w-full sm:w-72 rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            className="rounded-lg bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition"
          >
            Notify Me
          </button>
        </div>

        {/* ILLUSTRATION */}
        <div className="flex justify-center">
          <img
            src={maintenance}
            alt="Maintenance"
            className="max-w-xl w-full"
          />
        </div>

      </div>
    </main>
  );
};

export default MaintenancePage;
