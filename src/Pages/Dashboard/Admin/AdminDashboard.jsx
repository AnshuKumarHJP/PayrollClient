import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import { UserCheck, Layers, Users, CheckCircle, Settings, Sliders } from "lucide-react";

import AdminHeader from "./components/AdminHeader";
import StatsCard from "./components/StatsCard";
import EmployeeStatus from "./components/EmployeeStatus";
import AttendanceOverview from "./components/AttendanceOverview";
import ClockInOut from "./components/ClockInOut";
import ProjectsTable from "./components/ProjectsTable";
import TaskStatistics from "./components/TaskStatistics";
import EmployeesByDepartment from "./components/EmployeesByDepartment";
import SalesOverview from "./components/SalesOverview";
import Invoices from "./components/Invoices";

// New Widgets
import FinancialStats from "./components/FinancialStats";
import JobApplicants from "./components/JobApplicants";
import EmployeesList from "./components/EmployeesList";
import TodoList from "./components/TodoList";
import Schedules from "./components/Schedules";
import RecentActivities from "./components/RecentActivities";
import Birthdays from "./components/Birthdays";
import AvatarMan from '../../../Image/AvatarMan.png';

// Configuration Component
import DashboardSettings from "./components/DashboardSettings";

// Defined Schema for Configuration
const WIDGET_SCHEMA = [
  {
    category: "Overview",
    role: "All",
    items: [
      { id: 'welcome', label: 'Welcome Banner', description: 'Personalized greeting and quick actions', default: true },
      { id: 'statsRow1', label: 'Key Metrics', description: 'High-level stats: Attendance, Projects, Clients', default: true },
      { id: 'financialStats', label: 'Financial Overview', description: 'Revenue, profit, and earnings summary', default: true, role: 'Admin' },
    ]
  },
  {
    category: "Personnel & Attendance",
    role: "Manager",
    items: [
      { id: 'employeeStatus', label: 'Employee Status', default: true },
      { id: 'attendance', label: 'Attendance Overview', default: true },
      { id: 'clockInOut', label: 'Clock In/Out', default: true },
    ]
  },
  {
    category: "Recruitment & Teams",
    role: "HR",
    items: [
      { id: 'jobApplicants', label: 'Job Applicants', default: true },
      { id: 'employeesList', label: 'Employees List', default: true },
      { id: 'todoList', label: 'Todo List', default: true },
      { id: 'employeesByDept', label: 'Employees by Dept', default: true },
    ]
  },
  {
    category: "Business & Projects",
    role: "Admin",
    items: [
      { id: 'salesOverview', label: 'Sales Overview', default: true },
      { id: 'invoices', label: 'Invoices', default: true },
      { id: 'taskStats', label: 'Task Statistics', default: true },
      { id: 'projectsTable', label: 'Projects Table', default: true },
    ]
  },
  {
    category: "Other",
    items: [
      { id: 'schedules', label: 'Schedules', default: true },
      { id: 'recentActivities', label: 'Recent Activities', default: true },
      { id: 'birthdays', label: 'Birthdays', default: true },
    ]
  }
];

const COLOR_THEMES = {
  orange: {
    id: 'orange',
    bgLight: 'bg-orange-50 dark:bg-orange-900/20',
    text: 'text-orange-600 dark:text-orange-400',
    btnPrimary: 'bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-500',
    statsColor: 'bg-orange-500',
    shadow: 'shadow-orange-200 dark:shadow-none',
    hex: { primary: '#f97316', secondary: '#fdba74', accent: '#c2410c' }
  },
  blue: {
    id: 'blue',
    bgLight: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-600 dark:text-blue-400',
    btnPrimary: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500',
    statsColor: 'bg-blue-600',
    shadow: 'shadow-blue-200 dark:shadow-none',
    hex: { primary: '#2563eb', secondary: '#93c5fd', accent: '#1e40af' }
  },
  violet: {
    id: 'violet',
    bgLight: 'bg-violet-50 dark:bg-violet-900/20',
    text: 'text-violet-600 dark:text-violet-400',
    btnPrimary: 'bg-violet-600 hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-500',
    statsColor: 'bg-violet-600',
    shadow: 'shadow-violet-200 dark:shadow-none',
    hex: { primary: '#7c3aed', secondary: '#c4b5fd', accent: '#5b21b6' }
  },
  emerald: {
    id: 'emerald',
    bgLight: 'bg-emerald-50 dark:bg-emerald-900/20',
    text: 'text-emerald-600 dark:text-emerald-400',
    btnPrimary: 'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500',
    statsColor: 'bg-emerald-600',
    shadow: 'shadow-emerald-200 dark:shadow-none',
    hex: { primary: '#059669', secondary: '#6ee7b7', accent: '#065f46' }
  },
  rose: {
    id: 'rose',
    bgLight: 'bg-rose-50 dark:bg-rose-900/20',
    text: 'text-rose-600 dark:text-rose-400',
    btnPrimary: 'bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-500',
    statsColor: 'bg-rose-500',
    shadow: 'shadow-rose-200 dark:shadow-none',
    hex: { primary: '#e11d48', secondary: '#fda4af', accent: '#9f1239' }
  }
};

