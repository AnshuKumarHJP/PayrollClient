import React, { useState } from "react";

const JobApplicants = () => {
    const [activeTab, setActiveTab] = useState("Applicants");

    const applicants = [
        { name: "Brian Villalobos", role: "UI/UX Designer", exp: "Exp: 5+ Years • USA", avatar: "B", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300" },
        { name: "Anthony Lewis", role: "Python Developer", exp: "Exp: 4+ Years • USA", avatar: "A", color: "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300" },
        { name: "Stephan Peralt", role: "Android Developer", exp: "Exp: 6+ Years • USA", avatar: "S", color: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-300" },
        { name: "Doglas Martini", role: "React Developer", exp: "Exp: 2+ Years • USA", avatar: "D", color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300" },
    ];

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow dark:shadow-none p-5 h-full flex flex-col transition-colors duration-300">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">Jobs Applicants</h3>
                <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">View All</button>
            </div>

            <div className="flex bg-gray-100 dark:bg-slate-700 rounded-lg p-1 mb-4 transition-colors">
                <button
                    className={`flex-1 py-1 text-xs font-medium rounded-md transition-all ${activeTab === 'Openings' ? 'bg-white dark:bg-slate-600 shadow text-gray-800 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}
                    onClick={() => setActiveTab('Openings')}
                >
                    Openings
                </button>
                <button
                    className={`flex-1 py-1 text-xs font-medium rounded-md transition-all ${activeTab === 'Applicants' ? 'bg-orange-500 text-white shadow' : 'text-gray-500 dark:text-gray-400'}`}
                    onClick={() => setActiveTab('Applicants')}
                >
                    Applicants
                </button>
            </div>

            <div className="space-y-4 flex-1">
                {applicants.map((app, i) => (
                    <div key={i} className="flex justify-between items-center group">
                        <div className="flex gap-3 items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${app.color}`}>
                                {app.avatar}
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{app.name}</div>
                                <div className="text-[10px] text-gray-400 dark:text-gray-500">{app.exp}</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className={`px-2 py-1 rounded text-[10px] font-medium 
                        ${app.role.includes("UI") ? "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400" :
                                    app.role.includes("Python") ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" :
                                        app.role.includes("Android") ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" :
                                            "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"}`}>
                                {app.role}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default JobApplicants;
