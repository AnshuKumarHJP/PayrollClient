import React from 'react';

const MetricPill = ({ label, value, icon, accent }) => {
    const accents = {
        indigo: "from-indigo-600/10 via-indigo-500/5 to-indigo-600/10 border-indigo-200/50 dark:border-indigo-500/30 text-indigo-700 dark:text-indigo-400",
        emerald: "from-emerald-600/10 via-emerald-500/5 to-emerald-600/10 border-emerald-200/50 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400",
        amber: "from-amber-600/10 via-amber-500/5 to-amber-600/10 border-amber-200/50 dark:border-amber-500/30 text-amber-700 dark:text-amber-400",
        rose: "from-rose-600/10 via-rose-500/5 to-rose-600/10 border-rose-200/50 dark:border-rose-500/30 text-rose-700 dark:text-rose-400",
    };
    return (
        <div className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl border bg-gradient-to-r ${accents[accent] || accents.indigo} min-w-0`}>
            <span className="text-base sm:text-lg shrink-0">{icon}</span>
            <div className="min-w-0 overflow-hidden">
                <div className="text-xl sm:text-2xl font-bold leading-none tabular-nums truncate">{value}</div>
                <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest opacity-70 mt-0.5 truncate">{label}</div>
            </div>
        </div>
    );
};

export default MetricPill;
