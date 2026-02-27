import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import AppIcon from "../../../Component/AppIcon";
import CryptoService from "../../../Security/useCrypto";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../Library/Select";

import { getTeamUsers } from "../PayrollChecklistService";

const TaskItem = ({ task, categories, formBuilders, isManagerView, toggleTaskStatus, handleStartWork, getUserAvatar, navigate }) => {
    const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';
    const isCompleted = task.status === 'completed';
    const batchProgress = task.transactions ? Math.round((task.transactions.filter(t => t.status === 'confirmed').length / task.transactions.length) * 100) : 0;
    const form = formBuilders.find(f => f.Id === task.formId);

    const priorityConfig = {
        critical: { color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/20', border: 'border-rose-100 dark:border-rose-800', icon: 'Zap', label: 'Critical' },
        high: { color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-100 dark:border-amber-800', icon: 'AlertCircle', label: 'High' },
        medium: { color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-indigo-100 dark:border-indigo-800', icon: 'Clock', label: 'Standard' },
        low: { color: 'text-slate-500', bg: 'bg-slate-50 dark:bg-slate-800/40', border: 'border-slate-100 dark:border-slate-700', icon: 'Check', label: 'Low' }
    }[task.priority || 'medium'];
    const category = categories.find(c => c.value === task.category || c.id === task.category);
    const categoryName = category ? category.label || category.name : null;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className={`group relative bg-white dark:bg-slate-800 p-5 rounded-[24px] border transition-all duration-300 ${isCompleted
                ? 'border-slate-400 dark:border-slate-800/50 opacity-80'
                : 'border-gray-200 dark:border-gray-800 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-xl hover:shadow-indigo-500/5'
                }`}
        >
            <div className="flex flex-col gap-5">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    {/* Status Indicator (Static) */}
                    <div className="flex items-center gap-4 lg:w-[35%]">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shrink-0 ${isCompleted
                            ? 'bg-green-500 text-white'
                            : isOverdue
                                ? 'bg-red-50 dark:bg-red-900/20 text-red-500 border border-red-100 dark:border-red-800'
                                : 'bg-gray-50 dark:bg-gray-800 text-gray-400 border border-gray-100 dark:border-gray-700'
                            }`}
                        >
                            <AppIcon name={isCompleted ? "Check" : isOverdue ? "AlertTriangle" : "Clock"} size={18} strokeWidth={2.5} />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${priorityConfig.bg} ${priorityConfig.color} ${priorityConfig.border}`}>
                                    {priorityConfig.label}
                                </span>
                                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded-md border border-gray-100 dark:border-gray-700">#{task.id}</span>
                                {categoryName && (
                                    <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400  bg-gray-50 dark:bg-gray-800 px-2 py-0.5 rounded-md border border-gray-100 dark:border-gray-700 uppercase flex items-center gap-1">
                                        <AppIcon name="Tag" size={10} />
                                        {categoryName}
                                    </span>
                                )}
                                {task.recurrenceType && task.recurrenceType !== 'once' && (
                                    <span className="text-[10px] font-bold text-primary-500 bg-primary-50 dark:bg-primary-900/20 dark:text-gray-500 px-2 py-0.5 rounded-md border border-primary-100 dark:border-primary-800 uppercase flex items-center gap-1">
                                        <AppIcon name="RefreshCw" size={10} />
                                        {task.recurrenceType}
                                    </span>
                                )}
                            </div>
                            <h3 className={`text-[15px] font-bold leading-tight truncate ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-800 dark:text-gray-100'}`}>
                                {task.title}
                            </h3>
                            {task.description && (
                                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-1 font-medium italic">
                                    {task.description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-6 px-4 border-l border-gray-100 dark:border-gray-800">
                        <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-0.5">Assigned To</span>
                            <div className="flex items-center gap-2">
                                {getUserAvatar(task.assignee) ? (
                                    <img src={getUserAvatar(task.assignee)} alt={task.assignee} className="w-6 h-6 rounded-lg object-cover ring-1 ring-gray-100" />
                                ) : (
                                    <div className="w-6 h-6 rounded-lg bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center text-[10px] font-black text-primary-600 dark:text-white uppercase">
                                        {task.assignee?.charAt(0)}
                                    </div>
                                )}
                                <span className="text-xs font-bold text-gray-600 dark:text-gray-300 truncate">{task.assignee || 'Unassigned'}</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-0.5">Client</span>
                            <div className="flex items-center gap-2">
                                <div className="p-1 bg-amber-50 dark:bg-amber-900/30 rounded-md text-amber-600">
                                    <AppIcon name="Building2" size={12} />
                                </div>
                                <span className="text-xs font-bold text-gray-600 dark:text-gray-300 truncate">
                                    {task.client || "Global"}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-0.5">Effort</span>
                            <div className="flex items-center gap-2">
                                <div className="p-1 bg-gray-50 dark:bg-gray-800 rounded-md text-gray-400">
                                    <AppIcon name="Timer" size={12} />
                                </div>
                                <span className="text-xs font-bold text-gray-600 dark:text-gray-300 truncate">
                                    {task.estimatedTime || "--"}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest pl-0.5">Deadline</span>
                            <div className="flex items-center gap-2">
                                <AppIcon name="Calendar" size={14} className={isOverdue ? 'text-red-500' : 'text-gray-400'} />
                                <span className={`text-xs font-bold ${isOverdue ? 'text-red-600' : 'text-gray-600 dark:text-gray-300'}`}>
                                    {task.dueDate}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pl-4 border-l border-gray-100 dark:border-gray-800">
                        {task.isBatch && (
                            <div className="hidden xl:flex flex-col gap-1 mr-2 w-24">
                                <div className="flex justify-between text-[9px] font-bold text-primary-600 uppercase italic">
                                    <span>Sync</span>
                                    <span>{batchProgress}%</span>
                                </div>
                                <div className="h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary-500" style={{ width: `${batchProgress}%` }} />
                                </div>
                            </div>
                        )}

                        <button
                            onClick={() => navigate(`/checklist/task-details/${task.id}`)}
                            className="p-2.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-all"
                            title="View Details"
                        >
                            <AppIcon name="Maximize2" size={18} />
                        </button>

                        {task.formId && !isCompleted && !isManagerView && (
                            <button
                                onClick={() => handleStartWork(task.formId)}
                                className="grow lg:flex-none h-10 px-6 bg-primary-600 dark:bg-primary-600 text-white rounded-xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-primary-700 shadow-lg shadow-primary-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                Process
                                <AppIcon name="ArrowRight" size={14} />
                            </button>
                        )}

                        {isCompleted && isManagerView && (
                            <button
                                className="grow lg:flex-none h-10 px-6 bg-amber-500 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-md flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
                            >
                                <AppIcon name="CheckCircle" size={14} />
                                Verified
                            </button>
                        )}
                    </div>
                </div>

                {/* Metadata Footer */}
                <div className="pt-4 border-t border-gray-50 dark:border-gray-800 flex flex-wrap items-center gap-x-6 gap-y-3">
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-widest">Risk Level:</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border flex items-center gap-1.5 ${task.riskLevel === 'High' || task.riskLevel === 'Critical' || task.riskLevel === 'Ultra'
                            ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400'
                            : task.riskLevel === 'Medium'
                                ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-400'
                                : 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400'
                            }`}>
                            <div className={`w-1 h-1 rounded-full ${task.riskLevel === 'High' || task.riskLevel === 'Critical' || task.riskLevel === 'Ultra' ? 'bg-red-500 animate-pulse' : 'bg-current'
                                }`} />
                            {task.riskLevel || 'Low'}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-gray-300 dark:text-gray-600 uppercase tracking-widest">Origin:</span>
                        <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">{task.createdBy || 'Automated'}</span>
                    </div>

                    {task.tags && task.tags.length > 0 && (
                        <div className="flex items-center gap-1.5 border-l border-gray-100 dark:border-gray-800 pl-6">
                            {task.tags.map(tag => (
                                <span key={tag} className="px-2 py-0.5 rounded-md bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="flex-1" />

                    <div className="flex items-center gap-4 text-[9px] font-bold text-gray-300 dark:text-gray-600 uppercase tracking-widest">
                        {task.createdOn && (
                            <span>Registered {new Date(task.createdOn).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}</span>
                        )}
                        {task.updatedOn && (
                            <span className="text-gray-400">Sync {new Date(task.updatedOn).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}</span>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const ChecklistTasks = ({
    activeTab,
    filteredTasks,
    toggleTaskStatus,
    showFilterMenu,
    setShowFilterMenu,
    showSortMenu,
    setShowSortMenu,
    statusFilter,
    setStatusFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    categories,
    isManagerView = false,
    selectedTeamMember,
    setSelectedTeamMember
}) => {
    const navigate = useNavigate();
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

    const handleStartWork = (formId) => {
        if (!formId) return;
        const encryptedId = CryptoService.EncryptWithAES(formId.toString());
        navigate(`/inputs/${encryptedId}`);
    };

    const getUserAvatar = (name) => {
        const user = teamUsers.find(u => u.name === name);
        return user ? user.avatar : null;
    };

    return (
        <div className="flex-1 space-y-6">
            {isManagerView ? (
                <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center text-indigo-600">
                            <AppIcon name="Users" size={20} />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Team Activity Oversight</h4>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Filter by individual throughput</p>
                        </div>
                    </div>

                    <div className="w-full md:w-64">
                        <Select value={selectedTeamMember} onValueChange={setSelectedTeamMember}>
                            <SelectTrigger className="h-10 bg-slate-50/50 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-700 rounded-xl font-bold text-xs uppercase tracking-tight">
                                <SelectValue placeholder="All Members" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-200 dark:border-slate-800">
                                <SelectItem value="all" className="font-bold text-xs">All Team Members</SelectItem>
                                {teamUsers.map((u) => (
                                    <SelectItem key={u.name} value={u.name} className="font-bold text-xs">
                                        {u.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 capitalize flex items-center gap-3">
                        {categories.find(c => String(c.id) === String(activeTab) || String(c.value) === String(activeTab))?.label || activeTab} Queue
                        <span className="px-2.5 py-1 rounded-lg bg-primary-50 dark:bg-primary-900/30 dark:text-white text-[10px] text-primary-600 font-black">{filteredTasks.length} ITEMS</span>
                    </h2>
                    <div className="flex gap-2">
                        <div className="relative group/btn">
                            <button
                                onClick={() => { setShowFilterMenu(!showFilterMenu); setShowSortMenu(false); }}
                                className={`h-9 px-3 rounded-xl border transition-all flex items-center gap-2 text-xs font-bold ${showFilterMenu
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20'
                                    : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}>
                                <AppIcon name="Filter" size={14} />
                                Filter
                            </button>
                            <AnimatePresence>
                                {showFilterMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: 5 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 5 }}
                                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden"
                                    >
                                        <div className="p-2 space-y-1">
                                            {['all', 'pending', 'completed', 'critical'].map(option => (
                                                <button
                                                    key={option}
                                                    onClick={() => { setStatusFilter(option); setShowFilterMenu(false); }}
                                                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-tight flex items-center justify-between transition-colors
                                                    ${statusFilter === option ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                                                >
                                                    <span>{option}</span>
                                                    {statusFilter === option && <AppIcon name="Check" size={14} />}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="relative group/btn">
                            <button
                                onClick={() => { setShowSortMenu(!showSortMenu); setShowFilterMenu(false); }}
                                className={`h-9 px-3 rounded-xl border transition-all flex items-center gap-2 text-xs font-bold ${showSortMenu
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-600/20'
                                    : 'bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-slate-300'}`}>
                                <AppIcon name="ArrowDownUp" size={14} />
                                Sort
                            </button>
                            <AnimatePresence>
                                {showSortMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95, y: 5 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95, y: 5 }}
                                        className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden"
                                    >
                                        <div className="p-2 space-y-1">
                                            {[
                                                { id: 'dueDate', label: 'Due Date' },
                                                { id: 'priority', label: 'Priority' },
                                                { id: 'title', label: 'Title' }
                                            ].map(opt => (
                                                <button
                                                    key={opt.id}
                                                    onClick={() => {
                                                        if (sortBy === opt.id) {
                                                            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                                                        } else {
                                                            setSortBy(opt.id);
                                                            setSortOrder('asc');
                                                        }
                                                        setShowSortMenu(false);
                                                    }}
                                                    className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-tight flex items-center justify-between transition-colors
                                                    ${sortBy === opt.id ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                                                >
                                                    <span>{opt.label}</span>
                                                    {sortBy === opt.id && (
                                                        <AppIcon name={sortOrder === 'asc' ? "ArrowUp" : "ArrowDown"} size={14} />
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            )}

            <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {filteredTasks.map(task => (
                        <TaskItem
                            key={task.id}
                            task={task}
                            categories={categories}
                            formBuilders={formBuilders}
                            isManagerView={isManagerView}
                            toggleTaskStatus={toggleTaskStatus}
                            handleStartWork={handleStartWork}
                            getUserAvatar={getUserAvatar}
                            navigate={navigate}
                        />
                    ))}
                </AnimatePresence>

                {filteredTasks.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-24 bg-white dark:bg-slate-800 p-8 rounded-[32px] border border-slate-100 dark:border-slate-700 shadow-sm"
                    >
                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                            <AppIcon name="Inbox" size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 italic">"Everything is on track."</h3>
                        <p className="text-slate-400 text-sm mt-2 max-w-xs mx-auto">No outstanding tasks found in this view context.</p>
                        <button
                            onClick={() => { setStatusFilter('all'); setSelectedTeamMember('all'); }}
                            className="mt-8 px-6 py-2 bg-slate-100 dark:bg-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:text-indigo-600 transition-colors"
                        >
                            Reset Scope
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ChecklistTasks;
