import React from "react";
import { Plus } from "lucide-react";

const TodoList = () => {
    const todos = [
        "Add Holidays",
        "Add Meeting to Client",
        "Chat with Adrian",
        "Management Call",
        "Add Payroll",
        "Add Policy for Increment"
    ];

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow dark:shadow-none p-5 h-full flex flex-col transition-colors duration-300">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">Todo</h3>
                <div className="flex gap-2">
                    <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">Today</span>
                    <button className="bg-orange-500 rounded-full p-1 text-white hover:bg-orange-600 transition-colors">
                        <Plus size={12} />
                    </button>
                </div>
            </div>

            <div className="space-y-3 flex-1">
                {todos.map((todo, i) => (
                    <div key={i} className="flex items-center gap-3 group cursor-pointer">
                        <div className="w-4 h-4 border-2 border-gray-300 dark:border-slate-600 rounded flex items-center justify-center group-hover:border-orange-500 dark:group-hover:border-orange-500 transition-colors">
                            {/* Checkbox simulation */}
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">{todo}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TodoList;
