import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useRole from '../../Hooks/useRole';
import { GetClientPortalWFDetailsForLoggedInUserService, UpdateClientPortalWFBatchService } from '../Forms/FormDataService';
import { ClientPortalWorkflowStatus } from '../../Data/StaticData';
import TaskCard from './TaskCard';
import AppIcon from '../../Component/AppIcon';
import { Card, CardContent, CardHeader, CardTitle } from '../../Library/Card';
import Button from '../../Library/Button';
import { Filter } from 'lucide-react';
import TaskToolbar from './TaskToolbar';
import StatsGrid from './StatsGrid';
import TaskModal from './TaskModal';
const WorkQueue = () => {

    const navigate = useNavigate();
    const { isSuperAdmin, isPayrollUser, isPayrollAdmin, currentRole } = useRole();

    const canManageAssignments = (isSuperAdmin || isPayrollAdmin) || ['PayrollAdmin', 'PayrollILTechnicalLead', "PayrollOps"].includes(currentRole);
    const canClaimTasks = isPayrollUser || isSuperAdmin;

    const [rawBatches, setRawBatches] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filter states
    const [selectedView, setSelectedView] = useState('grid'); // 'grid' or 'list'
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({
        priority: '',
        status: '',
        assignee: '',
        moduleId: 1
    });

    // Modal states
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [selectedTaskForAssign, setSelectedTaskForAssign] = useState(null);
    const [userSearchTerm, setUserSearchTerm] = useState('');

    const fetchTasks = useCallback(async () => {
        setIsLoading(true);
        try {
            // Hardcoded Template details as per request context
            const GetApi = "/api/ClientPortalWorkflow/GetClientPortalWFDetailsForLoggedInUser?ModuleId=${ModuleId}&Status=${Status}";
            const payload = {
                ModuleId: filters.moduleId || 1, // Default to Onboarding (1) if no filter
                Status: 1000 // Use filter status or default to Pending (1000)
            };

            const res = await GetClientPortalWFDetailsForLoggedInUserService(GetApi, payload);
            // console.log("Task Asg Res", res);
            const batchesList = Array.isArray(res) ? res : (res ? [res] : []);
            setRawBatches(batchesList);

        } catch (error) {
            console.error("Failed to fetch task assignments", error);
        } finally {
            setIsLoading(false);
        }
    }, [filters.moduleId, filters.status]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // Map Batches to Card Format (Displaying Batches as Tasks)
    const tasks = useMemo(() => {
        return rawBatches.map(batch => {
            console.log(batch);

            // Determine Status Label
            const statusObj = ClientPortalWorkflowStatus.find(s => s.value === batch.BatchStatus);
            // Default mapping if label not found or standard overrides
            let statusLabel = statusObj?.label || 'Unknown';
            if (batch.BatchStatus === 1000) statusLabel = 'Pending Approval';
            if (batch.BatchStatus === 1500) statusLabel = 'In Progress';
            if (batch.BatchStatus === 2000) statusLabel = 'Completed';

            // Check if assigned to current user
            const currentUserId = localStorage.getItem("userId") || '1'; // Default to '1' for demo if not set
            const isAssignedToMe = String(batch?.CreatedBy) === String(226);

            // Determine Priority (Mock logic or based on request count?)
            const priority = batch.RequestCount > 5 ? "Critical" : batch.RequestCount > 2 ? "High" : "Medium";

            // Due Date logic (Mock: CreatedOn + 5 days)
            const createdDate = new Date(batch.CreatedOn);
            createdDate.setDate(createdDate.getDate() + 5);
            const dueDate = createdDate.toLocaleDateString();

            return {
                id: String(batch.Id),
                title: batch.BatchName || "Untitled Batch",
                formName: batch.FormBuilderName,
                description: `Requests: ${batch.RequestCount} | Created by: ${batch.CreatedBy || 'System'}`,
                priority: priority,
                status: statusLabel,
                estimate: `${Math.max(batch.RequestCount * 2, 1)}h`, // Mock estimate based on count
                dueDate: dueDate,
                overdueDays: 0,
                tags: ["Batch", "Workflow"],
                progress: batch.Progress || (statusLabel === "Pending Approval" ? 0 : statusLabel === "Completed" ? 100 : statusLabel === "In Progress" ? 45 : 10),
                assignees: batch.PendingAtUserId ? [`https://i.pravatar.cc/150?u=${batch.PendingAtUserId}`] : [],
                attachments: batch.RequestCount, // Show request count as attachment count metaphor or 0
                comments: 0,
                isAssignedToMe: isAssignedToMe,
                // Pass original batch object for drill-down/claim logic if needed
                originalBatch: batch
            };
        });
    }, [rawBatches]);

    // Apply Client-Side Filters
    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            // Search filter
            const searchLower = search.toLowerCase();
            const matchesSearch = !search ||
                task.title.toLowerCase().includes(searchLower) ||
                task.description.toLowerCase().includes(searchLower) ||
                task.id.toLowerCase().includes(searchLower);

            // Priority filter
            const matchesPriority = !filters.priority || task.priority === filters.priority;

            // Status filter
            const matchesStatus = !filters.status || task.status === filters.status;

            // Assignee filter
            const matchesAssignee = !filters.assignee ||
                (filters.assignee === 'assigned' && task.assignees.length > 0) ||
                (filters.assignee === 'unassigned' && task.assignees.length === 0);

            // ModuleId filter
            const matchesModule = !filters.moduleId || String(task.originalBatch?.ModuleId) === String(filters.moduleId);

            return matchesSearch && matchesPriority && matchesStatus && matchesAssignee && matchesModule;
        });
    }, [tasks, search, filters]);

    // console.log(filteredTasks);

    // Stats Calculation
    const calculatedStats = useMemo(() => {
        const total = tasks.length;
        const pending = tasks.filter(t => t.status === 'Pending Approval').length;
        const inProgress = tasks.filter(t => t.status === 'In Progress').length;
        const completed = tasks.filter(t => t.status === 'Completed').length;
        const unassigned = tasks.filter(t => t.assignees.length === 0).length;

        return [
            { title: 'Total Tasks', value: total, icon: 'List', bg: 'bg-indigo-50', color: 'text-indigo-600', trend: '+12%', trendUp: true },
            { title: 'Pending', value: pending, icon: 'Clock', bg: 'bg-amber-50', color: 'text-amber-600', trend: '-5%', trendUp: false },
            { title: 'In Progress', value: inProgress, icon: 'Hourglass', bg: 'bg-blue-50', color: 'text-blue-600', trend: '+8%', trendUp: true },
            { title: 'Completed', value: completed, icon: 'CheckCircle', bg: 'bg-emerald-50', color: 'text-emerald-600', trend: '+8%', trendUp: true },
            { title: 'Unassigned', value: unassigned, icon: 'UserX', bg: 'bg-rose-50', color: 'text-rose-600', trend: '+2%', trendUp: true }
        ];
    }, [tasks]);


    const handleClaim = async (taskId) => {
        const batch = rawBatches.find(b => String(b.Id) === taskId);
        if (batch) {
            if (!window.confirm(`Are you sure you want to claim batch: ${batch.BatchName}?`)) return;

            try {
                const currentUserId = localStorage.getItem("userId") || '1'; // Default '1'
                const payload = {
                    Id: batch.Id,
                    Status: 1500, // In Progress
                    Progress: 10,
                    PendingAtUserId: currentUserId
                };

                await UpdateClientPortalWFBatchService(payload);
                fetchTasks();
            } catch (error) {
                console.error("Claim failed", error);
            }
        }
    };

    const handleStatusChange = async (taskId, newStatusLabel) => {
        // Determine status code based on label or intent
        let statusCode = 1500;
        let progress = 50;

        if (newStatusLabel === 'Completed') {
            statusCode = 2000;
            progress = 100;
        } else if (newStatusLabel === 'In Progress') {
            statusCode = 1500;
            progress = 25;
        }

        try {
            const batch = rawBatches.find(b => String(b.Id) === taskId);
            const payload = {
                Id: taskId,
                Status: statusCode,
                Progress: progress,
                PendingAtUserId: batch?.PendingAtUserId // Keep assignment
            };
            await UpdateClientPortalWFBatchService(payload);
            fetchTasks();
        } catch (error) {
            console.error("Status update failed", error);
        }
    };

    const handleAssign = (taskId) => {
        setSelectedTaskForAssign(taskId);
        setShowAssignModal(true);
    };

    // Dummy users for modal (keep existing mock)
    const users = [
        { id: 1, name: 'John Doe', avatar: 'https://i.pravatar.cc/150?u=john' },
        { id: 2, name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?u=jane' },
        { id: 3, name: 'Bob Johnson', avatar: 'https://i.pravatar.cc/150?u=bob' },
    ];

    const assignTaskToUser = async (userId) => {
        // alert(`Task ${selectedTaskForAssign} assigned to user ${userId}`);
        try {
            const payload = {
                Id: selectedTaskForAssign,
                Status: 1500, // Move to 'In Progress' upon assignment
                PendingAtUserId: userId,
                Progress: 5 // Initial assigned progress
            };
            await UpdateClientPortalWFBatchService(payload);
            setShowAssignModal(false);
            fetchTasks(); // Refresh list
        } catch (error) {
            console.error("Assign failed", error);
        }
    };

    return (
        <>
            <div className="space-y-6 flex flex-col animate-in fade-in duration-300 min-h-full pb-8">
                {/* Stats Overview */}
                <StatsGrid stats={calculatedStats} />

                {/* Main Content Area */}
                <div className={`flex-1 flex flex-col rounded-2xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden ${isLoading ? 'min-h-[400px]' : ''}`}>

                    {/* Reusable Toolbar */}
                    <TaskToolbar
                        search={search}
                        setSearch={setSearch}
                        selectedView={selectedView}
                        setSelectedView={setSelectedView}
                        filters={filters}
                        setFilters={setFilters}
                    />

                    {/* Task Area */}
                    <div className="p-5 flex-1 bg-slate-50/50 dark:bg-slate-900/20">
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-24">
                                <div className="relative flex justify-center items-center w-20 h-20 mb-6">
                                    <div className="absolute inset-0 border-4 border-indigo-100 dark:border-indigo-900/30 rounded-full"></div>
                                    <div className="absolute inset-0 border-4 border-indigo-600 dark:border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
                                    <div className="absolute inset-0 bg-indigo-50 dark:bg-indigo-500/10 rounded-full animate-ping opacity-30"></div>
                                    <AppIcon name="Inbox" size={24} className="text-indigo-600 dark:text-indigo-400 absolute" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Syncing your queue...</h3>
                                <p className="text-slate-500 font-medium text-[15px]">Bringing in the latest batches and assignments.</p>
                            </div>
                        ) : filteredTasks.length > 0 ? (
                            <div className={selectedView === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                                {filteredTasks.map(task => (
                                    <TaskCard
                                        key={task.id}
                                        task={task}
                                        personalView={task.isAssignedToMe} // Pass ownership
                                        canClaim={canClaimTasks}
                                        canAssign={canManageAssignments}
                                        onClaim={() => handleClaim(task.id)}
                                        onAssign={() => handleAssign(task.id)}
                                        onWork={(id) => handleStatusChange(id, 'In Progress')} // "Start" / "Continue"
                                        onStatusChange={(id, status) => handleStatusChange(id, status)} // "Finalize" -> Completed
                                        onRelease={(id) => handleAssign(id)} // Re-assign
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 h-full text-center px-4">
                                <div className="w-24 h-24 bg-white dark:bg-slate-800 shadow-md rounded-full flex items-center justify-center mb-6 border border-slate-100 dark:border-slate-700 ring-8 ring-slate-100/50 dark:ring-slate-800/50">
                                    <AppIcon name="CheckCircle2" size={48} className="text-emerald-500" strokeWidth={1.5} />
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-3">You're all caught up!</h3>
                                <p className="text-slate-500 dark:text-slate-400 max-w-md text-[15px] leading-relaxed mb-8">
                                    We couldn't find any batches matching your current filters. Great job keeping the queue clear!
                                </p>
                                <Button
                                    className="bg-indigo-600 hover:bg-slate-800 text-white dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-xl shadow-md h-12 px-8 font-bold text-[15px] transition-all"
                                    onClick={() => { setSearch(''); setFilters({ priority: '', status: '', assignee: '', moduleId: '1' }); }}
                                    icon={<Filter size={18} className="mr-2 opacity-70" />}
                                >
                                    Reset Filters
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Assignment Guidelines */}
                <Card className="mt-6 border-slate-200 dark:border-slate-700/80 shadow-sm rounded-2xl bg-gradient-to-br from-indigo-50/50 via-white to-slate-50 dark:from-slate-800/80 dark:to-slate-900 overflow-hidden relative group">
                    {/* Decorative mesh */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors duration-500 pointer-events-none"></div>

                    <CardHeader className="pb-3 border-b border-indigo-100 dark:border-indigo-900/30 flex flex-row items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                            <AppIcon name="Info" size={16} strokeWidth={2.5} />
                        </div>
                        <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100 m-0 leading-none tracking-tight">Assignment Guidelines</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 relative z-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-4 rounded-xl border border-white dark:border-slate-700 shadow-sm flex gap-4 transition-all hover:shadow-md hover:border-emerald-100 dark:hover:border-emerald-900/50">
                                <div className="w-10 h-10 shrink-0 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mt-1">
                                    <AppIcon name="User" size={18} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-800 dark:text-white mb-2 text-[14px] uppercase tracking-wider">Self-Assignment <span className="text-slate-400 font-medium lowercase tracking-normal text-xs">(Any User)</span></h3>
                                    <ul className="text-[13px] text-slate-600 dark:text-slate-400 space-y-2 font-medium">
                                        <li className="flex gap-2 items-start"><AppIcon name="Check" size={14} className="text-emerald-500 shrink-0 mt-0.5" /> <span>Click <strong className="text-emerald-700 dark:text-emerald-400">Claim</strong> to assign task to yourself</span></li>
                                        <li className="flex gap-2 items-start"><AppIcon name="Check" size={14} className="text-emerald-500 shrink-0 mt-0.5" /> <span>Task moves to your personal queue</span></li>
                                        <li className="flex gap-2 items-start"><AppIcon name="Check" size={14} className="text-emerald-500 shrink-0 mt-0.5" /> <span>You become responsible for completion</span></li>
                                        <li className="flex gap-2 items-start"><AppIcon name="Check" size={14} className="text-emerald-500 shrink-0 mt-0.5" /> <span>Can be reassigned later if needed</span></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-4 rounded-xl border border-white dark:border-slate-700 shadow-sm flex gap-4 transition-all hover:shadow-md hover:border-indigo-100 dark:hover:border-indigo-900/50">
                                <div className="w-10 h-10 shrink-0 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mt-1">
                                    <AppIcon name="Users" size={18} strokeWidth={2.5} />
                                </div>
                                <div>
                                    <h3 className="font-black text-slate-800 dark:text-white mb-2 text-[14px] uppercase tracking-wider">Manager Assignment <span className="text-slate-400 font-medium lowercase tracking-normal text-xs">(Higher Users)</span></h3>
                                    <ul className="text-[13px] text-slate-600 dark:text-slate-400 space-y-2 font-medium">
                                        <li className="flex gap-2 items-start"><AppIcon name="ChevronRight" size={14} className="text-indigo-500 shrink-0 mt-0.5" /> <span>Click <strong className="text-indigo-700 dark:text-indigo-400">Assign</strong> to delegate to members</span></li>
                                        <li className="flex gap-2 items-start"><AppIcon name="ChevronRight" size={14} className="text-indigo-500 shrink-0 mt-0.5" /> <span>Consider workload and skill requirements</span></li>
                                        <li className="flex gap-2 items-start"><AppIcon name="ChevronRight" size={14} className="text-indigo-500 shrink-0 mt-0.5" /> <span>Balance team capacity and deadlines</span></li>
                                        <li className="flex gap-2 items-start"><AppIcon name="ChevronRight" size={14} className="text-indigo-500 shrink-0 mt-0.5" /> <span>Monitor assignment effectiveness</span></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>


            <TaskModal
                isOpen={showAssignModal}
                onClose={() => setShowAssignModal(false)}
                tasks={tasks}
                selectedTaskForAssign={selectedTaskForAssign}
                users={users}
                userSearchTerm={userSearchTerm}
                setUserSearchTerm={setUserSearchTerm}
                assignTaskToUser={assignTaskToUser}
            />
        </>
    );
}

export default WorkQueue