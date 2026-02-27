import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppIcon from '../Component/AppIcon';
import { motion } from 'framer-motion';

const ActionRoute = () => {
    const navigate = useNavigate();

    const actions = [
        { label: 'Employee Dashboard', path: '/employee', icon: 'User', bg: 'bg-blue-500', category: 'General' },
        { label: 'Input Submissions', path: '/inputs', icon: 'FileInput', bg: 'bg-indigo-500', category: 'Payroll' },
        { label: 'Import History', path: '/inputs/history', icon: 'History', bg: 'bg-slate-700', category: 'Payroll' },
        { label: 'Unclaimed Tasks', path: '/tasks/unclaimed', icon: 'Inbox', bg: 'bg-rose-500', category: 'Operations' },
        { label: 'Claim Tasks', path: '/tasks/claim', icon: 'UserPlus', bg: 'bg-emerald-500', category: 'Operations' },
        { label: 'My Workload', path: '/tasks/my', icon: 'Briefcase', bg: 'bg-indigo-600', category: 'Operations' },
        { label: 'Active Checklist', path: '/checklist', icon: 'ClipboardCheck', bg: 'bg-blue-600', category: 'Checklist' },
        { label: 'Checklist Config', path: '/checklist-config', icon: 'Settings2', bg: 'bg-slate-800', category: 'Checklist' },
        { label: 'Workflow Designer', path: '/workflow-config', icon: 'GitBranch', bg: 'bg-purple-600', category: 'Config' },
        { label: 'Form Builder', path: '/formbuilder', icon: 'Layout', bg: 'bg-amber-600', category: 'Config' },
        { label: 'Validation Rules', path: '/fieldValidationRule', icon: 'CheckSquare', bg: 'bg-pink-600', category: 'Config' },
        { label: 'Field Mapping', path: '/mapping-inputs', icon: 'Link', bg: 'bg-cyan-600', category: 'Config' },
        { label: 'Client Setup', path: '/client-setup', icon: 'Building2', bg: 'bg-neutral-800', category: 'Admin' },
        { label: 'Reports Hub', path: '/reports', icon: 'BarChart4', bg: 'bg-rose-600', category: 'Admin' },
        { label: 'Audit Logs', path: '/system/audit-logs', icon: 'ShieldAlert', bg: 'bg-slate-900', category: 'System' },
        { label: 'System Settings', path: '/system/settings', icon: 'HardDrive', bg: 'bg-blue-900', category: 'System' }
    ];

    const categories = ['All', ...new Set(actions.map(a => a.category))];
    const [activeCategory, setActiveCategory] = React.useState('All');

    const filteredActions = activeCategory === 'All'
        ? actions
        : actions.filter(a => a.category === activeCategory);

    return (
        <div className="p-8 space-y-8 min-h-screen bg-slate-50 dark:bg-slate-950">
            <header className="max-w-4xl">
                <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-3">Action Command Center</h1>
                <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">Quick navigation to all operational and configuration modules across the payroll ecosystem.</p>
            </header>

            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
                {categories.map(cat => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${activeCategory === cat ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredActions.map((action, idx) => (
                    <motion.div
                        key={action.path}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ y: -8, scale: 1.02 }}
                        onClick={() => navigate(action.path)}
                        className="group bg-white dark:bg-slate-800 p-8 rounded-[40px] border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 cursor-pointer transition-all duration-300 relative overflow-hidden"
                    >
                        <div className={`absolute top-0 right-0 w-32 h-32 ${action.bg} opacity-[0.03] rounded-bl-full group-hover:opacity-[0.08] transition-opacity`}></div>

                        <div className={`w-16 h-16 ${action.bg} rounded-3xl flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-500/10 group-hover:rotate-6 transition-transform`}>
                            <AppIcon name={action.icon} size={28} />
                        </div>

                        <div className="space-y-1">
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">{action.category}</span>
                            <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">{action.label}</h3>
                        </div>

                        <div className="mt-6 flex items-center gap-2 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                            Open Module <AppIcon name="ChevronRight" size={14} />
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default ActionRoute;
