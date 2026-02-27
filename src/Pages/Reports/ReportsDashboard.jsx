import React from 'react';
import AppIcon from '../../Component/AppIcon';
import { motion } from 'framer-motion';

const ReportsDashboard = () => {
    const categories = [
        { title: 'Payroll Summaries', count: 12, icon: 'FileText', color: 'indigo' },
        { title: 'Statutory Returns', count: 8, icon: 'ShieldCheck', color: 'emerald' },
        { title: 'Employee Insights', count: 15, icon: 'Users', color: 'blue' },
        { title: 'Expense Analytics', count: 6, icon: 'PieChart', color: 'violet' }
    ];

    return (
        <div className="p-8 space-y-8">
            <header>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                    <div className="p-2 bg-rose-500 rounded-xl text-white">
                        <AppIcon name="BarChart3" size={24} />
                    </div>
                    Intelligence & Reporting
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Deep dive into payroll data, compliance status, and workforce metrics.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categories.map((cat, idx) => (
                    <motion.div
                        key={idx}
                        whileHover={{ y: -5 }}
                        className="bg-white dark:bg-slate-800 p-6 rounded-[24px] border border-slate-200 dark:border-slate-700 shadow-sm cursor-pointer group transition-all"
                    >
                        <div className={`w-12 h-12 rounded-2xl bg-${cat.color}-500/10 flex items-center justify-center text-${cat.color}-500 mb-6 group-hover:scale-110 transition-transform`}>
                            <AppIcon name={cat.icon} size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{cat.title}</h3>
                        <div className="flex justify-between items-center mt-4">
                            <span className="text-sm font-bold text-slate-400">{cat.count} Reports</span>
                            <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                                <AppIcon name="ArrowRight" size={16} />
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-[32px] border border-slate-200 dark:border-slate-700 p-8 min-h-[400px]">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Recent Analytics</h3>
                    <div className="aspect-[16/9] bg-slate-50 dark:bg-slate-900 rounded-3xl flex flex-col items-center justify-center text-slate-400">
                        <AppIcon name="AreaChart" size={64} className="opacity-10 mb-4" />
                        <p className="font-bold">No recent snapshots</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 rounded-[32px] border border-slate-200 dark:border-slate-700 p-8">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">Pinned Reports</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                                <div className="w-10 h-10 bg-rose-50 dark:bg-rose-900/20 rounded-xl flex items-center justify-center text-rose-500">
                                    <AppIcon name="Star" size={18} />
                                </div>
                                <div className="flex-1">
                                    <div className="h-2 w-24 bg-slate-100 dark:bg-slate-700 rounded-full mb-2"></div>
                                    <div className="h-2 w-16 bg-slate-50 dark:bg-slate-800 rounded-full"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReportsDashboard;
