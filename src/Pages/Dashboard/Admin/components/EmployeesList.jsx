import React from "react";

const EmployeesList = () => {
    const employees = [
        { name: "Anthony Lewis", dept: "Finance", avatar: "A", color: "bg-gray-200 dark:bg-slate-600/50 text-gray-600 dark:text-gray-300", tagColor: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" },
        { name: "Brian Villalobos", dept: "Development", avatar: "B", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300", tagColor: "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400" },
        { name: "Stephan Peralt", dept: "Marketing", avatar: "S", color: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300", tagColor: "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" },
        { name: "Doglas Martini", dept: "Manager", avatar: "D", color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300", tagColor: "bg-pink-50 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400" },
        { name: "Anthony Lewis", dept: "UI/UX Design", avatar: "A", color: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300", tagColor: "bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" },
    ];

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow dark:shadow-none p-5 h-full flex flex-col transition-colors duration-300">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">Employees</h3>
                <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">View All</button>
            </div>

            <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500 mb-2 px-1">
                <span className="font-medium">Name</span>
                <span className="font-medium">Department</span>
            </div>

            <div className="space-y-4 flex-1">
                {employees.map((emp, i) => (
                    <div key={i} className="flex justify-between items-center bg-gray-50/50 dark:bg-slate-700/30 p-2 rounded-md transition-colors hover:bg-gray-100 dark:hover:bg-slate-700/50">
                        <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${emp.color}`}>
                                {emp.avatar}
                            </div>
                            <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">{emp.name}</div>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${emp.tagColor}`}>
                            {emp.dept}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EmployeesList;
