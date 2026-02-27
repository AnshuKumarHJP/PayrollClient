import React from 'react';
import { motion } from 'framer-motion';
import AppIcon from '../../../Component/AppIcon';
import GlassCard from './GlassCard';
import { CHECKLIST_COMPLEXITY, CHECKLIST_CATEGORY_THEMES, CHECKLIST_RISK_CONFIG, CHECKLIST_CATEGORY_ICONS } from '../../../Data/StaticData';

const TemplateCard = ({ template, isMapped, onToggle, isLoading }) => {
    const complexity = CHECKLIST_COMPLEXITY[template.complexity] || CHECKLIST_COMPLEXITY.Medium;
    const theme = CHECKLIST_CATEGORY_THEMES[template.category] || CHECKLIST_CATEGORY_THEMES.Offboarding;
    const catGrad = CHECKLIST_CATEGORY_THEMES[template.category]?.bg || "bg-slate-500";
    const catIcon = CHECKLIST_CATEGORY_ICONS[template.category] || "Layers";
    const risk = CHECKLIST_RISK_CONFIG[template.riskLevel] || CHECKLIST_RISK_CONFIG.Low;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
        >
            <GlassCard
                className={`overflow-hidden group rounded-lg transition-all duration-300 ${isMapped
                    ? "ring-2 ring-indigo-400/50 shadow-[0_0_0_4px_rgba(99,102,241,0.08)] bg-white"
                    : "hover:border-indigo-200"
                    }`}
            >
                {/* Top accent bar */}
                <div className={`h-1 w-full bg-gradient-to-r ${catGrad} ${isMapped ? "opacity-100" : "opacity-30 group-hover:opacity-100"} transition-opacity duration-300`} />

                <div className="p-6">
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex flex-wrap gap-2">
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${complexity.bg} ${complexity.border} border`}>
                                <span className={`size-1.5 rounded-full ${complexity.dot}`} />
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${complexity.text}`}>{template.complexity || 'Medium'}</span>
                            </div>
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${risk.bg} border border-transparent`}>
                                <AppIcon name={risk.icon} size={10} className={risk.text} />
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${risk.text}`}>{template.riskLevel} Risk</span>
                            </div>
                        </div>
                        {isMapped && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className={`flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full shadow-lg shadow-emerald-500/20`}
                            >
                                <div className="size-1.5 rounded-full bg-white animate-pulse" />
                                <span className="text-[9px] font-bold text-white uppercase tracking-[0.1em]">Active</span>
                            </motion.div>
                        )}
                    </div>

                    {/* Category tag */}
                    <div className="mb-2.5 flex items-center justify-between">
                        <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${theme.text}`}>
                            {template.category}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tight">
                            <AppIcon name="RefreshCw" size={10} />
                            {template.recurrenceType}
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm sm:text-base lg:text-[17px] font-bold text-slate-800 dark:text-white leading-tight mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {template.title}
                    </h3>

                    {/* Description */}
                    <p className="text-[11px] sm:text-[12px] text-slate-400 dark:text-slate-500 font-medium leading-relaxed line-clamp-2 mb-2 h-9 sm:h-10">
                        {template.description}
                    </p>

                    {/* Operational Metadata */}
                    <div className="grid grid-cols-2 gap-3 mb-2">
                        <div className="bg-slate-50/80 dark:bg-slate-800/50 rounded-xl p-2 sm:p-2.5 border border-slate-100 dark:border-slate-700/50 group-hover:bg-indigo-50/50 dark:group-hover:bg-indigo-500/10 group-hover:border-indigo-100/50 dark:group-hover:border-indigo-500/20 transition-all">
                            <div className="text-[8px] sm:text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Time Estimate</div>
                            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold text-[11px] sm:text-[12px]">
                                <AppIcon name="Clock" size={12} className="text-indigo-500" />
                                {template.estimatedTime}
                            </div>
                        </div>
                        <div className="bg-slate-50/80 dark:bg-slate-800/50 rounded-xl p-2 sm:p-2.5 border border-slate-100 dark:border-slate-700/50 group-hover:bg-indigo-50/50 dark:group-hover:bg-indigo-500/10 group-hover:border-indigo-100/50 dark:group-hover:border-indigo-500/20 transition-all">
                            <div className="text-[8px] sm:text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Ownership</div>
                            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold text-[11px] sm:text-[12px] truncate">
                                <AppIcon name={template.assigneeType === 'role' ? 'Users' : 'User'} size={12} className="text-indigo-500" />
                                {template.assignee}
                            </div>
                        </div>
                    </div>

                    {/* Tags */}
                    {template.tags && template.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                            {template.tags.map(tag => (
                                <span key={tag} className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 text-[9px] font-bold uppercase tracking-wider">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100/80 dark:border-slate-700/80">
                        <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                            <AppIcon name="Layers" size={14} />
                            <span className="text-[11px] font-bold uppercase tracking-widest">Workflow Unit</span>
                        </div>

                        <button
                            onClick={() => onToggle(template)}
                            disabled={isLoading}
                            className={`
                relative px-6 py-2 rounded-md text-[11px] font-bold uppercase tracking-[0.15em]
                transition-all duration-300 active:scale-95 disabled:opacity-50 overflow-hidden
                ${isMapped
                                    ? "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-rose-500 dark:hover:bg-rose-600 hover:text-white border border-slate-200 dark:border-slate-700 hover:border-rose-500 dark:hover:border-rose-600"
                                    : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-[0_4px_12px_rgba(79,70,229,0.3)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_20px_rgba(79,70,229,0.4)]"
                                }
              `}
                        >
                            <span className="relative z-10">{isMapped ? "Remove" : "Release"}</span>
                        </button>
                    </div>
                </div>
            </GlassCard>
        </motion.div>
    );
};

export default TemplateCard;
