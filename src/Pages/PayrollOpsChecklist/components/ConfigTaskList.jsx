import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from "react-redux";
import AppIcon from "../../../Component/AppIcon";
import { motion, AnimatePresence } from "framer-motion";
import { getTeamUsers, getRoles } from "../PayrollChecklistService";
import {
    GetClientFormBuilderHeaderMappingsByClientId,
    GetFormBuilder,
    GetAllClientPortalWorkflowConfigurations,
} from "../../../Store/FormBuilder/Action";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../../../Library/Popover"; // Assuming this exists or similar
import TaskForm from "./TaskForm";

const ConfigTaskList = ({ tasks, onAddTask, onEditTask, onDeleteTask, categories, isLocked, isAddingTask, setIsAddingTask, selectedPayrollMonth }) => {
    const dispatch = useDispatch();

    /* ===================== REDUX STATE ===================== */
    const AUTH_DATA = useSelector((state) => state.Auth.LogResponce.data);
    const { FormBuilder, ClientFormBuilderHeaderMapping, ClientPortalWorkflowConfiguration } = useSelector((s) => s.FormBuilderStore);

    const clients = AUTH_DATA?.ClientList || [];
    const formBuilders = Array.isArray(FormBuilder?.data) ? FormBuilder?.data : [];
    const mappings = ClientFormBuilderHeaderMapping?.data || [];

    /* ===================== CLIENT SELECTION ===================== */
    const selectedClientCode = useSelector((state) => state.Auth?.Common?.SelectedClientCode || "");
    const selectedClientContractId = useSelector((state) => state.Auth?.Common?.SelectedClientContractCode || "");
    const selectedClient = useMemo(
        () => clients.find((c) => String(c.Id) === String(selectedClientCode)),
        [clients, selectedClientCode]
    );

    const selectedClientId = useMemo(() => selectedClient?.Id ?? null, [selectedClient?.Id]);

    /* ===================== API LOADING ===================== */
    const lastFetchedClientIdRef = useRef(null);

    useEffect(() => {
        const controller = new AbortController();
        dispatch(GetFormBuilder(controller.signal));
        return () => controller.abort();
    }, [dispatch]);

    useEffect(() => {
        if (!selectedClientId) return;
        if (lastFetchedClientIdRef.current === selectedClientId) return;
        lastFetchedClientIdRef.current = selectedClientId;
        dispatch(GetClientFormBuilderHeaderMappingsByClientId(selectedClientId));

        // Fetch Workflows
        if (selectedClientContractId) {
            dispatch(GetAllClientPortalWorkflowConfigurations({
                ClientId: selectedClientId,
                ClientContractId: selectedClientContractId
            }));
        }
    }, [dispatch, selectedClientId, selectedClientContractId]);

    /* ===================== DERIVED FORMS ===================== */
    const clientTemplates = useMemo(() => {
        if (!selectedClientId) return [];
        const mappedIds = mappings
            ?.filter((m) => m.ClientId === selectedClientId)
            ?.map((m) => m.FormBuilderId);
        return formBuilders.filter((f) => mappedIds.includes(f.Id));
    }, [mappings, formBuilders, selectedClientId]);

    const workflows = Array.isArray(ClientPortalWorkflowConfiguration?.data) ? ClientPortalWorkflowConfiguration.data : [];

    const [editingTask, setEditingTask] = useState(null);
    const [sortBy, setSortBy] = useState('dueDate');
    const [sortOrder, setSortOrder] = useState('asc');

    const [teamUsers, setTeamUsers] = useState([]);
    const [roles, setRoles] = useState([]);

    useEffect(() => {
        const fetchRefData = async () => {
            try {
                const [u, r] = await Promise.all([getTeamUsers(), getRoles()]);
                setTeamUsers(u);
                setRoles(r);
            } catch (err) {
                console.error("Failed to load users/roles", err);
            }
        };
        fetchRefData();
    }, []);

    const isPastMonth = useMemo(() => {
        if (!selectedPayrollMonth) return false;
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth() + 1;

        if (selectedPayrollMonth.year < currentYear) return true;
        if (selectedPayrollMonth.year === currentYear && selectedPayrollMonth.month < currentMonth) return true;
        return false;
    }, [selectedPayrollMonth]);

    const handleEditClick = (task) => {
        if (isPastMonth) return;
        setEditingTask(task);
    };

    const handleFormClose = () => {
        // setIsFormOpen(false);
        setEditingTask(null);
        if (setIsAddingTask) setIsAddingTask(false);
    };

    const handleFormSubmit = (taskData) => {
        if (editingTask) {
            onEditTask({ ...editingTask, ...taskData });
        } else {
            onAddTask(taskData);
        }
        handleFormClose();
    };

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    const [statusFilter, setStatusFilter] = useState('all');

    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            if (statusFilter === 'all') return true;
            if (statusFilter === 'critical') return task.priority === 'critical';
            return task.status === statusFilter;
        });
    }, [tasks, statusFilter]);

    const sortedTasks = useMemo(() => {
        return [...filteredTasks].sort((a, b) => {
            const aValue = a[sortBy] || '';
            const bValue = b[sortBy] || '';

            if (sortBy === 'dueDate') {
                return sortOrder === 'asc'
                    ? new Date(aValue) - new Date(bValue)
                    : new Date(bValue) - new Date(aValue);
            }

            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
    }, [filteredTasks, sortBy, sortOrder]);

    const SortIcon = ({ field }) => {
        if (sortBy !== field) return <AppIcon name="ChevronsUpDown" size={14} className="opacity-30" />;
        return sortOrder === 'asc'
            ? <AppIcon name="ChevronUp" size={14} className="text-indigo-600" />
            : <AppIcon name="ChevronDown" size={14} className="text-indigo-600" />;
    };

    return (
        <div className="space-y-4">
            {/* Filter & Actions Area */}
            <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-lg text-indigo-600">
                        <AppIcon name="List" size={18} />
                    </div>
                    <div>
                        <h2 className="text-[13px] font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">Active Checklist</h2>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{filteredTasks.length} of {tasks.length} tasks</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <button className="group flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-indigo-300 dark:hover:border-indigo-700 transition-all text-xs font-bold text-slate-600 dark:text-slate-400 shadow-sm active:scale-95">
                                <AppIcon name="Filter" size={14} className={statusFilter !== 'all' ? 'text-indigo-600' : 'text-slate-400 group-hover:text-indigo-500'} />
                                <span className="capitalize">{statusFilter === 'all' ? 'Filter' : statusFilter}</span>
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-44 p-1.5 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xl rounded-xl" align="end">
                            <div className="space-y-1">
                                {[
                                    { id: 'all', label: 'All Tasks', icon: 'Layers' },
                                    { id: 'pending', label: 'Pending', icon: 'Clock', color: 'text-amber-500' },
                                    { id: 'completed', label: 'Completed', icon: 'CheckCircle2', color: 'text-emerald-500' },
                                    { id: 'critical', label: 'Critical Only', icon: 'AlertTriangle', color: 'text-rose-500' }
                                ].map((option) => (
                                    <button
                                        key={option.id}
                                        onClick={() => setStatusFilter(option.id)}
                                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-all ${statusFilter === option.id
                                            ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 font-bold'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                            }`}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <AppIcon name={option.icon} size={13} className={option.color || ''} />
                                            <span>{option.label}</span>
                                        </div>
                                        {statusFilter === option.id && <AppIcon name="Check" size={12} />}
                                    </button>
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>

                    <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 mx-1" />

                    <button
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-all active:scale-90"
                        title={sortOrder === 'asc' ? "Sort Descending" : "Sort Ascending"}
                    >
                        <AppIcon name={sortOrder === 'asc' ? "SortAsc" : "SortDesc"} size={16} />
                    </button>
                </div>
            </div>

            {/* Column Headers */}
            <div className="hidden md:grid md:grid-cols-[1fr_200px_200px_100px] gap-4 px-6 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-transparent">
                <div
                    className="flex items-center gap-2 cursor-pointer hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    onClick={() => handleSort('title')}
                >
                    Task Details
                    <SortIcon field="title" />
                </div>
                <div
                    className="flex items-center gap-2 cursor-pointer hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    onClick={() => handleSort('assignee')}
                >
                    Assignee
                    <SortIcon field="assignee" />
                </div>
                <div
                    className="flex items-center gap-2 cursor-pointer hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    onClick={() => handleSort('dueDate')}
                >
                    Schedule
                    <SortIcon field="dueDate" />
                </div>
                <div className="text-right">Actions</div>
            </div>

            <AnimatePresence>
                {(isAddingTask || editingTask) && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <TaskForm
                            initialData={editingTask || (isAddingTask ? { category: activeCategory } : null)}
                            tasks={tasks} // Pass all tasks for parent selection
                            categories={categories}
                            selectedPayrollMonth={selectedPayrollMonth}
                            users={teamUsers}
                            roles={roles}
                            forms={clientTemplates}
                            workflows={workflows}
                            onSubmit={handleFormSubmit}
                            onCancel={handleFormClose}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="space-y-4 md:space-y-1">
                {filteredTasks.length === 0 && !isAddingTask && !editingTask ? (
                    <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 border-dashed">
                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                            <AppIcon name="ClipboardList" size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">No tasks found</h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                            {statusFilter !== 'all' ? 'No tasks match the active filter.' : 'Start by creating a new task or cloning from an existing workflow.'}
                        </p>
                    </div>
                ) : (
                    (() => {
                        // Build Tree Structure
                        const taskMap = {};
                        tasks.forEach(task => taskMap[task.id] = { ...task, subtasks: [] });

                        const rootTasks = [];
                        sortedTasks.forEach(task => {
                            const node = taskMap[task.id];
                            if (task.parentId && taskMap[task.parentId]) {
                                taskMap[task.parentId].subtasks.push(node);
                            } else {
                                rootTasks.push(node);
                            }
                        });

                        const TaskItem = ({ task, depth = 0 }) => {
                            const [isExpanded, setIsExpanded] = useState(false);
                            const hasChildren = task.subtasks && task.subtasks.length > 0;

                            return (
                                <div className={`relative ${depth > 0 ? 'ml-8 md:ml-16' : ''}`}>
                                    {/* Horizontal Branch Connector for Subtasks */}
                                    {depth > 0 && (
                                        <div
                                            className={`absolute left-[-22px] top-[42px] w-[22px] h-[1.5px] ${task.priority === 'critical' ? 'bg-red-500' : task.priority === 'high' ? 'bg-orange-500' : task.priority === 'medium' ? 'bg-indigo-500' : 'bg-slate-300'}`}
                                        />
                                    )}

                                    <div
                                        className={`group relative flex flex-col md:grid md:grid-cols-[1fr_200px_200px_100px] gap-4 md:gap-6 items-start md:items-center p-5 bg-white dark:bg-slate-800 rounded-[24px] border border-slate-200/60 dark:border-slate-700/50 hover:border-indigo-300 dark:hover:border-indigo-500/50 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 mb-2`}
                                    >
                                        {/* Priority Indicator Line */}
                                        <div className={`absolute left-0 top-5 bottom-5 w-1 rounded-r-full shadow-sm ${task.priority === 'critical' ? 'bg-red-500' : task.priority === 'high' ? 'bg-orange-500' : task.priority === 'medium' ? 'bg-indigo-500' : 'bg-slate-300'}`}></div>

                                        {/* Task Details */}
                                        <div className="flex items-start gap-4 pl-2 w-full min-w-0">
                                            <div className="relative">
                                                <div className={`mt-0.5 w-10 md:w-11 h-10 md:h-11 flex items-center justify-center rounded-xl shrink-0 border-2 ${task.priority === 'critical' ? 'bg-rose-50/50 text-rose-600 border-rose-100/50' : 'bg-slate-50/50 text-slate-500 border-slate-100/50 dark:bg-slate-800/50 dark:border-slate-700/50'}`}>
                                                    <AppIcon name={task.priority === 'critical' ? "AlertTriangle" : (hasChildren ? (isExpanded ? "Layout" : "LayoutList") : "FileText")} size={18} />
                                                </div>

                                                {hasChildren && (
                                                    <button
                                                        onClick={() => setIsExpanded(!isExpanded)}
                                                        className={`absolute right-2 -bottom-8 w-6 h-6 rounded-full flex items-center justify-center border shadow-sm transition-all duration-300 ${isExpanded ? 'bg-indigo-600 border-indigo-500 text-white rotate-180' : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-500 hover:text-indigo-600'}`}
                                                    >
                                                        <AppIcon name="ChevronDown" size={12} />
                                                    </button>
                                                )}
                                            </div>

                                            <div className="space-y-1.5 min-w-0 flex-1 pr-16 md:pr-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-[14px] leading-tight truncate cursor-pointer hover:text-indigo-600 transition-colors" onClick={() => hasChildren && setIsExpanded(!isExpanded)}>
                                                        {task.title}
                                                    </h3>
                                                    {task.priority === 'critical' && (
                                                        <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-100 leading-none">
                                                            Priority
                                                        </span>
                                                    )}
                                                    {hasChildren && (
                                                        <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border leading-none transition-colors ${isExpanded ? 'bg-indigo-600 text-white border-indigo-500' : 'bg-indigo-50 text-indigo-600 border-indigo-100'}`}>
                                                            {task.subtasks.length} Subtasks
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 font-medium">{task.description}</p>

                                                <div className="flex items-center gap-2 pt-1 flex-wrap">
                                                    {task.autoAssign && (
                                                        <div className="flex items-center gap-1 text-[9px] font-bold text-indigo-600 bg-indigo-50/50 px-1.5 py-0.5 rounded-md border border-indigo-100/50">
                                                            <AppIcon name="Zap" size={10} />
                                                            <span className="uppercase">Auto</span>
                                                        </div>
                                                    )}

                                                    {(task.category || task.category === 0) && (
                                                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100/50 dark:border-slate-800/50 text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">
                                                            <AppIcon name="Tag" size={10} />
                                                            <span>{categories.find(c => c.id === task.category)?.name || "General"}</span>
                                                        </div>
                                                    )}

                                                    {task.formId && (
                                                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100/50 dark:border-emerald-800/30 text-[9px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-tight">
                                                            <AppIcon name="Link" size={10} />
                                                            <span>{formBuilders.find(f => String(f.Id) === String(task.formId))?.Name || 'Linked'}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Assignee */}
                                        <div className="flex items-center gap-3 pl-2 md:pl-0 w-full md:w-auto">
                                            <div className="relative group/avatar">
                                                {teamUsers.find(u => u.name === task.assignee)?.avatar ? (
                                                    <img
                                                        src={teamUsers.find(u => u.name === task.assignee).avatar}
                                                        alt={task.assignee}
                                                        className="w-8 md:w-9 h-8 md:h-9 rounded-full object-cover ring-2 ring-white dark:ring-slate-700 shadow-sm"
                                                    />
                                                ) : (
                                                    <div className="w-8 md:w-9 h-8 md:h-9 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-bold text-slate-500 dark:text-slate-400">
                                                        {task.assignee ? task.assignee.charAt(0) : 'U'}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[13px] font-bold text-slate-700 dark:text-slate-200 truncate leading-snug">
                                                    {task.assignee || 'Unassigned'}
                                                </p>
                                                <span className="text-[9px] text-slate-400 uppercase tracking-widest font-black">
                                                    {task.assigneeType || 'User'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Schedule */}
                                        <div className="hidden md:flex md:flex-col gap-1">
                                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300 font-medium">
                                                <AppIcon name="Calendar" size={14} className="text-slate-400" />
                                                <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No Date'}</span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="absolute right-4 top-4 md:relative md:top-0 md:right-0 flex items-center justify-end gap-1">
                                            <button
                                                onClick={() => handleEditClick(task)}
                                                disabled={isLocked}
                                                className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                                            >
                                                <AppIcon name="Edit3" size={16} />
                                            </button>
                                            <button
                                                onClick={() => onDeleteTask(task.id)}
                                                disabled={isLocked}
                                                className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-800 transition-all"
                                            >
                                                <AppIcon name="Trash2" size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Recursive Children Rendering */}
                                    {hasChildren && (
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                                    className="relative space-y-2 mt-1 overflow-hidden"
                                                >
                                                    {/* Vertical Hanging Line */}
                                                    <div
                                                        className={`absolute left-[32px] md:left-[32px] top-[-8px] bottom-[32px] w-[1.5px] ${task.priority === 'critical' ? 'bg-red-500' : task.priority === 'high' ? 'bg-orange-500' : task.priority === 'medium' ? 'bg-indigo-500' : 'bg-slate-300'}`}
                                                    />
                                                    <div className="space-y-2">
                                                        {task.subtasks.map(subtask => (
                                                            <TaskItem key={subtask.id} task={subtask} depth={depth + 1} />
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    )}
                                </div>
                            );
                        };

                        return rootTasks.map(task => (
                            <TaskItem key={task.id} task={task} />
                        ));

                    })()
                )}
            </div>
        </div>
    );
};


export default ConfigTaskList;
