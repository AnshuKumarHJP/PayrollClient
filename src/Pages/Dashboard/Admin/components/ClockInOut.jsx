import React from "react";
import { Filter } from "lucide-react";

const ClockInOut = () => {
    const employees = [
        { name: "Daniel Esbella", role: "UI/UX Designer", time: "09:15 AM", status: "ontime", avatarColor: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300" },
        { name: "Doglas Martini", role: "Project Manager", time: "09:15 AM", status: "ontime", avatarColor: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300" },
        { name: "Brian Villalobos", role: "PHP Developer", time: "09:15 AM", status: "ontime", avatarColor: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300" },
    ];

    const lateEmployees = [
        { name: "Anthony Lewis", role: "Marketing Head", time: "09:45 AM", lateBy: "30 Min", avatarColor: "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300" }
    ];

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow dark:shadow-none p-5 h-full flex flex-col transition-colors duration-300">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">Clock-In/Out</h3>
                <div className="flex gap-2">
                    <button className="text-xs border dark:border-slate-600 px-2 py-1 rounded flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700">
                        All Departments <Filter size={10} />
                    </button>
                    <button className="text-xs border dark:border-slate-600 px-2 py-1 rounded flex items-center gap-1 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700">
                        Today <Filter size={10} />
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {employees.map((emp, i) => (
                    <div key={i} className="flex justify-between items-start">
                        <div className="flex gap-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${emp.avatarColor}`}>
                                {emp.name.charAt(0)}{emp.name.split(' ')[1]?.charAt(0)}
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{emp.name}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-500">{emp.role}</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="w-16 text-center text-xs py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded mb-1">{emp.time}</div>
                        </div>
                    </div>
                ))}

                <div className="border-t dark:border-slate-700 pt-2 mt-2">
                    <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3">Late</h4>
                    {lateEmployees.map((emp, i) => (
                        <div key={i} className="flex justify-between items-start">
                            <div className="flex gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${emp.avatarColor}`}>
                                    {emp.name.charAt(0)}{emp.name.split(' ')[1]?.charAt(0)}
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-gray-800 dark:text-gray-200">{emp.name}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-500">{emp.role}</div>
                                </div>
                            </div>
                            <div className="text-right flex items-center gap-2">
                                <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400 px-1 rounded">{emp.lateBy}</span>
                                <div className="w-16 text-center text-xs py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded border border-red-100 dark:border-red-900/30">{emp.time}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <button className="w-full mt-auto text-center text-sm text-gray-500 dark:text-gray-400 border dark:border-slate-600 rounded-lg py-2 hover:bg-gray-50 dark:hover:bg-slate-700 mt-4 transition-colors">
                View All Attendance
            </button>
        </div>
    );
};

export default ClockInOut;
