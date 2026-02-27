import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCategories, getPayrollOpsTasks, updatePayrollOpsTask } from "../../PayrollChecklistService";
import ChecklistStats from "../ChecklistStats";
import ChecklistFilterSidebar from "../ChecklistFilterSidebar";
import ChecklistTasks from "../ChecklistTasks";
import { Skeleton } from "../../../../Skeleton/Skeletons";
import AppIcon from "../../../../Component/AppIcon";

const EmployeeChecklist = ({ selectedMonth, assignee, loading }) => {
    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("dueDate"); // 'dueDate', 'priority', 'title'
    const [sortOrder, setSortOrder] = useState("asc"); // 'asc', 'desc'
    const [statusFilter, setStatusFilter] = useState("all"); // 'all', 'pending', 'completed', 'critical'

    // Toggle states for dropdowns
    const [showSortMenu, setShowSortMenu] = useState(false);
    const [showFilterMenu, setShowFilterMenu] = useState(false);

    const [allTasks, setAllTasks] = useState([]);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const data = await getPayrollOpsTasks();
                setAllTasks(data);
            } catch (err) {
                console.error("Failed to fetch tasks", err);
            }
        };
        fetchTasks();
    }, []);



    // Filter by assignee if provided (for My Tasks view)
    // const tasks = assignee ? allTasks.filter(t => t.assignee === assignee) : allTasks;
    const tasks = allTasks;

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategories();
                const sortedData = data.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
                setCategories(sortedData);
            } catch (error) {
                console.error("Failed to fetch categories:", error);
            }
        };
        fetchCategories();
    }, []);

    // Stats calculations
    const totalTasks = tasks.length;
    const completedCount = tasks.filter(t => t.status === "completed").length;
    const progress = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
    const pendingCount = totalTasks - completedCount;
    const criticalCount = tasks.filter(t => t.priority === 'critical' && t.status !== 'completed').length;

    // Calculate upcoming tasks (due in the next 7 days)
    const upcomingCount = tasks.filter(t => {
        if (t.status === 'completed') return false;
        const dueDate = new Date(t.dueDate);
        const today = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(today.getDate() + 7);
        return dueDate >= today && dueDate <= nextWeek;
    }).length;

    // Base filter for Sidebar Counts (Apply all filters EXCEPT Category)
    const visibleTasksBase = tasks.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.assignee.toLowerCase().includes(searchQuery.toLowerCase());

        let matchesStatus = true;
        if (statusFilter === 'pending') matchesStatus = t.status !== 'completed';
        else if (statusFilter === 'completed') matchesStatus = t.status === 'completed';
        else if (statusFilter === 'critical') matchesStatus = t.priority === 'critical';

        let matchesMonth = true;
        if (selectedMonth) {
            const taskDate = new Date(t.dueDate);
            if (!isNaN(taskDate.getTime())) {
                matchesMonth = taskDate.getMonth() + 1 === selectedMonth.month &&
                    taskDate.getFullYear() === selectedMonth.year;
            } else {
                matchesMonth = false;
            }
        }

        return matchesSearch && matchesStatus && matchesMonth;
    });

    // Final list for display (Apply Category Filter & Sort)
    const filteredTasks = visibleTasksBase
        .filter(t => activeTab === "all" || t.category === activeTab)
        .sort((a, b) => {
            let comparison = 0;
            if (sortBy === 'dueDate') {
                comparison = new Date(a.dueDate) - new Date(b.dueDate);
            } else if (sortBy === 'priority') {
                const priorityMap = { critical: 3, high: 2, medium: 1, low: 0 };
                comparison = priorityMap[b.priority] - priorityMap[a.priority];
            } else if (sortBy === 'title') {
                comparison = a.title.localeCompare(b.title);
            }
            return sortOrder === 'asc' ? comparison : -comparison;
        });

    const toggleTaskStatus = async (id) => {
        try {
            const task = allTasks.find(t => t.id === id);
            if (!task) return;
            const newStatus = task.status === 'completed' ? 'pending' : 'completed';
            await updatePayrollOpsTask(id, { ...task, status: newStatus });
            // Refresh
            const data = await getPayrollOpsTasks();
            setAllTasks(data);
        } catch (err) {
            console.error("Failed to toggle status", err);
        }
    };

    if (loading) {
        return (
            <div className="space-y-6 animate-pulse">
                {/* Header Skeleton */}
                <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                    <Skeleton className="h-10 w-64 rounded-lg" />
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-24 rounded-lg" />
                        <Skeleton className="h-10 w-32 rounded-lg" />
                    </div>
                </div>

                {/* Stats Skeleton */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 h-28 space-y-3">
                            <div className="flex justify-between">
                                <Skeleton className="h-8 w-8 rounded-full" />
                                <Skeleton className="h-4 w-12 rounded-full" />
                            </div>
                            <Skeleton className="h-6 w-1/2" />
                            <Skeleton className="h-3 w-3/4" />
                        </div>
                    ))}
                </div>

                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Sidebar Skeleton */}
                    <div className="w-full lg:w-64 shrink-0">
                        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 space-y-4">
                            <Skeleton className="h-4 w-1/2 mb-4" />
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-4 w-4 rounded" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                    <Skeleton className="h-4 w-6 rounded-full" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Main Content Skeleton */}
                    <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-center">
                            <Skeleton className="h-8 w-48 rounded-lg" />
                            <div className="flex gap-2">
                                <Skeleton className="h-8 w-24 rounded-lg" />
                                <Skeleton className="h-8 w-8 rounded-lg" />
                            </div>
                        </div>
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 h-24 flex flex-col justify-center gap-3">
                                <div className="flex justify-between">
                                    <Skeleton className="h-5 w-2/3 rounded" />
                                    <Skeleton className="h-5 w-20 rounded" />
                                </div>
                                <div className="flex gap-4">
                                    <Skeleton className="h-4 w-24 rounded" />
                                    <Skeleton className="h-4 w-32 rounded" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Premium Header with Search */}
            <div className="relative group overflow-hidden bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/50 shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[50px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl text-white shadow-lg shadow-indigo-200 dark:shadow-none transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                            <AppIcon name="ListChecks" size={24} strokeWidth={2.5} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">My Workflow</h2>
                            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Efficiency starts here</p>
                        </div>
                    </div>

                    <div className="relative w-full sm:w-80 group/search">
                        <AppIcon name="Search" size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/search:text-indigo-500 transition-colors pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Find tasks, IDs, or assignees..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-11 pr-4 py-2.5 text-sm bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-700/50 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all placeholder:text-slate-400 text-slate-700 dark:text-slate-200 font-medium"
                        />
                    </div>
                </div>
            </div>

            <ChecklistStats
                progress={progress}
                pendingCount={pendingCount}
                criticalCount={criticalCount}
                totalTasks={totalTasks}
                upcomingCount={upcomingCount}
                completedCount={completedCount}
            />

            <div className="flex flex-col lg:flex-row gap-4">
                <ChecklistFilterSidebar
                    categories={categories}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    tasks={visibleTasksBase}
                />

                <ChecklistTasks
                    activeTab={activeTab}
                    filteredTasks={filteredTasks}
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
                />
            </div>
        </div>
    );
};

export default EmployeeChecklist;
