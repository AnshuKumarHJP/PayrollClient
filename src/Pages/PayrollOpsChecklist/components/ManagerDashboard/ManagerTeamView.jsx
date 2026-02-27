import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import AppIcon from "../../../../Component/AppIcon";
import { Skeleton } from "../../../../Skeleton/Skeletons";
import { getTeamUsers } from "../../PayrollChecklistService";

const TeamMemberCard = ({ member, onClick, index, teamUsers }) => {
    const totalTasks = member.tasks.length;
    const progress = totalTasks > 0 ? Math.round((member.completed / totalTasks) * 100) : 0;

    // Status Config
    const statusConfig = {
        complete: {
            color: 'text-emerald-600',
            bg: 'bg-emerald-50/50 dark:bg-emerald-500/5',
            ring: 'border-emerald-500',
            bar: 'bg-gradient-to-r from-emerald-400 to-emerald-600'
        },
        critical: {
            color: 'text-rose-600',
            bg: 'bg-rose-50/50 dark:bg-rose-500/5',
            ring: 'border-rose-500',
            bar: 'bg-gradient-to-r from-rose-400 to-rose-600'
        },
        active: {
            color: 'text-indigo-600',
            bg: 'bg-indigo-50/50 dark:bg-indigo-500/5',
            ring: 'border-indigo-500',
            bar: 'bg-gradient-to-r from-indigo-400 to-indigo-600'
        },
        warning: {
            color: 'text-amber-600',
            bg: 'bg-amber-50/50 dark:bg-amber-500/5',
            ring: 'border-amber-500',
            bar: 'bg-gradient-to-r from-amber-400 to-amber-600'
        }
    };

    let config = statusConfig.active;
    if (progress === 100) config = statusConfig.complete;
    else if (member.critical > 0 || member.overdue > 0) config = statusConfig.critical;
    else if (progress < 30) config = statusConfig.warning;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
            onClick={onClick}
            className="group relative bg-white dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700/50 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-400 cursor-pointer overflow-hidden"
        >
            {/* Top Gloss Effect */}
            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />

            <div className="p-5 relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <div className={`relative p-0.5 rounded-full border-2 ${config.ring} shadow-lg shadow-black/5 flex-shrink-0 transition-all duration-500 group-hover:scale-105`}>
                            <div className="relative">
                                {teamUsers.find(u => u.name === member.name)?.avatar ? (
                                    <img
                                        src={teamUsers.find(u => u.name === member.name).avatar}
                                        alt={member.name}
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center text-lg font-bold text-slate-400 dark:text-slate-500">
                                        {member.name.charAt(0)}
                                    </div>
                                )}

                                {/* Live Status Dot */}
                                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full shadow-sm" />
                            </div>

                            {/* Critical Pulse */}
                            {(member.critical > 0 || member.overdue > 0) && (
                                <span className="absolute -top-1 -right-1 flex h-5 w-5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-40"></span>
                                    <span className="relative inline-flex rounded-full h-5 w-5 bg-rose-500 border-2 border-white dark:border-slate-800 items-center justify-center">
                                        <AppIcon name="AlertCircle" size={9} className="text-white" />
                                    </span>
                                </span>
                            )}
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-[15px] font-bold text-slate-900 dark:text-slate-100 leading-tight group-hover:text-indigo-600 transition-colors truncate">
                                {member.name}
                            </h3>
                            <div className="flex items-center gap-1.5 mt-1">
                                <span className="flex h-1 w-1 rounded-full bg-indigo-500" />
                                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                                    {totalTasks} {totalTasks === 1 ? 'Task' : 'Tasks'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                        <div className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded-lg text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 transition-all duration-300">
                            <AppIcon name="ArrowUpRight" size={16} />
                        </div>
                    </div>
                </div>

                {/* Modern Stats Chips */}
                <div className="flex gap-2 mb-5">
                    <div className="flex-1 flex flex-col items-center justify-center py-2 bg-slate-50/50 dark:bg-slate-700/20 rounded-2xl border border-slate-100 dark:border-slate-700/30 transition-all duration-300 hover:bg-white dark:hover:bg-slate-700/50 hover:shadow-md">
                        <AppIcon name="CheckCircle2" size={12} className="text-emerald-500 mb-1" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">Done</span>
                        <span className="text-base font-bold text-slate-900 dark:text-slate-100">{member.completed}</span>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center py-2 bg-slate-50/50 dark:bg-slate-700/20 rounded-2xl border border-slate-100 dark:border-slate-700/30 transition-all duration-300 hover:bg-white dark:hover:bg-slate-700/50 hover:shadow-md">
                        <AppIcon name="Clock" size={12} className="text-amber-500 mb-1" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">Due</span>
                        <span className={`text-base font-bold ${member.pending > 0 ? 'text-slate-900 dark:text-slate-100' : 'text-slate-300'}`}>
                            {member.pending}
                        </span>
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center py-2 bg-rose-50/50 dark:bg-rose-500/5 rounded-2xl border border-rose-100/50 dark:border-rose-500/20 transition-all duration-300 hover:bg-rose-100/30 dark:hover:bg-rose-500/10 hover:shadow-md">
                        <AppIcon name="Zap" size={12} className="text-rose-500 mb-1" />
                        <span className="text-[9px] font-bold text-rose-500 uppercase tracking-wide mb-0.5">Crit</span>
                        <span className={`text-base font-bold ${member.critical > 0 ? 'text-rose-600' : 'text-rose-200 dark:text-rose-900'}`}>
                            {member.critical}
                        </span>
                    </div>
                </div>

                {/* Smooth Progress Area */}
                <div className="space-y-2">
                    <div className="flex justify-between items-baseline px-0.5">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Progress</span>
                            {progress === 100 && (
                                <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 text-[9px] font-bold uppercase">
                                    Top <AppIcon name="Star" size={8} fill="currentColor" />
                                </span>
                            )}
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className={`text-lg font-bold ${config.color}`}>{progress}</span>
                            <span className="text-[9px] font-semibold text-slate-400 dark:text-slate-500">%</span>
                        </div>
                    </div>
                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-700/50 rounded-full p-0.5">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: [0.34, 1.56, 0.64, 1] }}
                            className={`h-full rounded-full relative ${config.bar}`}
                        >
                            {/* Inner Shimmer Effect */}
                            <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Background Accent Element */}
            <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full blur-[40px] opacity-10 transition-colors duration-500 ${config.bg.replace('/50', '/60')}`} />
        </motion.div>
    );
};

const ManagerTeamView = ({ teamMembers, setSelectedTeamMember, setViewMode, loading }) => {
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
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Team Performance</h3>
                    <p className="text-sm text-slate-500">Real-time workload and status tracking</p>
                </div>
                <div className="text-sm font-medium px-3 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-600 dark:text-slate-300">
                    {teamMembers.length} Members
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 pb-6">
                {teamMembers.map((member, index) => (
                    <TeamMemberCard
                        key={member.name}
                        member={member}
                        index={index}
                        onClick={() => {
                            setSelectedTeamMember(member.name);
                            setViewMode("tasks");
                        }}
                        teamUsers={teamUsers}
                    />
                ))}
            </div>
        </div>
    );
};

export default ManagerTeamView;
