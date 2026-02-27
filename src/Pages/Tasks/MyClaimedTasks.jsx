import { GetClientPortalWFDetailsForLoggedInUserService, UpdateClientPortalWFBatchService } from '../Builder/FormDataService';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TaskCard from './TaskCard';
import StatsGrid from './StatsGrid';
import TaskToolbar from './TaskToolbar';
import AppIcon from '../../Component/AppIcon';
import { useSelector } from 'react-redux';
import { getStats } from '../PayrollOpsChecklist/PayrollChecklistService';
import useRole from '../../Hooks/useRole';

const MyClaimedTasks = () => {
  const navigate = useNavigate();
  const { isPayrollUser, isSuperAdmin } = useRole();


  // Fetch Real Data
  const [rawBatches, setRawBatches] = useState([]);
  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const authData = useSelector(
    (state) => state.Auth.LogResponce.data
  );

  const session = authData?.UserSession || {};
  const currentUserId = session?.UserId || '';

  const [selectedView, setSelectedView] = useState('grid');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    priority: '',
    status: '',
    assignee: 'assigned'
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      // Fetch all tasks for now and filter client-side, or use specific API if available
      const GetApi = "/api/ClientPortalWorkflow/GetClientPortalWFDetailsForLoggedInUser?ModuleId=${ModuleId}&Status=${Status}";
      // Note: In a real scenario, we might want a different API for "My Tasks" or filter by Status != Completed
      const payload = { ModuleId: 1, Status: 1000 };

      const res = await GetClientPortalWFDetailsForLoggedInUserService(GetApi, payload);
      const batchesList = Array.isArray(res) ? res : (res ? [res] : []);
      setRawBatches(batchesList);
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    const fetchStats = async () => {
      try {
        const data = await getStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };
    fetchStats();
  }, []);

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

  const handleRelease = async (taskId) => {
    if (window.confirm("Return this task to the unassigned pool?")) {
      try {
        const payload = {
          Id: taskId,
          PendingAtUserId: 0 // Unassign
        };
        await UpdateClientPortalWFBatchService(payload);
        fetchTasks();
      } catch (error) {
        console.error("Release failed", error);
      }
    }
  };

  console.log("rawBatches", rawBatches);
  console.log("currentUserId", currentUserId);


  // Map and Filter for "My Tasks"
  const myTasks = rawBatches
    .filter(batch => String(batch.CreatedBy) === String(currentUserId)) // Only my tasks
    .map(batch => {
      // Simple status label mapping
      let statusLabel = 'Pending Approval';
      if (batch.BatchStatus === 1500) statusLabel = 'In Progress';
      if (batch.BatchStatus === 2000) statusLabel = 'Completed';

      return {
        id: String(batch.Id),
        title: batch.BatchName || "Untitled Batch",
        formName: batch.FormBuilderName,
        description: `Requests: ${batch.RequestCount} | Created by: ${batch.CreatedBy || 'System'}`,
        priority: batch.RequestCount > 5 ? "Critical" : "Medium",
        status: statusLabel,
        estimate: `${Math.max(batch.RequestCount * 2, 1)}h`,
        dueDate: new Date().toLocaleDateString(), // Mock
        overdueDays: 0,
        tags: ["Batch"],
        progress: batch.Progress || (statusLabel === "In Progress" ? 45 : 0),
        assignees: [`https://i.pravatar.cc/150?u=${currentUserId}`],
        attachments: batch.RequestCount,
        comments: 0,
        isAssignedToMe: true
      };
    });

  const filteredTasks = myTasks.filter(task => {
    const searchLower = search.toLowerCase();
    return !search || task.title.toLowerCase().includes(searchLower);
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredTasks.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-sm md:text-xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <AppIcon name="Briefcase" className="w-5 h-5 text-indigo-600" />
            My Claimed Tasks
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm mt-1">
            Track your contributions and active workload.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-xs md:text-sm font-semibold flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm">
            <AppIcon name="Calendar" size={14} />
            Plan Day
          </button>
          <Link to="/tasks/claim" className="px-3 py-2 bg-indigo-600 text-white rounded text-xs md:text-sm font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-md">
            <AppIcon name="Plus" size={14} />
            New Task
          </Link>
        </div>
      </div>

      <StatsGrid stats={stats} />

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <TaskToolbar
          search={search}
          setSearch={setSearch}
          selectedView={selectedView}
          setSelectedView={setSelectedView}
          filters={filters}
          setFilters={setFilters}
        />

        <div className="p-6 bg-slate-50/30 dark:bg-slate-700/30 min-h-[400px]">
          {isLoading ? (
            <div className="flex justify-center items-center h-48">
              <span className="text-slate-500">Loading your tasks...</span>
            </div>
          ) : currentItems.length > 0 ? (
            <div className={`grid gap-6 ${selectedView === 'grid' ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
              {currentItems.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  personalView={true}
                  onStatusChange={handleStatusChange}
                  onRelease={handleRelease}
                  onWork={(id) => navigate(`/tasks/working/${id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700/50 rounded-full flex items-center justify-center mb-4">
                <AppIcon name="SearchX" className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">No tasks found</h3>
              <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto">Try clearing your filters or check the unassigned pool for new tasks.</p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between bg-white dark:bg-slate-800">
          <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
            Showing <span className="font-bold text-slate-900 dark:text-white">{filteredTasks.length > 0 ? indexOfFirstItem + 1 : 0}-{Math.min(indexOfLastItem, filteredTasks.length)}</span> of <span className="font-bold text-slate-900 dark:text-white">{filteredTasks.length}</span> tasks
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 md:px-4 md:py-2 border border-slate-200 dark:border-slate-600 rounded-lg text-xs md:text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 disabled:opacity-50 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1.5 md:px-4 md:py-2 bg-indigo-50 dark:bg-indigo-900 border border-indigo-100 dark:border-indigo-700 rounded-lg text-xs md:text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyClaimedTasks;
