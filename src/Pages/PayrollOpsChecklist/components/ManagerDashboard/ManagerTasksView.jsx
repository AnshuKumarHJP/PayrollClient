import React, { useState, useEffect } from 'react';
import { useSelector } from "react-redux";
import AppIcon from "../../../../Component/AppIcon";
import { motion, AnimatePresence } from "framer-motion";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../../Library/Select";
import { Skeleton } from "../../../../Skeleton/Skeletons";
import { getTeamUsers } from "../../PayrollChecklistService";



const PriorityBadge = ({ priority }) => {
    const priorityConfig = {
        critical: { label: 'Critical', bg: 'bg-rose-50', text: 'text-rose-600', dot: 'bg-rose-500' },
        high: { label: 'High', bg: 'bg-orange-50', text: 'text-orange-600', dot: 'bg-orange-500' },
        medium: { label: 'Medium', bg: 'bg-indigo-50', text: 'text-indigo-600', dot: 'bg-indigo-500' },
        low: { label: 'Low', bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500' }
    };

    const config = priorityConfig[priority] || priorityConfig.low;

    return (
        <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${config.bg} ${config.text} dark:bg-slate-800 ring-1 ring-inset ring-black/5`}>
            <span className={`w-1 h-1 rounded-full ${config.dot}`} />
            {config.label}
        </span>
    );
};

const StatusBadge = ({ status }) => {
    return status === 'completed' ? (
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/10 px-2.5 py-1 rounded-lg border border-emerald-100 dark:border-emerald-800/30">
            <AppIcon name="CheckCircle2" size={12} />
            Completed
        </div>
    ) : (
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/10 px-2.5 py-1 rounded-lg border border-amber-100 dark:border-amber-800/30 font-black">
            <AppIcon name="Clock" size={12} />
            In Progress
        </div>
    );
};

const ManagerTasksView = ({ selectedTeamMember, filteredTasks, teamMembers, categories, onToggleStatus, isPersonalView, loading, setSelectedTeamMember }) => {
    const { FormBuilder } = useSelector((s) => s.FormBuilderStore);
    const formBuilders = Array.isArray(FormBuilder?.data) ? FormBuilder?.data : [];

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

    const getUserAvatar = (name) => {
        return teamUsers.find(u => u.name === name)?.avatar;
    };

    const teamOptions = [
        { value: "all", label: "All Team Members" },
        ...teamUsers.map(u => ({ value: u.name, label: u.name }))
    ];

    if (loading) {
        return (
            <div className="space-y-4">
                {!isPersonalView && <Skeleton className="h-16 w-full rounded-xl mb-4" />}
                <div className="space-y-3">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700">
                            <div className="flex justify-between items-start">
                                <div className="space-y-3 w-full pr-12">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-5 w-1/2 rounded" />
                                        <Skeleton className="h-5 w-16 rounded" />
                                    </div>
                                    <div className="flex gap-3">
                                        <Skeleton className="h-4 w-24 rounded" />
                                        <Skeleton className="h-4 w-32 rounded" />
                                    </div>
                                </div>
                                <Skeleton className="h-8 w-24 rounded-lg" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-5">
            {/* Control Bar */}
            {!isPersonalView && (
                <div className="bg-white dark:bg-slate-800 p-4 rounded-[15px] border border-slate-200/60 dark:border-slate-700/50 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all hover:shadow-xl hover:shadow-indigo-500/5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 dark:shadow-none">
                            <AppIcon name="Filter" size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-[15px] tracking-tight">Task Oversight</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Global Filters</p>
                        </div>
                    </div>

                    <div className="flex-1 sm:flex-none w-full sm:w-72">
                        <Select value={selectedTeamMember} onValueChange={setSelectedTeamMember}>
                            <SelectTrigger className="h-10 bg-slate-50/50 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-700/50 rounded-xl font-bold text-sm focus:ring-4 focus:ring-indigo-500/10">
                                <SelectValue placeholder="Select Assignee" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800 shadow-2xl">
                                {teamOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value} className="font-bold text-xs rounded-lg">
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )}

            {/* Task List Container */}
            <div className="space-y-3 pb-8">
                <AnimatePresence mode="popLayout">
                    {filteredTasks.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="flex flex-col items-center justify-center p-16 bg-slate-50/50 dark:bg-slate-900/20 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700"
                        >
                            <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100 dark:border-slate-700 text-slate-300">
                                <AppIcon name="Layout" size={32} />
                            </div>
                            <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 italic">No Tasks Matched</h3>
                            <p className="text-slate-500 text-sm font-medium mt-1">Try expanding your filter criteria</p>
                        </motion.div>
                    ) : (
                        filteredTasks.map((task, idx) => (
                            <motion.div
                                key={task.id}
                                layout
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                transition={{ duration: 0.25, delay: idx * 0.03 }}
                                className={`group relative bg-white dark:bg-slate-800 p-5 rounded-[20px] border transition-all duration-300 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1
                                ${task.status === 'completed'
                                        ? 'border-slate-100 dark:border-slate-800/50 opacity-80'
                                        : 'border-slate-200/60 dark:border-slate-700/50 hover:border-indigo-300 dark:hover:border-indigo-500/50'
                                    }
                                `}
                            >
                                {/* Left Priority Strip */}
                                <div className={`absolute left-0 top-5 bottom-5 w-1 rounded-r-xl shadow-sm ${task.priority === 'critical' ? 'bg-rose-500' :
                                    task.priority === 'high' ? 'bg-orange-500' :
                                        task.priority === 'medium' ? 'bg-indigo-500' : 'bg-emerald-500'
                                    }`} />

                                <div className="flex items-start gap-4">
                                    {isPersonalView && (
                                        <button
                                            onClick={() => onToggleStatus(task.id)}
                                            className={`mt-1 flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${task.status === 'completed'
                                                ? 'bg-emerald-500 border-emerald-500 text-white'
                                                : 'border-slate-300 hover:border-indigo-500 text-transparent hover:bg-slate-50'
                                                }`}
                                        >
                                            <AppIcon name="Check" size={12} strokeWidth={4} />
                                        </button>
                                    )}

                                    <div className="flex-1 min-w-0 pr-2">
                                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                                            <h4 className={`font-bold text-[12px] md:text-[15px] leading-tight transition-colors duration-300 transition-colors ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-slate-100 group-hover:text-indigo-600'}`}>
                                                {task.title}
                                            </h4>
                                            <div className="flex items-center gap-2">
                                                <PriorityBadge priority={task.priority} />
                                                <div className="flex text-[9px] md:text-xs items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100/50 dark:border-slate-800/50 text-[9px] font-bold text-slate-500 uppercase tracking-tight">
                                                    <AppIcon name="Tag" size={10} />
                                                    {categories.find(c => String(c.value) === String(task.category))?.label || "General"}
                                                </div>

                                                {task.formId && (
                                                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100/50 dark:border-emerald-800/30 text-[9px] font-bold text-emerald-600 uppercase tracking-tight">
                                                        <AppIcon name="FileText" size={10} />
                                                        {formBuilders.find(f => String(f.Id) === String(task.formId))?.Name || "Linked"}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-4 mt-4">
                                            {/* Assignee Info */}
                                            <div className="flex items-center gap-2.5 px-2.5 py-1 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100/50 dark:border-slate-700/50 transition-all hover:border-indigo-200">
                                                <div className="relative group/avatar">
                                                    {getUserAvatar(task.assignee) ? (
                                                        <img
                                                            src={getUserAvatar(task.assignee)}
                                                            alt={task.assignee}
                                                            className="w-5 h-5 rounded-full object-cover ring-2 ring-white dark:ring-slate-700 shadow-sm transition-transform group-hover/avatar:scale-110"
                                                        />
                                                    ) : (
                                                        <div className="w-5 h-5 rounded-full bg-indigo-100/50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[10px] font-black">
                                                            {task.assignee?.charAt(0)}
                                                        </div>
                                                    )}
                                                    <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 border border-white dark:border-slate-800 rounded-full shadow-sm" />
                                                </div>
                                                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">{task.assignee || 'Unassigned'}</span>
                                            </div>

                                            {/* Due Date Info */}
                                            <div className={`flex items-center gap-2 px-2.5 py-1 rounded-xl border text-[11px] font-bold tracking-tight transition-colors ${new Date(task.dueDate) < new Date() && task.status !== 'completed'
                                                ? 'bg-rose-50 text-rose-600 border-rose-100'
                                                : 'bg-slate-50/50 dark:bg-slate-900/40 text-slate-500 border-slate-100/50 dark:border-slate-700/50'
                                                }`}>
                                                <AppIcon name="Calendar" size={13} />
                                                <span>{task.dueDate}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action/Status Slot */}
                                    <div className="flex flex-col items-end justify-between self-stretch">
                                        <StatusBadge status={task.status} />
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-all" title="View Details">
                                                <AppIcon name="Eye" size={16} />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-all" title="Quick Actions">
                                                <AppIcon name="MoreHorizontal" size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ManagerTasksView;
