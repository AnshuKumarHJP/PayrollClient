import React from 'react';
import AppIcon from '../../Component/AppIcon';
import { motion } from 'framer-motion';

const ClientSetup = () => {
    return (
        <div className="p-8 space-y-8">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-indigo-600 rounded-xl text-white">
                            <AppIcon name="Building" size={24} />
                        </div>
                        Client Architecture & Setup
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Configure entities, departments, and client-specific business rules.</p>
                </div>
                <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2">
                    <AppIcon name="Plus" size={18} />
                    New Entity
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Clients', value: '42', icon: 'Users', color: 'indigo' },
                    { label: 'Active Projects', value: '128', icon: 'Briefcase', color: 'emerald' },
                    { label: 'Pending Setups', value: '5', icon: 'Clock', color: 'amber' }
                ].map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white dark:bg-slate-800 p-6 rounded-[24px] border border-slate-200 dark:border-slate-700 shadow-sm"
                    >
                        <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 flex items-center justify-center text-${stat.color}-600 mb-4`}>
                            <AppIcon name={stat.icon} size={24} />
                        </div>
                        <h3 className="text-slate-500 dark:text-slate-400 text-sm font-bold uppercase tracking-wider">{stat.label}</h3>
                        <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{stat.value}</p>
                    </motion.div>
                ))}
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-[32px] border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">Active Entities</h2>
                    <div className="flex gap-2">
                        <div className="relative">
                            <AppIcon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Filter clients..."
                                className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 rounded-xl border-none text-sm focus:ring-2 focus:ring-indigo-500"
                            />
                        </div>
                    </div>
                </div>
                <div className="p-8 text-center py-20">
                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <AppIcon name="Layers" size={40} className="text-slate-200" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Entity Directory</h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm mx-auto font-medium">Start by adding your first client entity to configure their specific payroll and HR workflow rules.</p>
                </div>
            </div>
        </div>
    );
};

export default ClientSetup;
