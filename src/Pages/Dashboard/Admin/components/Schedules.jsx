import React from "react";

const Schedules = () => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow dark:shadow-none p-5 h-full flex flex-col transition-colors duration-300">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">Schedules</h3>
                <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">View All</button>
            </div>

            <div className="space-y-4">
                {/* Item 1 */}
                <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-100 dark:border-slate-600 relative overflow-hidden transition-colors">
                    <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                    <div className="ml-2">
                        <div className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 mb-1">UI/UX Designer</div>
                        <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">Interview Candidates - UI/UX Designer</div>
                        <div className="flex justify-between items-end mt-2">
                            <span className="text-[10px] text-gray-500 dark:text-gray-400">Thu, 16 Feb 2023 • 01:00 PM - 02:30 PM</span>
                            <button className="px-3 py-1 bg-orange-500 text-white text-[10px] rounded shadow-sm hover:bg-orange-600">Join Meeting</button>
                        </div>
                        <div className="flex -space-x-1 mt-2">
                            <div className="w-5 h-5 rounded-full bg-red-200 dark:bg-red-900/50 border border-white dark:border-slate-700 text-[8px] dark:text-red-100 flex items-center justify-center">A</div>
                            <div className="w-5 h-5 rounded-full bg-blue-200 dark:bg-blue-900/50 border border-white dark:border-slate-700 text-[8px] dark:text-blue-100 flex items-center justify-center">B</div>
                            <div className="w-5 h-5 rounded-full bg-yellow-200 dark:bg-yellow-900/50 border border-white dark:border-slate-700 text-[8px] dark:text-yellow-100 flex items-center justify-center">+3</div>
                        </div>
                    </div>
                </div>

                {/* Item 2 */}
                <div className="p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-100 dark:border-slate-600 relative overflow-hidden transition-colors">
                    <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                    <div className="ml-2">
                        <div className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 mb-1">IOS Developer</div>
                        <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">Interview Candidates - IOS Developer</div>
                        <div className="flex justify-between items-end mt-2">
                            <span className="text-[10px] text-gray-500 dark:text-gray-400">Thu, 15 Feb 2023 • 03:00 PM - 04:30 PM</span>
                            <button className="px-3 py-1 bg-orange-500 text-white text-[10px] rounded shadow-sm hover:bg-orange-600">Join Meeting</button>
                        </div>
                        <div className="flex -space-x-1 mt-2">
                            <div className="w-5 h-5 rounded-full bg-purple-200 dark:bg-purple-900/50 border border-white dark:border-slate-700 text-[8px] dark:text-purple-100 flex items-center justify-center">D</div>
                            <div className="w-5 h-5 rounded-full bg-green-200 dark:bg-green-900/50 border border-white dark:border-slate-700 text-[8px] dark:text-green-100 flex items-center justify-center">E</div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Schedules;
