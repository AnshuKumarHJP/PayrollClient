import React from "react";

const RecentActivities = () => {
    const activities = [
        { user: "Matt Morgan", action: "Added New Project", target: "HRMS Dashboard", time: "05:30 PM", avatar: "M", color: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400" },
        { user: "Jay Ze", action: "Commented on Uploaded Document", target: "", time: "05:00 PM", avatar: "J", color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400" },
        { user: "Mary Donald", action: "Approved Task Projects", target: "", time: "05:30 PM", avatar: "M", color: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400" },
        { user: "George David", action: "Requesting Access to Module Tickets", target: "", time: "06:00 PM", avatar: "G", color: "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300" },
        { user: "Aaron Zeen", action: "Downloaded App Reports", target: "", time: "06:30 PM", avatar: "A", color: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400" },
        { user: "Hendry Daniel", action: "Completed New Project HMS", target: "", time: "05:30 PM", avatar: "H", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" },
    ];

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow dark:shadow-none p-5 h-full flex flex-col transition-colors duration-300">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">Recent Activities</h3>
                <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">View All</button>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-slate-700">
                {activities.map((act, i) => (
                    <div key={i} className="flex gap-3">
                        <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-xs ${act.color}`}>
                            {act.avatar}
                        </div>
                        <div className="flex-1">
                            <div className="text-xs text-gray-800 dark:text-gray-300">
                                <span className="font-semibold text-gray-900 dark:text-gray-100">{act.user}</span> {act.action} <span className="text-orange-500 dark:text-orange-400">{act.target}</span>
                            </div>
                            <div className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">{act.time}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentActivities;
