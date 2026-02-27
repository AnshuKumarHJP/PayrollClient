import React, { useState, useEffect } from 'react';
import AppIcon from "../../../../Component/AppIcon";
import { Skeleton } from "../../../../Skeleton/Skeletons";
import { getTeamUsers } from "../../PayrollChecklistService";
import { motion } from 'framer-motion';

const ManagerStatsGrid = ({ stats, loading, teamMembers = [] }) => {
    const [teamUsers, setTeamUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getTeamUsers();
                setTeamUsers(data);
            } catch (error) {
                console.error("Failed to fetch team users", error);
            }
        };
        fetchUsers();
    }, []);

    const displayMembers = teamMembers.length > 0 ? teamMembers : teamUsers;
    const activeMembers = displayMembers.slice(0, 4);
    const totalWorking = displayMembers.length;
    const extraCount = Math.max(0, displayMembers.length - 4);

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-start justify-between">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-8 w-16" />
                        </div>
                        <Skeleton className="h-10 w-10 rounded-xl" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Stat Card: Total Tasks */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-xl">
                        <AppIcon name="Layers" size={20} />
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600">+12%</span>
                </div>
                <div>
                    <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{stats.total}</h3>
                    <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Total Tasks</p>
                </div>
            </div>

            {/* Stat Card: Completion Rate */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-xl">
                        <AppIcon name="CheckCircle" size={20} />
                    </div>
                </div>
                <div>
                    <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                        {stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%
                    </h3>
                    <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Completion Rate</p>
                </div>
                <div className="mt-4 h-1 w-full bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
                        className="h-full bg-emerald-500"
                    />
                </div>
            </div>

            {/* Stat Card: Pending Tasks */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 bg-amber-50 dark:bg-amber-900/30 text-amber-600 rounded-xl">
                        <AppIcon name="Clock" size={20} />
                    </div>
                </div>
                <div>
                    <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{stats.pending}</h3>
                    <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Pending Tasks</p>
                </div>
            </div>

            {/* Stat Card: Critical Tasks */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 bg-rose-50 dark:bg-rose-900/30 text-rose-600 rounded-xl">
                        <AppIcon name="Zap" size={20} />
                    </div>
                    {stats.critical > 0 && (
                        <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-pulse"></span>
                    )}
                </div>
                <div>
                    <h3 className="text-3xl font-bold text-rose-600">{stats.critical}</h3>
                    <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Critical Tasks</p>
                </div>
            </div>

            {/* Stat Card: Active Team */}
            <div className="bg-indigo-700 dark:bg-slate-800 p-6 rounded-3xl shadow-sm flex flex-col justify-between">
                <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Team</p>
                    <h3 className="text-xl font-bold text-white">Resource Allocation</h3>
                </div>

                <div className="flex items-center mt-4">
                    <div className="flex -space-x-3">
                        {activeMembers.map((member, i) => (
                            <img
                                key={i}
                                className="h-9 w-9 rounded-xl ring-2 ring-indigo-900 object-cover"
                                src={member.avatar || `https://i.pravatar.cc/150?u=${member.name}`}
                                alt={member.name}
                            />
                        ))}
                    </div>
                    {extraCount > 0 && (
                        <div className="h-9 w-9 rounded-xl bg-indigo-800 border-2 border-indigo-900 flex items-center justify-center text-[10px] font-bold text-white ml-[-12px] z-10">
                            +{extraCount}
                        </div>
                    )}
                </div>

                <div className="mt-4 flex items-center justify-between text-[10px] font-bold text-slate-400">
                    <span>{totalWorking} Online</span>
                    <AppIcon name="ArrowRight" size={12} />
                </div>
            </div>
        </div>
    );
};


export default ManagerStatsGrid;
