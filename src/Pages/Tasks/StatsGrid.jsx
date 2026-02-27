import React from 'react';
import AppIcon from '../../Component/AppIcon';

const StatsGrid = ({ stats, key }) => (
  <div key={key} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
    {stats.map((stat, index) => {
      // Map to extract simple color string for gradients
      const themeColor = stat.bg.includes('indigo') ? 'from-indigo-500/10 to-indigo-500/5' :
        stat.bg.includes('amber') ? 'from-amber-500/10 to-amber-500/5' :
          stat.bg.includes('blue') ? 'from-blue-500/10 to-blue-500/5' :
            stat.bg.includes('emerald') ? 'from-emerald-500/10 to-emerald-500/5' : 'from-rose-500/10 to-rose-500/5';

      return (
        <div key={index} className="relative bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group overflow-hidden">
          {/* Subtle Background Glow */}
          <div className={`absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-br ${themeColor} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none`}></div>

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} dark:bg-slate-700 group-hover:scale-110 transition-transform duration-300 shadow-sm ring-4 ring-white dark:ring-slate-800`}>
                <AppIcon name={stat.icon} className="w-5 h-5" strokeWidth={2.5} />
              </div>
              {stat.trendUp !== null && (
                <div className={`flex items-center gap-1 text-[11px] font-bold px-2 py-1.5 rounded-full shadow-sm ${stat.trendUp ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'}`}>
                  {stat.trendUp ? '+' : ''}{stat.trend}
                  <AppIcon name={stat.trendUp ? 'TrendingUp' : 'TrendingDown'} size={12} strokeWidth={3} />
                </div>
              )}
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-[12px] font-bold uppercase tracking-wider mb-1">{stat.title}</p>
              <h3 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight leading-none">{stat.value}</h3>
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

export default StatsGrid;
