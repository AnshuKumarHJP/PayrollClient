import React from "react";
import { Wallet, DollarSign, Briefcase, UserPlus } from "lucide-react";

// Reusing StatsCard logic but packaging as a row section if desired, 
// or exporting a data array to be mapped by the parent. 
// For modularity, let's make this return the grid of 4 specific cards.

const FinancialStats = () => {
    const cards = [
        { title: "Earnings", value: "$2144", sub: "+11.2%", color: "bg-purple-500", icon: Wallet, isIncrease: true },
        { title: "Profit This Week", value: "$5,544", sub: "+2.1%", color: "bg-red-500", icon: DollarSign, isIncrease: true },
        { title: "Job Applicants", value: "98", sub: "+2.1%", color: "bg-green-500", icon: Briefcase, isIncrease: true },
        { title: "New Hire", value: "45/48", sub: "-11.2%", color: "bg-gray-800", icon: UserPlus, isIncrease: false },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, i) => (
                <div key={i} className="bg-white dark:bg-slate-800 rounded-xl shadow dark:shadow-none p-4 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:hover:bg-slate-750">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${card.color} text-white shadow-lg`}>
                            <card.icon size={20} />
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">{card.title}</div>
                    </div>

                    <div className="flex flex-col gap-1">
                        <div className="text-2xl font-bold text-gray-800 dark:text-white">{card.value}</div>
                        <div className="flex items-center gap-1 text-xs">
                            <span className={card.isIncrease ? "text-green-500 dark:text-green-400" : "text-red-500 dark:text-red-400"}>
                                {card.sub}
                            </span>
                            <span className="text-gray-400 dark:text-gray-500 ml-1">from last week</span>
                        </div>
                    </div>

                    <button className="text-xs text-blue-600 dark:text-blue-400 self-start mt-2 font-medium hover:underline">
                        View All
                    </button>
                </div>
            ))}
        </div>
    );
};

export default FinancialStats;