const AdminDashboard = () => {
  const globalTheme = useSelector(state => state.Auth.Common?.theme || 'light');
  const isDark = globalTheme === 'dark';

  // --- State Initialization ---
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('admin_dashboard_config');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Migration check: if old structure, convert it
        if (!parsed.widgets) {
          const defaults = {
            preferences: { density: parsed.density || 'comfortable', colorTheme: parsed.colorTheme || 'orange' },
            widgets: { ...parsed },
            metadata: { version: '2.0', lastUpdated: new Date().toISOString() }
          };
          // Remove old top-level keys from widgets
          delete defaults.widgets.density;
          delete defaults.widgets.colorTheme;
          return defaults;
        }
        return parsed;
      }
    } catch (e) {
      console.error("Failed to parse dashboard config", e);
    }

    // Default structure
    const defaults = {
      metadata: {
        version: '2.0.0',
        lastUpdated: new Date().toISOString(),
        environment: 'production'
      },
      preferences: {
        density: 'comfortable',
        colorTheme: 'orange',
        language: 'en-US'
      },
      widgets: {}
    };
    WIDGET_SCHEMA.forEach(group => group.items.forEach(i => defaults.widgets[i.id] = i.default));
    return defaults;
  });


  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // --- Persistence & Live Updates ---
  useEffect(() => {
    localStorage.setItem('admin_dashboard_config', JSON.stringify(config));
    window.dispatchEvent(new Event('dashboardConfigChanged'));
  }, [config]);

  // --- Helpers ---
  const isWidgetVisible = (id) => config.widgets[id];
  const isRowVisible = (ids) => ids.some(id => config.widgets[id]);

  // Dynamic Styles
  const density = config.preferences?.density || 'comfortable';
  const colorTheme = config.preferences?.colorTheme || 'orange';

  const gapClass = density === 'compact' ? 'gap-3' : 'gap-6';
  const spaceClass = density === 'compact' ? 'space-y-3' : 'space-y-6';
  const theme = COLOR_THEMES[colorTheme] || COLOR_THEMES.orange;

  return (
    <div className={`flex z-1 min-h-screen font-sans  bg-gray-50 dark:bg-slate-950 transition-colors duration-300 ${isDark ? 'dark' : ''}`}>
      <main className={`flex-1 ${spaceClass} pb-10`}>

        {/* Welcome Section */}
        {config.widgets.welcome && (
          <div className={`bg-white dark:bg-slate-800 rounded-xl shadow p-6 flex flex-col md:flex-row justify-between items-center ${gapClass}`}>
            <div className={`flex items-center ${gapClass} md:gap-4`}>
              <div className={`w-16 h-16 rounded-full ${theme.bgLight} flex items-center justify-center overflow-hidden shrink-0`}>
                <img src={AvatarMan} alt="Profile" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  Welcome Back, Adrian 👋
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  You have <span className={`${theme.text} font-semibold underline cursor-pointer`}>21 Pending Approvals</span> & <span className={`${theme.text} font-semibold underline cursor-pointer`}>14 Leave Requests</span>
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition"
              >
                <Sliders size={16} /> Customize
              </button>
              <button className="px-4 py-2 rounded-lg bg-gray-800 dark:bg-slate-900 text-white text-sm font-medium hover:bg-gray-700 dark:hover:bg-slate-800 transition">
                Add Project
              </button>
              <button className={`px-4 py-2 rounded-lg ${theme.btnPrimary} text-white text-sm font-medium transition shadow-lg ${theme.shadow}`}>
                Add Requests
              </button>
            </div>
          </div>
        )}

        {/* Fallback settings button if welcome banner is hidden */}
        {!config.widgets.welcome && (
          <div className="flex justify-end px-1 pt-4">
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow text-gray-700 text-sm font-medium hover:bg-gray-50 transition"
            >
              <Sliders size={16} /> Dashboard Settings
            </button>
          </div>
        )}

        {/* Stats Row 1 */}
        {config.widgets.statsRow1 && (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 ${gapClass}`}>
            <StatsCard
              title="Attendance"
              value="92/99"
              subValue="+2.1%"
              isIncrease={true}
              color={theme.statsColor} // Dynamic primary color
              icon={UserCheck}
            />
            <StatsCard
              title="Total Projects"
              value="90/94"
              subValue="-2.1%"
              isIncrease={false}
              color="bg-blue-600" // Keep specialized colors distinct if desired, or map them too
              icon={Layers}
            />
            <StatsCard
              title="Total Clients"
              value="69/86"
              subValue="-11.2%"
              isIncrease={false}
              color="bg-blue-400"
              icon={Users}
            />
            <StatsCard
              title="Total Tasks"
              value="25/28"
              subValue="+11.2%"
              isIncrease={true}
              color="bg-pink-500"
              icon={CheckCircle}
            />
          </div>
        )}

        {/* Stats Row 2 (Financial) */}
        {config.widgets.financialStats && <FinancialStats theme={theme} />}

        {/* Grid Row 1: Emp Status, Attendance, Clock In */}
        {isRowVisible(['employeeStatus', 'attendance', 'clockInOut']) && (
          <div className={`grid grid-cols-1 lg:grid-cols-3 ${gapClass}`}>
            {config.widgets.employeeStatus && (
              <div className="lg:col-span-1 h-full">
                <EmployeeStatus />
              </div>
            )}
            {config.widgets.attendance && (
              <div className="lg:col-span-1 h-full">
                <AttendanceOverview theme={theme} isDark={isDark} />
              </div>
            )}
            {config.widgets.clockInOut && (
              <div className="lg:col-span-1 h-full">
                <ClockInOut />
              </div>
            )}
          </div>
        )}

        {/* Grid Row 2: Job Applicants, Employees List, Todo List */}
        {isRowVisible(['jobApplicants', 'employeesList', 'todoList']) && (
          <div className={`grid grid-cols-1 lg:grid-cols-3 ${gapClass}`}>
            {config.widgets.jobApplicants && (
              <div className="lg:col-span-1 h-full">
                <JobApplicants />
              </div>
            )}
            {config.widgets.employeesList && (
              <div className="lg:col-span-1 h-full">
                <EmployeesList />
              </div>
            )}
            {config.widgets.todoList && (
              <div className="lg:col-span-1 h-full">
                <TodoList />
              </div>
            )}
          </div>
        )}

        {/* Grid Row 3: Employees by Dept, Sales Overview (Wide) */}
        {isRowVisible(['employeesByDept', 'salesOverview']) && (
          <div className={`grid grid-cols-1 lg:grid-cols-3 ${gapClass}`}>
            {config.widgets.employeesByDept && (
              <div className="lg:col-span-1 h-full">
                <EmployeesByDepartment theme={theme} isDark={isDark} />
              </div>
            )}
            {config.widgets.salesOverview && (
              <div className={`h-full ${config.widgets.employeesByDept ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
                <SalesOverview theme={theme} isDark={isDark} />
              </div>
            )}
          </div>
        )}

        {/* Grid Row 4: Invoices, Task Stats */}
        {isRowVisible(['invoices', 'taskStats']) && (
          <div className={`grid grid-cols-1 lg:grid-cols-3 ${gapClass}`}>
            {config.widgets.invoices && (
              <div className={`h-full ${config.widgets.taskStats ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
                <Invoices />
              </div>
            )}
            {config.widgets.taskStats && (
              <div className="lg:col-span-1 h-full">
                <TaskStatistics theme={theme} isDark={isDark} />
              </div>
            )}
          </div>
        )}

        {/* Grid Row 5: Projects (Wide) */}
        {config.widgets.projectsTable && (
          <div className={`grid grid-cols-1 lg:grid-cols-3 ${gapClass}`}>
            <div className="lg:col-span-3 h-full">
              <ProjectsTable />
            </div>
          </div>
        )}

        {/* Grid Row 6: Schedules, Activities, Birthdays */}
        {isRowVisible(['schedules', 'recentActivities', 'birthdays']) && (
          <div className={`grid grid-cols-1 lg:grid-cols-3 ${gapClass}`}>
            {config.widgets.schedules && (
              <div className="lg:col-span-1 h-full">
                <Schedules />
              </div>
            )}
            {config.widgets.recentActivities && (
              <div className="lg:col-span-1 h-full">
                <RecentActivities />
              </div>
            )}
            {config.widgets.birthdays && (
              <div className="lg:col-span-1 h-full">
                <Birthdays />
              </div>
            )}
          </div>
        )}
      </main>

      <DashboardSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        setConfig={setConfig}
        widgetSchema={WIDGET_SCHEMA}
      />
    </div>
  );
};

export default AdminDashboard;
