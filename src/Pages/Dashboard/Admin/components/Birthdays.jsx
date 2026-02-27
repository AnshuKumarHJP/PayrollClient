import React from "react";
import { Send } from "lucide-react";

const Birthdays = () => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow dark:shadow-none p-5 h-full flex flex-col transition-colors duration-300">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">Birthdays</h3>
                <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">View All</button>
            </div>

            <div className="space-y-4">
                {/* Today */}
                <div>
                    <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-2">Today</div>
                    <div className="flex justify-between items-center bg-gray-50/50 dark:bg-slate-700/50 p-2 rounded-lg transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 flex items-center justify-center font-bold text-xs">A</div>
                            <div>
                                <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">Andrew Jermis</div>
                                <div className="text-[10px] text-gray-500 dark:text-gray-400">IOS Developer</div>
                            </div>
                        </div>
                        <button className="px-2 py-1 bg-blue-600 dark:bg-blue-600 text-white text-[10px] rounded shadow hover:bg-blue-700 dark:hover:bg-blue-500 flex items-center gap-1 transition-colors">
                            <Send size={10} /> Wish
                        </button>
                    </div>
                </div>

                {/* Tomorrow */}
                <div>
                    <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-2">Tomorrow</div>
                    <div className="flex justify-between items-center bg-gray-50/50 dark:bg-slate-700/50 p-2 rounded-lg transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-300 flex items-center justify-center font-bold text-xs">M</div>
                            <div>
                                <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">Mary Zeen</div>
                                <div className="text-[10px] text-gray-500 dark:text-gray-400">UI/UX Designer</div>
                            </div>
                        </div>
                        <button className="px-2 py-1 bg-blue-600 dark:bg-blue-600 text-white text-[10px] rounded shadow hover:bg-blue-700 dark:hover:bg-blue-500 flex items-center gap-1 transition-colors">
                            <Send size={10} /> Wish
                        </button>
                    </div>
                    <div className="flex justify-between items-center bg-gray-50/50 dark:bg-slate-700/50 p-2 rounded-lg mt-2 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 flex items-center justify-center font-bold text-xs">A</div>
                            <div>
                                <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">Antony Lewis</div>
                                <div className="text-[10px] text-gray-500 dark:text-gray-400">Android Developer</div>
                            </div>
                        </div>
                        <button className="px-2 py-1 bg-blue-600 dark:bg-blue-600 text-white text-[10px] rounded shadow hover:bg-blue-700 dark:hover:bg-blue-500 flex items-center gap-1 transition-colors">
                            <Send size={10} /> Wish
                        </button>
                    </div>
                </div>

                {/* Date */}
                <div>
                    <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 mb-2">24 Jan 2023</div>
                    <div className="flex justify-between items-center bg-gray-50/50 dark:bg-slate-700/50 p-2 rounded-lg transition-colors">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300 flex items-center justify-center font-bold text-xs">D</div>
                            <div>
                                <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">Doglas Martini</div>
                                <div className="text-[10px] text-gray-500 dark:text-gray-400">Product Manager</div>
                            </div>
                        </div>
                        <button className="px-2 py-1 bg-blue-600 dark:bg-blue-600 text-white text-[10px] rounded shadow hover:bg-blue-700 dark:hover:bg-blue-500 flex items-center gap-1 transition-colors">
                            <Send size={10} /> Wish
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Birthdays;
