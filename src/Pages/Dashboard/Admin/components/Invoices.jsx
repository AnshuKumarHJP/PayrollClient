import React from "react";
import { ArrowUpRight } from "lucide-react";

const Invoices = () => {
    const invoices = [
        { name: "Redesign Website", company: "FIVCO - Logic Inc", amount: "$2563", status: "Unpaid" },
        { name: "Module Completion", company: "RIVCO - Yip Corp", amount: "$4173", status: "Unpaid" },
        { name: "Change on trip Module", company: "FIVCO - Izyli LLP", amount: "$9983", status: "Unpaid" },
        { name: "Change on the board", company: "FIVCO - Izyli LLP", amount: "$1457", status: "Unpaid" },
        { name: "Hospital Management", company: "RIVCO - KCL Corp", amount: "$5483", status: "Paid" },
    ];

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow dark:shadow-none p-5 flex flex-col h-full transition-colors duration-300">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">Invoices</h3>
                <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">This Week</span>
            </div>

            <div className="space-y-4 flex-1">
                {invoices.map((inv, i) => (
                    <div key={i} className="flex justify-between items-center group">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center transition-colors">
                                <span className="font-bold text-xs text-gray-600 dark:text-gray-300">{inv.name.charAt(0)}</span>
                            </div>
                            <div>
                                <div className="text-xs font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{inv.name}</div>
                                <div className="text-[10px] text-gray-500 dark:text-gray-500">{inv.company}</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-gray-500 dark:text-gray-500">Payment</div>
                            <div className="font-bold text-xs text-gray-800 dark:text-gray-200">{inv.amount}</div>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-medium 
                            ${inv.status === 'Paid' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'}`}>
                            {inv.status}
                        </span>
                    </div>
                ))}
            </div>

            <button className="w-full mt-auto text-center text-xs text-gray-500 dark:text-gray-400 border dark:border-slate-600 rounded-lg py-2 hover:bg-gray-50 dark:hover:bg-slate-700 mt-2 transition-colors">
                View All
            </button>
        </div>
    );
};

export default Invoices;
