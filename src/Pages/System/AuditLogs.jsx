import React from 'react';
import AppIcon from '../../Component/AppIcon';

const AuditLogs = () => {
    return (
        <div className="p-8 space-y-8">
            <header>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-bold text-slate-500 mb-4 tracking-widest uppercase">
                    Security & Compliance
                </div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                    <div className="p-2 bg-indigo-600 rounded-xl text-white">
                        <AppIcon name="Shield" size={24} />
                    </div>
                    System Audit Trail
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Immutable timeline of every administrative action and security event across the system.</p>
            </header>

            <div className="bg-white dark:bg-slate-800 rounded-[32px] border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                <div className="flex p-6 border-b border-slate-100 dark:border-slate-700 gap-4 overflow-x-auto no-scrollbar">
                    {['All Events', 'Logins', 'Data Changes', 'Workflow Actions', 'System Config'].map((filter, i) => (
                        <button key={i} className={`px-5 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${i === 0 ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900'}`}>
                            {filter}
                        </button>
                    ))}
                </div>
                <div className="p-0">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 dark:bg-slate-900/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100 dark:border-slate-700">
                            <tr>
                                <th className="px-8 py-4">Timestamp</th>
                                <th className="px-8 py-4">User Identity</th>
                                <th className="px-8 py-4">Action Event</th>
                                <th className="px-8 py-4">Resource</th>
                                <th className="px-8 py-4 text-right">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {[1, 2, 3, 4, 5].map(i => (
                                <tr key={i} className="group hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                                    <td className="px-8 py-6 font-mono text-xs text-slate-500">2024-03-15 14:22:{i}0</td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700"></div>
                                            <span className="font-bold text-slate-900 dark:text-white text-sm">Admin_User_{i}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${i % 2 === 0 ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' : 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600'}`}>
                                            {i % 2 === 0 ? 'CONFIG_UPDATE' : 'DATA_PURGE'}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-sm text-slate-600 dark:text-slate-400 font-medium font-mono">
                                        /api/v1/payroll/{i}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg text-slate-400 transition-colors">
                                            <AppIcon name="ExternalLink" size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AuditLogs;
