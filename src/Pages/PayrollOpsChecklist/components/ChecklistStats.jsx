import React from 'react';
import AppIcon from "../../../Component/AppIcon";

const StatCard = ({ label, value, icon, subtext, trend, variant = 'blue' }) => {
    const variants = {
        emerald: 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600',
        amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600',
        rose: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600',
        indigo: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600',
        blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600',
        violet: 'bg-violet-50 dark:bg-violet-900/20 text-violet-600'
    };

    const colorClass = variants[variant] || variants.blue;

    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700/60 shadow-sm transition-all hover:shadow-md h-full flex flex-col justify-between min-h-[120px]">
            <div className="flex justify-between items-start mb-2">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                    <AppIcon name={icon} size={18} />
                </div>
                {trend && (
                    <span className="text-[10px] font-bold text-emerald-500 flex items-center">
                        {trend}
                    </span>
                )}
            </div>

            <div>
                <h4 className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">{label}</h4>
                <div className="flex items-baseline gap-1.5">
                    <span className="text-xl font-bold text-slate-800 dark:text-slate-100">
                        {value}
                    </span>
                    {subtext && <span className="text-[9px] font-bold text-slate-400 uppercase">{subtext}</span>}
                </div>
            </div>
        </div>
    );
};

const ChecklistStats = ({ progress, pendingCount, criticalCount, totalTasks, upcomingCount, completedCount }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
            <StatCard
                label="Total Tasks"
                value={totalTasks || 0}
                icon="Layers"
                variant="indigo"
            />
            <StatCard
                label="Completed"
                value={completedCount || 0}
                icon="CheckCircle2"
                variant="emerald"
                trend="+8%"
            />
            <StatCard
                label="Completion %"
                value={`${progress}%`}
                icon="Activity"
                variant="blue"
                subtext="Rate"
            />
            <StatCard
                label="Due Soon"
                value={upcomingCount || 0}
                icon="Calendar"
                variant="violet"
                subtext="7 days"
            />
            <StatCard
                label="Pending"
                value={pendingCount || 0}
                icon="Clock"
                variant="amber"
            />
            <StatCard
                label="Critical"
                value={criticalCount || 0}
                icon="ShieldAlert"
                variant="rose"
                subtext="Action"
            />
        </div>
    );
};


export default ChecklistStats;
