import React from 'react';
import AppIcon from "../../../Component/AppIcon";

const ChecklistFilterSidebar = ({ categories, activeTab, setActiveTab, tasks }) => {

    // Helper to calculate counts
    const getCategoryCount = (catId) => {
        if (catId === 'all') return tasks.length;
        return tasks.filter(t => String(t.category) === String(catId)).length;
    };

    const filterItems = [
        { name: 'Overview', id: 'all', icon: 'LayoutGrid', color: 'bg-indigo-600' },
        ...categories.map(c => {
            // Use existing icon if available, else fallback logic (though DB has icons now)
            const colors = ['bg-blue-600', 'bg-emerald-600', 'bg-orange-600', 'bg-purple-600', 'bg-pink-600'];
            const hash = typeof c.id === 'number' ? c.id : 0;
            return {
                ...c,
                icon: c.icon || 'Folder', // Fallback
                color: c.color ? `bg-${c.color}-600` : colors[hash % colors.length] // specific logic if color is name
            };
        })
    ];

    return (
        <div className="w-full lg:w-64 bg-white dark:bg-slate-800 lg:rounded-lg rounded-2xl border border-slate-200/60 dark:border-slate-700/50 h-fit lg:sticky lg:top-6 shadow-sm overflow-hidden transition-all hover:shadow-xl hover:shadow-indigo-500/5 duration-500">
            {/* Header Section - Desktop Only */}
            <div className="hidden lg:block bg-gradient-to-br from-slate-50 to-slate-100/30 dark:from-slate-900/40 dark:to-slate-900/10 p-4 border-b border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center shadow-lg shadow-black/5 border border-slate-100 dark:border-slate-700 text-indigo-600 rotate-3 group-hover:rotate-0 transition-transform">
                        <AppIcon name="Filter" size={18} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-[15px] tracking-tight">Navigate</h3>
                        <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-1 pr-2 border-b-2 border-indigo-500/30 w-fit">by Category</p>
                    </div>
                </div>
            </div>

            {/* Filter Items - Scrollable on Mobile, List on Desktop */}
            <div className="p-2 lg:p-3 flex flex-row lg:flex-col gap-2 lg:gap-1.5 overflow-x-auto lg:overflow-x-visible no-scrollbar">
                {filterItems.map(item => {
                    const isActive = activeTab === item.id;
                    const count = getCategoryCount(item.id);

                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`group flex shrink-0 lg:w-full items-center justify-between p-2 lg:p-2.5 rounded-xl lg:rounded-2xl transition-all duration-300 ${isActive
                                ? 'bg-indigo-50/50 dark:bg-indigo-900/10 shadow-sm shadow-indigo-100 dark:shadow-none translate-x-0 lg:translate-x-1 border-indigo-200/30'
                                : 'bg-transparent border-transparent hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10'
                                } border-2`}
                        >
                            <div className="flex items-center gap-2.5 lg:gap-3.5">
                                <div className={`w-6 h-6 lg:w-7 lg:h-7 flex items-center justify-center rounded-lg lg:rounded-xl transition-all duration-300 ${isActive
                                    ? 'bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-lg shadow-indigo-200 dark:shadow-none scale-105 lg:scale-110 lg:rotate-3'
                                    : 'bg-indigo-50/50 dark:bg-indigo-900/10 text-slate-400 group-hover:scale-105 hover:text-indigo-600 dark:hover:text-indigo-400'
                                    }`}>
                                    <AppIcon
                                        name={item.icon}
                                        size={isActive ? 12 : 14}
                                        strokeWidth={2.5}
                                    />
                                </div>
                                <span className={`text-[12px] lg:text-[13px] font-bold transition-all whitespace-nowrap ${isActive
                                    ? 'text-indigo-600 dark:text-indigo-400'
                                    : 'text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200'
                                    }`}>
                                    {item.name}
                                </span>
                            </div>

                            {/* Count Badge - Hidden on very small screens if not active to save space */}
                            {count > 0 && (
                                <div className={`ml-2 lg:ml-0 flex items-center justify-center min-w-[20px] h-4.5 lg:min-w-[22px] lg:h-5 px-1.5 rounded-full text-[8px] lg:text-[9px] font-bold tracking-tight transition-all ${isActive
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-indigo-50/50 dark:bg-indigo-900/10 text-slate-500'
                                    }`}>
                                    {count}
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Footnote - Desktop Only */}
            <div className="hidden lg:block p-5 mt-2">
                <div className="bg-amber-50/50 dark:bg-amber-900/10 p-4 rounded-3xl border border-amber-100/50 dark:border-amber-900/20 relative overflow-hidden group/tip">
                    <div className="absolute top-0 right-0 p-2 opacity-10 group-hover/tip:rotate-12 transition-transform">
                        <AppIcon name="Zap" size={32} />
                    </div>
                    <div className="flex items-start gap-3 relative z-10">
                        <div className="p-1.5 bg-amber-500 rounded-lg text-white shadow-sm flex-shrink-0">
                            <AppIcon name="Lightbulb" size={14} fill="currentColor" />
                        </div>
                        <div>
                            <p className="text-[10px] text-amber-900/60 dark:text-amber-200/50 font-bold leading-relaxed">
                                Tip: Filters help you focus on specific modules instantly.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChecklistFilterSidebar;
