import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AppIcon from '../../../Component/AppIcon';
import GlassCard from './GlassCard';
import { CHECKLIST_COMPLEXITY, CHECKLIST_CATEGORY_ICONS, CHECKLIST_CATEGORY_THEMES } from '../../../Data/StaticData';
import PaginationAdvance from '../../../Library/Table/PaginationAdvance';

const AssignmentOverview = ({ selectedClient, mappedTemplateIds, templates, onToggle }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(6);

    const assignedTemplates = templates.filter(t => mappedTemplateIds.includes(String(t.id)));
    const totalPages = Math.ceil(assignedTemplates.length / rowsPerPage);

    const paginatedTemplates = assignedTemplates.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    // Reset page if filters or client changes
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedClient, mappedTemplateIds.length]);

    return (
        <div className="space-y-6">
            {/* Summary header */}
            <GlassCard className="p-6">
                <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 sm:gap-4">
                    <div className="min-w-0 flex-1">
                        <h3 className="text-base lg:text-md font-semibold text-slate-800 dark:text-white uppercase italic tracking-tight truncate">{selectedClient?.name} Configuration Hub</h3>
                        <p className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1.5 leading-relaxed">
                            {mappedTemplateIds.length} ACTIVE MODULES
                            <span className="mx-2 opacity-20 hidden sm:inline">|</span>
                            <br className="sm:hidden" />
                            {assignedTemplates.reduce((s, t) => s + t.tasksCount, 0)} TOTAL OPERATIONAL NODES
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Environment Coverage</div>
                            <div className="text-base sm:text-lg font-bold text-indigo-600 dark:text-indigo-400 leading-none mt-1">
                                {templates.length > 0 ? Math.round((mappedTemplateIds.length / templates.length) * 100) : 0}%
                            </div>
                        </div>
                        <div className="size-10 sm:size-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-inner">
                            <AppIcon name="Activity" size={20} className="sm:size-6" />
                        </div>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4 sm:mt-6 h-2 bg-slate-100/50 dark:bg-slate-800/50 rounded-full overflow-hidden border border-slate-50 dark:border-slate-800">
                    <motion.div
                        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${templates.length > 0 ? (mappedTemplateIds.length / templates.length) * 100 : 0}%` }}
                        transition={{ duration: 1, ease: "circOut" }}
                    />
                </div>
            </GlassCard>

            {/* Assigned templates list */}
            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {paginatedTemplates.map((template, i) => {
                        const theme = CHECKLIST_CATEGORY_THEMES[template.category] || CHECKLIST_CATEGORY_THEMES.Offboarding;
                        const catIcon = CHECKLIST_CATEGORY_ICONS[template.category] || "Layers";
                        const complexity = CHECKLIST_COMPLEXITY[template.complexity] || CHECKLIST_COMPLEXITY.Medium;
                        return (
                            <motion.div
                                key={template.id}
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <GlassCard className="flex items-center gap-3 sm:gap-5 p-4 sm:p-5 hover:border-indigo-100 dark:hover:border-indigo-500/30 transition-all group overflow-hidden">
                                    <div className={`relative size-8 sm:size-10 rounded-lg ${theme.bg} ${theme.border} border flex items-center justify-center shrink-0 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                                        <AppIcon name={catIcon} size={18} className="text-white/90" />
                                        <div className={`absolute -bottom-1.5 -right-1.5 px-1.5 h-4 min-w-[1.5rem] rounded-md ${theme.bg} border-2 border-white dark:border-slate-900 flex items-center justify-center shadow-md`}>
                                            <span className="text-[7px] sm:text-[8px] font-black uppercase text-white tracking-tighter truncate max-w-[40px]">
                                                {template.category.slice(0, 2).toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="text-[11px] sm:text-[13px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-tight truncate">{template.title}</h4>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1.5">
                                                <span className={`size-1.5 rounded-full ${complexity.dot}`} />
                                                <span className={`text-[10px] sm:text-[11px] font-bold uppercase tracking-widest ${complexity.text}`}>
                                                    {template.complexity}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500">
                                                <AppIcon name="Cpu" size={12} />
                                                <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-tighter">
                                                    {template.tasksCount} Nodes
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onToggle(template);
                                        }}
                                        className="shrink-0 size-9 rounded-xl bg-slate-50  dark:bg-slate-800 hover:bg-rose-500 dark:hover:bg-rose-600 hover:text-white text-red-300 dark:text-slate-600 flex items-center justify-center transition-all border border-slate-100 dark:border-slate-700 hover:border-rose-500 dark:hover:border-rose-600 group-hover:shadow-lg active:scale-95"
                                    >
                                        <AppIcon name="Trash2" size={16} />
                                    </button>
                                </GlassCard>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Pagination */}
                {assignedTemplates.length > 0 && (
                    <div className="pt-2">
                        <PaginationAdvance
                            count={totalPages}
                            page={currentPage}
                            rowsPerPage={rowsPerPage}
                            onChangePage={setCurrentPage}
                            onChangePageSize={setRowsPerPage}
                            rowsPerPageOptions={[6, 12, 18, 24]}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssignmentOverview;
