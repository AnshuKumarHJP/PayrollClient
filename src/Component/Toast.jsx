import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppIcon from './AppIcon';

/**
 * A premium, glassmorphism-inspired Toast component.
 * 
 * @param {string} message - The message to display
 * @param {('success'|'warning'|'error'|'info'|'notification'|'loading')} type - The visual style of the toast
 * @param {boolean} isVisible - Control visibility from parent
 * @param {function} onClose - Callback to reset visibility in parent
 * @param {number} duration - Auto-dismiss timeout in ms
 */
const Toast = ({ message, type = 'success', isVisible, onClose, duration = 5000 }) => {
    useEffect(() => {
        if (isVisible && type !== 'loading') {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose, duration, type]);

    const variants = {
        success: {
            container: "bg-white/95 dark:bg-slate-900/95 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20 ring-4 ring-emerald-500/5",
            iconBg: "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
            icon: "CheckCircle2"
        },
        warning: {
            container: "bg-white/95 dark:bg-slate-900/95 text-amber-700 dark:text-amber-400 border-amber-100 dark:border-amber-500/20 ring-4 ring-amber-500/5",
            iconBg: "bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400",
            icon: "AlertTriangle"
        },
        error: {
            container: "bg-white/95 dark:bg-slate-900/95 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-500/20 ring-4 ring-rose-500/5",
            iconBg: "bg-rose-100 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400",
            icon: "XCircle"
        },
        info: {
            container: "bg-white/95 dark:bg-slate-900/95 text-indigo-700 dark:text-indigo-400 border-indigo-100 dark:border-indigo-500/20 ring-4 ring-indigo-500/5",
            iconBg: "bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
            icon: "Info"
        },
        notification: {
            container: "bg-white/95 dark:bg-slate-900/95 text-sky-700 dark:text-sky-400 border-sky-100 dark:border-sky-500/20 ring-4 ring-sky-500/5",
            iconBg: "bg-sky-100 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400",
            icon: "Bell"
        },
        loading: {
            container: "bg-white/95 dark:bg-slate-900/95 text-violet-700 dark:text-violet-400 border-violet-100 dark:border-violet-500/20 ring-4 ring-violet-500/5",
            iconBg: "bg-violet-100 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400",
            icon: "Loader2",
            iconClass: "animate-spin"
        }
    };

    const current = variants[type] || variants.success;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: -20, x: "-50%" }}
                    animate={{ opacity: 1, y: 0, x: "-50%" }}
                    exit={{ opacity: 0, y: -20, x: "-50%" }}
                    className="fixed top-4 sm:top-8 left-1/2 z-[9999] pointer-events-none w-[calc(100%-32px)] sm:w-auto max-w-md"
                >
                    <div className={`
                        flex items-center gap-2.5 sm:gap-3.5 px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl sm:rounded-[22px] shadow-[0_20px_50px_rgba(0,0,0,0.1)] 
                        text-xs sm:text-sm font-bold border backdrop-blur-xl pointer-events-auto transition-all
                        ${current.container}
                    `}>
                        <div className={`
                            size-6 sm:size-7 shrink-0 rounded-lg sm:rounded-xl flex items-center justify-center
                            ${current.iconBg}
                        `}>
                            <AppIcon
                                name={current.icon}
                                size={14}
                                className={`sm:hidden ${current.iconClass || ''}`}
                            />
                            <AppIcon
                                name={current.icon}
                                size={16}
                                className={`hidden sm:block ${current.iconClass || ''}`}
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <span className="tracking-tight leading-snug block break-words">{message}</span>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Toast;
