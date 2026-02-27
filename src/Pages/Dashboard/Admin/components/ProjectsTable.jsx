import React from "react";
import { MoreHorizontal } from "lucide-react";

const ProjectsTable = () => {
    const projects = [
        { id: "PRO-001", name: "Office Management App", team: ["A", "B", "C"], hours: "15/55 Hrs", deadline: "15/09/2024", priority: "High" },
        { id: "PRO-002", name: "Clinic Management", team: ["X", "Y"], hours: "15/255 Hrs", deadline: "24/10/2024", priority: "Low" },
        { id: "PRO-003", name: "Educational Platform", team: ["M", "N"], hours: "40/255 Hrs", deadline: "18/02/2024", priority: "Medium" },
        { id: "PRO-004", name: "Chat & Call Mobile App", team: ["D", "E"], hours: "25/155 Hrs", deadline: "11/02/2024", priority: "High" },
        { id: "PRO-005", name: "Travel Planning Website", team: ["F"], hours: "30/235 Hrs", deadline: "10/02/2024", priority: "Medium" },
        { id: "PRO-006", name: "Service Booking Software", team: ["G", "H"], hours: "40/255 Hrs", deadline: "20/02/2024", priority: "Low" }
    ];

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow dark:shadow-none p-5 transition-colors duration-300">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">Projects</h3>
                <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">This Week</span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-gray-400 dark:text-gray-500 font-medium border-b dark:border-slate-700">
                        <tr>
                            <th className="py-2 font-normal">ID</th>
                            <th className="py-2 font-normal">Name</th>
                            <th className="py-2 font-normal">Team</th>
                            <th className="py-2 font-normal">Hours</th>
                            <th className="py-2 font-normal">Deadline</th>
                            <th className="py-2 font-normal">Priority</th>
                            <th className="py-2 font-normal"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y dark:divide-slate-700">
                        {projects.map((p) => (
                            <tr key={p.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors">
                                <td className="py-3 text-gray-600 dark:text-gray-400">{p.id}</td>
                                <td className="py-3 font-medium text-gray-800 dark:text-gray-200">{p.name}</td>
                                <td className="py-3">
                                    {/* Avatar Stack Placeholder */}
                                    <div className="flex -space-x-2">
                                        {p.team.map((m, i) => (
                                            <div key={i} className="w-6 h-6 rounded-full bg-gray-200 dark:bg-slate-600 border-2 border-white dark:border-slate-800 flex items-center justify-center text-[10px] text-gray-500 dark:text-gray-300">
                                                {m}
                                            </div>
                                        ))}
                                    </div>
                                </td>
                                <td className="py-3 text-gray-500 dark:text-gray-400">{p.hours}</td>
                                <td className="py-3 text-gray-500 dark:text-gray-400">{p.deadline}</td>
                                <td className="py-3">
                                    <span className={`px-2 py-0.5 rounded text-xs font-medium 
                            ${p.priority === 'High' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                                            p.priority === 'Medium' ? 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400' :
                                                'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'}`}>
                                        {p.priority}
                                    </span>
                                </td>
                                <td className="py-3 text-gray-400 dark:text-gray-500 cursor-pointer text-right">
                                    <MoreHorizontal size={16} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProjectsTable;
