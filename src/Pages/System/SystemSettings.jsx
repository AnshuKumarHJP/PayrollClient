import React from 'react';
import AppIcon from '../../Component/AppIcon';

const SystemSettings = () => {
    const sections = [
        { title: 'Global Authentication', desc: 'SSO, MFA, and session timeout policies.', icon: 'Lock' },
        { title: 'Database & Sync', desc: 'Real-time synchronization and backup frequency.', icon: 'Database' },
        { title: 'Email & Notifications', desc: 'SMTP configuration and global alert rules.', icon: 'Mail' },
        { title: 'API Access', desc: 'Third-party integration keys and rate limits.', icon: 'Code' },
        { title: 'White Labeling', desc: 'Custom branding, logos, and theme palettes.', icon: 'Palette' },
        { title: 'Regional Standards', desc: 'Date formats, currencies, and tax jurisdictions.', icon: 'Globe' }
    ];

    return (
        <div className="p-8 space-y-8">
            <header className="flex justify-between items-start">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                        <div className="p-2 bg-slate-900 dark:bg-white rounded-xl text-white dark:text-slate-900">
                            <AppIcon name="Settings" size={24} />
                        </div>
                        Global Control Center
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Core infrastructure configuration and site-wide behavioral settings.</p>
                </div>
                <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-white rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">Discard</button>
                    <button className="px-5 py-2.5 bg-indigo-600 shadow-lg shadow-indigo-600/30 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all">Save Changes</button>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sections.map((section, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-800 p-8 rounded-[32px] border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all group cursor-pointer">
                        <div className="w-14 h-14 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white mb-6 transition-all duration-300">
                            <AppIcon name={section.icon} size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{section.title}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{section.desc}</p>
                        <div className="mt-6 flex items-center gap-2 text-indigo-600 text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                            Configure Settings <AppIcon name="ArrowRight" size={12} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SystemSettings;
