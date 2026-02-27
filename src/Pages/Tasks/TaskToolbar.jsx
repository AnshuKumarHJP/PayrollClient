import React from 'react';
import SearchInput from '../../Library/SearchInput';
import AppIcon from '../../Component/AppIcon';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../Library/Select';
import { Modules } from '../../Data/StaticData';

const TaskToolbar = ({ search, setSearch, selectedView, setSelectedView, filters, setFilters }) => {
  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md p-3 sm:px-4 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] flex flex-col xl:flex-row gap-3 xl:items-center justify-between z-20 sticky top-2">
      <div className="flex w-full xl:w-auto flex-1 items-center gap-3">
        {/* Search */}
        <div className="flex-1 w-full relative">
          <SearchInput value={search} onChange={setSearch} placeholder="Search tasks, items, or action owners..." />
        </div>
        <div className="h-10 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
        {/* View Toggles */}
        <div className="flex bg-slate-100 dark:bg-slate-900/50 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setSelectedView('grid')}
            className={`p-2 rounded-lg transition-all flex items-center justify-center ${selectedView === 'grid' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 font-bold ring-1 ring-slate-200 dark:ring-slate-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-slate-800'}`}
          >
            <AppIcon name={"Grid"} size={18} strokeWidth={selectedView === 'grid' ? 2.5 : 2} />
          </button>
          <button
            onClick={() => setSelectedView('list')}
            className={`p-2 rounded-lg transition-all flex items-center justify-center ${selectedView === 'list' ? 'bg-white dark:bg-slate-700 shadow-sm text-indigo-600 font-bold ring-1 ring-slate-200 dark:ring-slate-600' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 dark:text-slate-400 dark:hover:bg-slate-800'}`}
          >
            <AppIcon name={"List"} size={18} strokeWidth={selectedView === 'list' ? 2.5 : 2} />
          </button>
        </div>
      </div>

      <div className="flex w-full xl:w-auto overflow-x-auto scrollbar-hide shrink-0 pb-1 xl:pb-0 items-center gap-2.5">
        <Select value={filters.priority || "all-priorities"} onValueChange={(value) => updateFilter('priority', value === "all-priorities" ? "" : value)}>
          <SelectTrigger className="w-[140px] h-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-colors shadow-sm shrink-0 font-medium">
            <SelectValue placeholder="Priority Level" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200 shadow-xl overflow-hidden">
            <SelectItem value="all-priorities" className="font-medium">All Priorities</SelectItem>
            <SelectItem value="Critical" className="font-medium text-rose-600">Critical</SelectItem>
            <SelectItem value="High" className="font-medium text-orange-600">High</SelectItem>
            <SelectItem value="Medium" className="font-medium text-amber-600">Medium</SelectItem>
            <SelectItem value="Low" className="font-medium text-emerald-600">Low</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.status || "all-status"} onValueChange={(value) => updateFilter('status', value === "all-status" ? "" : value)}>
          <SelectTrigger className="w-[140px] h-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-colors shadow-sm shrink-0 font-medium">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200 shadow-xl overflow-hidden">
            <SelectItem value="all-status" className="font-medium">All Statuses</SelectItem>
            <SelectItem value="Open" className="font-medium">Open</SelectItem>
            <SelectItem value="In Progress" className="font-medium">In Progress</SelectItem>
            <SelectItem value="Review" className="font-medium">Review</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.assignee || "all-tasks"} onValueChange={(value) => updateFilter('assignee', value === "all-tasks" ? "" : value)}>
          <SelectTrigger className="w-[140px] h-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-colors shadow-sm shrink-0 font-medium">
            <SelectValue placeholder="All Assignments" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200 shadow-xl overflow-hidden">
            <SelectItem value="all-tasks" className="font-medium">All Tasks</SelectItem>
            <SelectItem value="assigned" className="font-medium">Assigned</SelectItem>
            <SelectItem value="unassigned" className="font-medium text-rose-600">Unassigned</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.moduleId || "all-modules"} onValueChange={(value) => updateFilter('moduleId', value === "all-modules" ? "" : value)}>
          <SelectTrigger className="w-[140px] h-10 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-colors shadow-sm shrink-0 font-medium">
            <SelectValue placeholder="All Modules" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-slate-200 shadow-xl overflow-hidden">
            <SelectItem value="all-modules" className="font-medium">All Modules</SelectItem>
            {Modules?.map(m => (
              <SelectItem key={m.value} value={String(m.value)} className="font-medium">{m.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        {(filters.priority || filters.status || filters.dept || filters.assignee || filters.moduleId) && (
          <button
            onClick={() => setFilters({ priority: '', status: '', dept: '', assignee: '', moduleId: '' })}
            className="h-10 px-3 w-10 flex items-center justify-center shrink-0 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-all shadow-sm"
            title="Clear Filters"
          >
            <AppIcon name="FilterX" size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskToolbar;
