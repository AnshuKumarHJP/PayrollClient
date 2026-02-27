import React from "react";

const EmployeeStatus = () => {
    // Mock data based on image
    const data = {
        total: 154,
        fullTime: 112,
        contract: 112, // The image shows 112 for contract too, which might be a typo in design or coincidence, keeping as is.
        probation: 12,
        wfh: 4
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow dark:shadow-none p-5 h-full flex flex-col transition-colors duration-300">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800 dark:text-white">Employee Status</h3>
                <span className="text-xs text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">This Week</span>
            </div>

            <div className="flex justify-between items-end mb-4">
                <span className="text-sm text-gray-500 dark:text-gray-400">Total Employees</span>
                <span className="text-3xl font-bold text-gray-800 dark:text-white">{data.total}</span>
            </div>

            {/* Visual Bar representation */}
            <div className="flex w-full h-2 rounded-full overflow-hidden mb-6 bg-gray-100 dark:bg-slate-700">
                <div className="bg-orange-500 w-[60%] shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div>
                <div className="bg-blue-600 w-[20%]"></div>
                <div className="bg-yellow-400 w-[10%]"></div>
                <div className="bg-red-500 w-[10%]"></div>
            </div>

            <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm flex-1">
                <div className="flex justify-between items-center border-l-2 border-orange-500 pl-3">
                    <span className="text-gray-600 dark:text-gray-300">Full Time</span>
                    <span className="font-semibold dark:text-gray-200">{data.fullTime}</span>
                </div>
                <div className="flex justify-between items-center border-l-2 border-blue-600 pl-3">
                    <span className="text-gray-600 dark:text-gray-300">Contract</span>
                    <span className="font-semibold dark:text-gray-200">{data.contract}</span>
                </div>
                <div className="flex justify-between items-center border-l-2 border-yellow-400 pl-3">
                    <span className="text-gray-600 dark:text-gray-300">Probation</span>
                    <span className="font-semibold dark:text-gray-200">{data.probation}</span>
                </div>
                <div className="flex justify-between items-center border-l-2 border-red-500 pl-3">
                    <span className="text-gray-600 dark:text-gray-300">WFH</span>
                    <span className="font-semibold dark:text-gray-200">{String(data.wfh).padStart(2, '0')}</span>
                </div>
            </div>

            <button className="w-full mt-4 text-center text-sm text-gray-500 dark:text-gray-400 border dark:border-slate-600 rounded-lg py-2 hover:bg-gray-50 dark:hover:bg-slate-700 transition">
                View All Employees
            </button>
        </div>
    );
};

export default EmployeeStatus;
