import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { GetClientPortalWFDetailsForLoggedInUserService, UpdateClientPortalWFBatchService } from '../Builder/FormDataService';
import { useNavigate } from 'react-router-dom';
import AppIcon from '../../Component/AppIcon';
import StatsGrid from './StatsGrid';
import TaskToolbar from './TaskToolbar';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
import { ClientPortalWorkflowStatus } from '../../Data/StaticData';
import useRole from '../../Hooks/useRole';

const TaskAssignment = () => {
    const navigate = useNavigate();
    const { isSuperAdmin, isPayrollUser, isPayrollAdmin, currentRole } = useRole();

    const canManageAssignments = isSuperAdmin || ['PayrollAdmin', 'PayrollILTechnicalLead'].includes(currentRole);
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
        moduleId: '1'
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
            console.log("Task Asg Res", res);
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
            // Determine Status Label
            const statusObj = ClientPortalWorkflowStatus.find(s => s.value === batch.BatchStatus);
            // Default mapping if label not found or standard overrides
            let statusLabel = statusObj?.label || 'Unknown';
            if (batch.BatchStatus === 1000) statusLabel = 'Pending Approval';
            if (batch.BatchStatus === 1500) statusLabel = 'In Progress';
            if (batch.BatchStatus === 2000) statusLabel = 'Completed';

            // Check if assigned to current user
            const currentUserId = localStorage.getItem("userId") || '1'; // Default to '1' for demo if not set
            const isAssignedToMe = String(batch.PendingAtUserId) === String(currentUserId);

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

    // Stats Calculation
    const calculatedStats = useMemo(() => {
        const total = tasks.length;
        const pending = tasks.filter(t => t.status === 'Open' || t.status === 'Pending').length;
        const assigned = tasks.filter(t => t.assignees.length > 0).length;
        const unassigned = total - assigned;

        return [
            { title: 'Total Tasks', value: total, icon: 'List', bg: 'bg-indigo-50', color: 'text-indigo-600', trend: '+12%', trendUp: true },
            { title: 'Pending', value: pending, icon: 'Clock', bg: 'bg-amber-50', color: 'text-amber-600', trend: '-5%', trendUp: false },
            { title: 'Completed', value: 0, icon: 'CheckCircle', bg: 'bg-emerald-50', color: 'text-emerald-600', trend: '+8%', trendUp: true },
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
            <div className="space-y-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Task Assignment</h1>
                            <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2.5 py-0.5 rounded-full">24 New</span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Overview of current workload distribution and unassigned tasks across departments.</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        {/* Avatar stack logic could go here */}
                        <div className="h-8 w-px bg-slate-200 mx-2 hidden lg:block"></div>
                        <button className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 px-4 py-2.5 rounded text-sm font-semibold transition-all shadow-sm flex items-center gap-2">
                            <AppIcon name={"BarChart2"} className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                            Reports
                        </button>
                    </div>
                </div>

                <StatsGrid stats={calculatedStats} />

                <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <TaskToolbar
                        search={search}
                        setSearch={setSearch}
                        selectedView={selectedView}
                        setSelectedView={setSelectedView}
                        filters={filters}
                        setFilters={setFilters}
                    />

                    <div className="p-6 bg-slate-50/30 dark:bg-slate-700/30">
                        {isLoading ? (
                            <div className="flex justify-center items-center h-48">
                                <span className="text-slate-500">Loading tasks...</span>
                            </div>
                        ) : (
                            <div className={`grid gap-6 ${selectedView === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                                {filteredTasks.length > 0 ? (
                                    filteredTasks.map((task) => (
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
                                    ))
                                ) : (
                                    <div className="col-span-full flex flex-col items-center justify-center h-48 text-slate-400">
                                        <AppIcon name="Search" size={48} className="mb-4 opacity-20" />
                                        <p>No tasks found matching your filters.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    {/* Pagination - Simplified/Mocked for now */}
                    <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between bg-white dark:bg-slate-800">
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                            Showing <span className="font-bold text-slate-900 dark:text-white">1-{filteredTasks.length}</span> of <span className="font-bold text-slate-900 dark:text-white">{tasks.length}</span> tasks
                        </p>
                        <div className="flex gap-2">
                            <button className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50 transition-colors">Previous</button>
                            <button className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900 border border-indigo-100 dark:border-indigo-700 rounded-lg text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-800 transition-colors">Next</button>
                        </div>
                    </div>
                </div>

                {/* Assignment Guidelines */}
                <div className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl p-6 border border-gray-100">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Assignment Guidelines</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-sm font-bold mb-2">Self-Assignment (Any User)</h4>
                            <ul className="space-y-2 text-sm">
                                <li className="flex items-start gap-2">
                                    <span className="block w-1 h-1 mt-2 rounded-full bg-gray-400"></span>
                                    Click "Claim" to assign task to yourself
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="block w-1 h-1 mt-2 rounded-full bg-gray-400"></span>
                                    Task moves to your personal queue
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="block w-1 h-1 mt-2 rounded-full bg-gray-400"></span>
                                    You become responsible for completion
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="block w-1 h-1 mt-2 rounded-full bg-gray-400"></span>
                                    Can be reassigned later if needed
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-gray-800 dark:text-white mb-2">Manager Assignment (Higher Users)</h4>
                            <ul className="space-y-2 text-sm ">
                                <li className="flex items-start gap-2">
                                    <span className="block w-1 h-1 mt-2 rounded-full bg-gray-400"></span>
                                    Click "Assign" to assign to team members
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="block w-1 h-1 mt-2 rounded-full bg-gray-400"></span>
                                    Consider workload and skill requirements
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="block w-1 h-1 mt-2 rounded-full bg-gray-400"></span>
                                    Balance team capacity and deadlines
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="block w-1 h-1 mt-2 rounded-full bg-gray-400"></span>
                                    Monitor assignment effectiveness
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>


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
};

export default TaskAssignment;
