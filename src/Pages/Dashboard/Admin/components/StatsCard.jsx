import React from "react";
import { MoveDown, MoveUp } from "lucide-react";

const StatsCard = ({ title, value, subValue, isIncrease, icon: Icon, color }) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow dark:shadow-none p-4 flex flex-col gap-3 transition-colors duration-300">
            <div className="flex items-center gap-3">
                <div className={`p-2 rounded-full ${color} text-white shadow-lg shadow-${color.split('-')[1]}-500/30`}>
                    {Icon && <Icon size={20} />}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</div>
            </div>

            <div className="flex flex-col gap-1">
                <div className="text-2xl font-bold text-gray-800 dark:text-white">{value}</div>
                <div className="flex items-center gap-1 text-xs">
                    <span className={isIncrease ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"}>
                        {subValue}
                    </span>
                    {isIncrease ? (
                        <MoveUp size={12} className="text-green-500 dark:text-green-400" />
                    ) : (
                        <MoveDown size={12} className="text-red-500 dark:text-red-400" />
                    )}
                    <span className="text-gray-400 dark:text-gray-500 ml-1">from last month</span>
                </div>
            </div>

            <button className="text-xs text-blue-600 dark:text-blue-400 self-start mt-2 font-medium hover:underline">
                View Details
            </button>
        </div>
    );
};

export default StatsCard;
