import React from "react";
import { Clock, Briefcase, Calendar } from "lucide-react";

// Assuming this component renders the row of 4 stat cards at the bottom
const TimeStats = () => {
    const stats = [
        { title: "Total Hours Today", value: "8.36 / 9", icon: Clock, color: "bg-orange-500" },
        { title: "Total Hours Week", value: "10 / 40", icon: Clock, color: "bg-gray-800" },
        { title: "Total Hours Month", value: "75 / 98", icon: Briefcase, color: "bg-blue-500" },
        { title: "Overtime this Month", value: "16 / 28", icon: Calendar, color: "bg-pink-500" },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {stats.map((stat, i) => (
                <div key={i} className="bg-white rounded-xl shadow p-4 flex flex-col justify-between h-full">
                    <div className={`w-8 h-8 rounded-lg ${stat.color} text-white flex items-center justify-center mb-3`}>
                        <stat.icon size={16} />
                    </div>
                    <div>
                        <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                        <div className="text-xs text-gray-500 mt-1">{stat.title}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default TimeStats;
