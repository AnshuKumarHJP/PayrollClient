import React from 'react';
import AppIcon from "../../../Component/AppIcon";

const ConfigHeader = ({ title, description, children }) => {
    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 p-6 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden">
            {/* Decorative Background Element */}
            <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-fuchsia-50/50 dark:from-fuchsia-900/5 to-transparent pointer-events-none" />

            <div className="relative z-10 flex items-center gap-5">
                <div className="relative">
                    <div className="p-3.5 bg-gradient-to-br from-fuchsia-500 to-fuchsia-700 rounded-2xl text-white shadow-lg shadow-fuchsia-500/20">
                        <AppIcon name="Settings2" size={24} />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full" />
                </div>

                <div>
                    <h1 className="text-2xl font-black text-slate-800 dark:text-slate-50 tracking-tight leading-none mb-2">
                        {title || "Checklist Engine"}
                    </h1>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-fuchsia-600 bg-fuchsia-50 dark:bg-fuchsia-900/20 px-2 py-0.5 rounded-full border border-fuchsia-100 dark:border-fuchsia-900/40">Configuration Master</span>
                        <p className="text-xs font-bold text-slate-400">
                            {description || "Architecting master task sequences for payroll operations."}
                        </p>
                    </div>
                </div>
            </div>

            <div className="relative z-10 flex items-center gap-3">
                {children}
            </div>
        </div>
    );
};

export default ConfigHeader;
