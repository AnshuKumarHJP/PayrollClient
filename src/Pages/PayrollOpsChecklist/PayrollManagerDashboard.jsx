import { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCategories } from "./PayrollChecklistService";
import { getPayrollOpsTasks, updatePayrollOpsTask } from "./PayrollChecklistService";
import ManagerStatsGrid from "./components/ManagerDashboard/ManagerStatsGrid";
import ManagerTeamView from "./components/ManagerDashboard/ManagerTeamView";
import ManagerOverviewView from "./components/ManagerDashboard/ManagerOverviewView";

import ChecklistTasks from "./components/ChecklistTasks";
import ManagerInsightBanner from "./components/ManagerDashboard/ManagerInsightBanner";
import EmployeeChecklist from "./components/EmployeeDashboard/EmployeeChecklist";
import AppIcon from "../../Component/AppIcon";
import { motion, AnimatePresence } from "framer-motion";
import useRole from "../../Hooks/useRole";

const PayrollManagerDashboard = () => {
    const AUTH_DATA = useSelector((state) => state.Auth.LogResponce.data);
    const CURRENT_USER = AUTH_DATA?.UserSession?.PersonName || "Payroll Ops";

    const { isApprover, isUser } = useRole();
    const [selectedTeamMember, setSelectedTeamMember] = useState("all");
    const [viewMode, setViewMode] = useState(isApprover ? "overview" : "my-tasks"); // 'overview', 'my-tasks', 'team', 'tasks'
    const [loading, setLoading] = useState(true); // Start true
    const [isActionOpen, setIsActionOpen] = useState(false);

    // Filter/Sort State for Manager View
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("dueDate");
    const [sortOrder, setSortOrder] = useState("asc");
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [showSortMenu, setShowSortMenu] = useState(false);

    // Simulate initial data load
    useEffect(() => {
        const timer = setTimeout(() => setLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    const { SelectedMonth, SelectedRole } = useSelector((state) => state.Auth.Common);
    const [tasks, setTasks] = useState([]);
    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const data = await getPayrollOpsTasks();
                setTasks(data);
            } catch (error) {
                console.error("Failed to fetch tasks", error);
            }
        };
        fetchTasks();
    }, []);



    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCats = async () => {
            try {
                const data = await getCategories();
                // Map API {id, name} to {value, label} for compatibility
                const formatted = data.map(c => ({ ...c, value: c.id, label: c.name }));
                setCategories(formatted.filter(m => m.label !== "None"));
            } catch (err) {
                console.error("Failed to fetch categories", err);
            }
        };
        fetchCats();
    }, []);

    // Derived state for month/year from Global Redux State
    const selectedPayrollMonth = useMemo(() => {
        if (!SelectedMonth) {
            const now = new Date();
            return {
                month: now.getMonth() + 1,
                year: now.getFullYear(),
                monthLabel: now.toLocaleString('default', { month: 'long' })
            };
        }

        // Handle Object from MonthYearSelector (which returns year, month, etc.)
        if (typeof SelectedMonth === 'object' && SelectedMonth.year && SelectedMonth.month) {
            const date = new Date(SelectedMonth.year, SelectedMonth.month - 1);
            return {
                month: SelectedMonth.month,
                year: SelectedMonth.year,
                monthLabel: date.toLocaleString('default', { month: 'long' })
            };
        }

        // Handle standard Date string or Date object
        const date = new Date(SelectedMonth);
        // Validate date
        if (isNaN(date.getTime())) {
            const now = new Date();
            return {
                month: now.getMonth() + 1,
                year: now.getFullYear(),
                monthLabel: now.toLocaleString('default', { month: 'long' })
            };
        }

        return {
            month: date.getMonth() + 1,
            year: date.getFullYear(),
            monthLabel: date.toLocaleString('default', { month: 'long' })
        };
    }, [SelectedMonth]);

    const handleRefresh = () => {
        setLoading(true);
        setTimeout(() => setLoading(false), 800);
    };

    const handleExport = () => {
        console.log("Exporting payroll report...");
    };

    const toggleTaskStatus = async (id) => {
        try {
            const task = tasks.find(t => t.id === id);
            if (!task) return;
            const newStatus = task.status === 'completed' ? 'pending' : 'completed';
            await updatePayrollOpsTask(id, { ...task, status: newStatus });
            // Refresh tasks
            const data = await getPayrollOpsTasks();
            setTasks(data);
        } catch (error) {
            console.error("Failed to toggle task status", error);
        }
    };

    // --- Data Processing for Team View ---
    const monthTasks = useMemo(() => {
        return tasks.filter(t => {
            const taskDate = new Date(t.dueDate);
            return taskDate.getMonth() + 1 === selectedPayrollMonth.month &&
                taskDate.getFullYear() === selectedPayrollMonth.year;
        });
    }, [tasks, selectedPayrollMonth]);

    const teamMembers = useMemo(() => {
        const members = {};
        monthTasks.forEach(task => { // Use monthTasks, not all tasks
            if (!members[task.assignee]) {
                members[task.assignee] = {
                    name: task.assignee,
                    tasks: [],
                    completed: 0,
                    pending: 0,
                    critical: 0,
                    overdue: 0,
                    role: task.assigneeType === 'role' ? task.assignee : 'Team User'
                };
            }
            members[task.assignee].tasks.push(task);
            if (task.status === 'completed') members[task.assignee].completed++;
            else members[task.assignee].pending++;
            if (task.priority === 'critical' && task.status !== 'completed') members[task.assignee].critical++;

            const dueDate = new Date(task.dueDate);
            if (dueDate < new Date() && task.status !== 'completed') {
                members[task.assignee].overdue++;
            }
        });
        return Object.values(members);
    }, [monthTasks]);

    // Client-wise Progress (Using real data from tasks)
    const clientStats = useMemo(() => {
        const stats = {};

        monthTasks.forEach((task) => {
            const clientName = task.client || "Other/Global";
            if (!stats[clientName]) {
                stats[clientName] = { label: clientName, total: 0, completed: 0, critical: 0 };
            }
            stats[clientName].total++;
            if (task.status === 'completed') stats[clientName].completed++;
            if (task.priority === 'critical' && task.status !== 'completed') stats[clientName].critical++;
        });

        return Object.values(stats);
    }, [monthTasks]);

    // Team-wise Progress (Grouped by Role)
    const teamWiseStats = useMemo(() => {
        const teams = {};
        teamMembers.forEach(member => {
            const teamName = member.role || "Operations Team";
            if (!teams[teamName]) {
                teams[teamName] = { label: teamName, total: 0, completed: 0, members: 0 };
            }
            teams[teamName].total += member.tasks.length;
            teams[teamName].completed += member.completed;
            teams[teamName].members++;
        });
        return Object.values(teams);
    }, [teamMembers]);

    const categoryStats = useMemo(() => {
        return categories.map(cat => {
            const categoryTasks = monthTasks.filter(t => t.category === cat.value);
            return {
                ...cat,
                total: categoryTasks.length,
                completed: categoryTasks.filter(t => t.status === 'completed').length,
                pending: categoryTasks.filter(t => t.status !== 'completed').length,
                critical: categoryTasks.filter(t => t.priority === 'critical' && t.status !== 'completed').length
            };
        });
    }, [monthTasks, categories]);

    const overallStats = useMemo(() => {
        const targetTasks = monthTasks;

        const completed = targetTasks.filter(t => t.status === 'completed').length;
        const pending = targetTasks.length - completed;
        const critical = targetTasks.filter(t => t.priority === 'critical' && t.status !== 'completed').length;
        const overdue = targetTasks.filter(t => {
            const dueDate = new Date(t.dueDate);
            return dueDate < new Date() && t.status !== 'completed';
        }).length;

        // Checklist completion: How many CATEGORIES are 100% done
        const checklistsTotal = categoryStats.length;
        const checklistsCompleted = categoryStats.filter(c => c.total > 0 && c.completed === c.total).length;

        return {
            total: targetTasks.length,
            completed,
            pending,
            critical,
            overdue,
            taskProgress: targetTasks.length > 0 ? Math.round((completed / targetTasks.length) * 100) : 0,
            checklistProgress: checklistsTotal > 0 ? Math.round((checklistsCompleted / checklistsTotal) * 100) : 0,
            progress: targetTasks.length > 0 ? Math.round((completed / targetTasks.length) * 100) : 0 // Backwards compatibility
        };
    }, [monthTasks, categoryStats]);

    const filteredTeamTasks = useMemo(() => {
        let result = monthTasks;

        // 1. Team Member Filter
        if (selectedTeamMember !== "all") {
            result = result.filter(t => t.assignee === selectedTeamMember);
        }

        // 2. Status Filter
        if (statusFilter === 'pending') result = result.filter(t => t.status !== 'completed');
        else if (statusFilter === 'completed') result = result.filter(t => t.status === 'completed');
        else if (statusFilter === 'critical') result = result.filter(t => t.priority === 'critical');

        // 3. Sort
        return [...result].sort((a, b) => {
            let comparison = 0;
            if (sortBy === 'dueDate') {
                comparison = new Date(a.dueDate) - new Date(b.dueDate);
            } else if (sortBy === 'priority') {
                const priorityMap = { critical: 3, high: 2, medium: 1, low: 0 };
                comparison = priorityMap[b.priority] || 0 - priorityMap[a.priority] || 0;
            } else if (sortBy === 'title') {
                comparison = a.title.localeCompare(b.title);
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });
    }, [monthTasks, selectedTeamMember, statusFilter, sortBy, sortOrder]);

    return (
        <div className="min-h-screen space-y-4 relative pb-10">

            {/* --- TOP BAR: Title & Actions --- */}
            <div className={`${isApprover ? '' : 'hidden'} flex flex-col xl:flex-row xl:items-center justify-between gap-6 mb-8`}>
                <div>
                    <h1 className="text-sm md:text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50 flex items-center gap-3">
                        Dashboard
                        <span className="inline-flex items-center gap-1.5 px-3 py-0 rounded-full text-[10px] font-extrabold tracking-wider uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <span className="relative flex h-1 w-1">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-1 w-1 bg-emerald-500"></span>
                            </span>
                            Live
                        </span>
                    </h1>
                    <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium mt-2">
                        Welcome back, <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{CURRENT_USER}</span>
                    </p>
                </div>

                {/* Right Side: Quick Stats Summary */}
                <div className="hidden lg:flex items-center gap-8 bg-white dark:bg-slate-800/50 px-5 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    {/* Task Progress */}
                    <div className="flex items-center gap-3">
                        <div className="relative size-10 flex items-center justify-center">
                            <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                                <path className="text-slate-100 dark:text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                                <path className="text-indigo-600 dark:text-indigo-400 transition-all duration-1000 ease-out" strokeDasharray={`${overallStats.taskProgress}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                            </svg>
                            <span className="absolute text-[10px] font-bold text-slate-700 dark:text-slate-200">{overallStats.taskProgress}%</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Task Completion</span>
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">Overall Tasks</span>
                        </div>
                    </div>

                    <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>

                    {/* Checklist Progress */}
                    <div className="flex items-center gap-3">
                        <div className="relative size-10 flex items-center justify-center">
                            <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                                <path className="text-slate-100 dark:text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                                <path className="text-emerald-500 transition-all duration-1000 ease-out" strokeDasharray={`${overallStats.checklistProgress}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                            </svg>
                            <span className="absolute text-[10px] font-bold text-slate-700 dark:text-slate-200">{overallStats.checklistProgress}%</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Checklist Completion</span>
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-100">Functional Ready</span>
                        </div>
                    </div>

                    <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>

                    {/* Pending Count */}
                    <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Pending</span>
                        <div className="flex items-center gap-1.5">
                            <span className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-none">{overallStats.pending}</span>
                            <span className="text-xs text-slate-400 font-medium">Tasks</span>
                        </div>
                    </div>

                    {/* Critical/Overdue (Conditional) */}
                    {(overallStats.critical > 0 || overallStats.overdue > 0) && (
                        <>
                            <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>
                            <div className="flex flex-col">
                                <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider">Attention</span>
                                <div className="flex items-center gap-1.5">
                                    <AppIcon name="AlertCircle" size={14} className="text-red-500" />
                                    <span className="text-lg font-bold text-red-600 leading-none">{overallStats.critical + overallStats.overdue}</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>


            </div>

            {/* --- PRIMARY NAVIGATION --- */}
            <div className="sticky top-0 z-30 mb-8 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-2 w-full transition-all">
                <div className="flex items-center gap-1 w-full md:w-auto overflow-x-auto no-scrollbar pb-1 md:pb-0">
                    {[
                        { id: 'overview', label: 'Overview', icon: 'BarChart3' },
                        { id: 'my-tasks', label: 'My Tasks', icon: 'CheckSquare' },
                        { id: 'team', label: 'Team Status', icon: 'Users' },
                        { id: 'tasks', label: 'All Tasks', icon: 'ListChecks' }
                    ].filter(mode => isApprover ? true : mode.id === 'my-tasks').map((mode) => (
                        <button
                            key={mode.id}
                            onClick={() => setViewMode(mode.id)}
                            className={`
                                relative px-4 md:px-5 py-2 md:py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 whitespace-nowrap
                                ${viewMode === mode.id
                                    ? "text-indigo-600 dark:text-indigo-400"
                                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                                }
                            `}
                        >
                            {viewMode === mode.id && (
                                <motion.div
                                    layoutId="view-mode-pill"
                                    className="absolute inset-0 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl -z-10"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <AppIcon name={mode.icon} size={16} className={viewMode === mode.id ? "text-indigo-600" : ""} />
                            {mode.label}
                        </button>
                    ))}
                </div>

                {/* RIGHT: Actions */}
                <div className="flex items-center gap-2 w-full md:w-auto justify-end md:ml-auto md:pl-4 md:border-l border-t md:border-t-0 border-slate-200 dark:border-slate-700 pt-2 md:pt-0">
                    <button
                        onClick={handleRefresh}
                        className="p-2 md:p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-all shadow-sm active:scale-95 bg-white dark:bg-slate-700/50"
                        title="Refresh Data"
                    >
                        <AppIcon name="RefreshCw" size={18} className={loading ? "animate-spin" : ""} />
                    </button>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 text-sm font-semibold transition-all shadow-sm active:scale-95 bg-white dark:bg-slate-700/50 whitespace-nowrap"
                    >
                        <AppIcon name="Download" size={18} />
                        <span className="hidden sm:inline">Export Report</span>
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => setIsActionOpen(!isActionOpen)}
                            className={`flex items-center gap-2 px-4 md:px-5 py-2 md:py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md shadow-indigo-200 dark:shadow-indigo-900/20 active:scale-95 transition-all text-sm font-semibold whitespace-nowrap`}
                        >
                            <span className="hidden xs:inline">Quick Actions</span>
                            <span className="xs:hidden">Actions</span>
                            <AppIcon name="ChevronDown" size={16} className={`transition-transform duration-300 ${isActionOpen ? 'rotate-180' : ''}`} />
                        </button>
                        <AnimatePresence>
                            {isActionOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden z-50 p-1.5 origin-top-right"
                                >
                                    {[
                                        { label: 'Remind All Pending', icon: 'Bell', color: 'text-amber-500' },
                                        { label: 'Bulk Approve Tasks', icon: 'CheckCircle', color: 'text-emerald-500' }
                                    ].map((action, idx) => (
                                        <button key={idx} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-lg text-left transition-colors group">
                                            <AppIcon name={action.icon} size={16} className={`${action.color} group-hover:scale-110 transition-transform`} />
                                            {action.label}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* --- Insight Banner (Only for Manager Views) --- */}
            {viewMode !== 'my-tasks' && (overallStats.critical > 0 || overallStats.overdue > 0) ? (
                <ManagerInsightBanner
                    pendingCritical={overallStats.critical}
                    pendingOverdue={overallStats.overdue}
                    onViewCritical={() => setViewMode('tasks')}
                />
            ) : null}

            {/* --- Main Content Area --- */}
            <div className="mt-6">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={viewMode}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-8"
                    >
                        {/* 1. VIEW: OVERVIEW */}
                        {viewMode === "overview" && (
                            <>
                                <ManagerStatsGrid stats={overallStats} loading={loading} teamMembers={teamMembers} />
                                {loading ? (
                                    <div className="h-48 w-full bg-slate-100 dark:bg-slate-800 rounded-2xl animate-pulse" />
                                ) : (
                                    <ManagerOverviewView
                                        categoryStats={categoryStats}
                                        teamMembers={teamMembers}
                                        clientStats={clientStats}
                                        teamWiseStats={teamWiseStats}
                                    />
                                )}
                            </>
                        )}

                        {/* 2. VIEW: MY TASKS */}
                        {viewMode === "my-tasks" && (
                            <EmployeeChecklist
                                selectedMonth={selectedPayrollMonth}
                                assignee={CURRENT_USER}
                                loading={loading}
                            />
                        )}

                        {/* 3. VIEW: TEAM STATUS */}
                        {viewMode === "team" && (
                            <>
                                <ManagerStatsGrid stats={overallStats} loading={loading} teamMembers={teamMembers} />
                                <ManagerTeamView
                                    teamMembers={teamMembers}
                                    setSelectedTeamMember={(member) => {
                                        setSelectedTeamMember(member);
                                        setViewMode("tasks");
                                    }}
                                    setViewMode={setViewMode}
                                    loading={loading}
                                />
                            </>
                        )}

                        {/* 4. VIEW: ALL TASKS (Manager View) */}
                        {viewMode === "tasks" && (
                            <ChecklistTasks
                                activeTab="all"
                                filteredTasks={filteredTeamTasks}
                                toggleTaskStatus={toggleTaskStatus}
                                showFilterMenu={showFilterMenu}
                                setShowFilterMenu={setShowFilterMenu}
                                showSortMenu={showSortMenu}
                                setShowSortMenu={setShowSortMenu}
                                statusFilter={statusFilter}
                                setStatusFilter={setStatusFilter}
                                sortBy={sortBy}
                                setSortBy={setSortBy}
                                sortOrder={sortOrder}
                                setSortOrder={setSortOrder}
                                categories={categories}
                                isManagerView={true}
                                selectedTeamMember={selectedTeamMember}
                                setSelectedTeamMember={setSelectedTeamMember}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default PayrollManagerDashboard;
