import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchPayrollOpsTasks } from "../Store/Slices/ChecklistSlice";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AppIcon from "../Component/AppIcon";

const NotificationBanner = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchPayrollOpsTasks());
    }, [dispatch]);

    const tasks = useSelector((state) => state.ChecklistStore?.tasks || []);

    const [visibleTaskIds, setVisibleTaskIds] = useState([]);
    const [isPaused, setIsPaused] = useState(false);

    // Ref to track previous tasks for detecting new ones
    // Initialize with empty to detect existing tasks as "new" on mount (but we'll limit them)
    // Actually, initializing with current tasks avoids spamming ALL existing tasks if we only want "pending" ones on load?
    // User wants "show only pending tasks". So we treat existing pending tasks as "to be notified".
    const prevTasksRef = useRef([]);
    const isFirstRun = useRef(true);

    const addNotification = (task) => {
        const uniqueId = Date.now() + Math.random();
        const newTask = {
            id: task.id,
            uniqueId,
            title: task.title,
            message: `Due: ${task.dueDate} • Assignee: ${task.assignee}`,
            type: task.priority === 'critical' ? 'critical' : task.priority === 'high' ? 'warning' : 'info',
            route: "/ops/checklist",
            icon: "CheckSquare"
        };

        setVisibleTaskIds((prev) => {
            const updated = [...prev, newTask];
            if (updated.length > 3) return updated.slice(updated.length - 3);
            return updated;
        });

        setTimeout(() => {
            removeTask(uniqueId);
        }, 6000);
    };

    useEffect(() => {
        const currentTasks = tasks;
        const prevTasks = prevTasksRef.current;

        // Find tasks that are in current but not in prev (by ID)
        const addedTasks = currentTasks.filter(t => !prevTasks.find(pt => pt.id === t.id));

        if (addedTasks.length > 0) {
            // Filter for pending status
            const relevantNewTasks = addedTasks.filter(t => t.status === 'pending');

            if (isFirstRun.current) {
                // On first run (page load), limit to 3 to avoid spam
                relevantNewTasks.slice(0, 3).forEach((task, index) => {
                    setTimeout(() => addNotification(task), index * 1000);
                });
                isFirstRun.current = false;
            } else {
                // For subsequent updates (user added task), show all new ones
                relevantNewTasks.forEach(task => addNotification(task));
            }
        }

        prevTasksRef.current = currentTasks;
    }, [tasks]);

    const removeTask = (uniqueId) => {
        setVisibleTaskIds(prev => prev.filter(t => t.uniqueId !== uniqueId));
    };

    const handleClick = (route) => {
        if (route) navigate(route);
    };

    const getStyles = (type) => {
        switch (type) {
            case 'critical':
                return {
                    container: "bg-white dark:bg-slate-800 border-l-4 border-rose-500",
                    iconBg: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
                    shadow: "shadow-rose-500/10",
                    badge: "bg-rose-500 text-white"
                };
            case 'warning':
                return {
                    container: "bg-white dark:bg-slate-800 border-l-4 border-amber-500",
                    iconBg: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
                    shadow: "shadow-amber-500/10",
                    badge: "bg-amber-500 text-white"
                };
            case 'success':
                return {
                    container: "bg-white dark:bg-slate-800 border-l-4 border-emerald-500",
                    iconBg: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
                    shadow: "shadow-emerald-500/10",
                    badge: "bg-emerald-500 text-white"
                };
            case 'neutral':
                return {
                    container: "bg-white dark:bg-slate-800 border-l-4 border-slate-500",
                    iconBg: "bg-slate-100 text-slate-600 dark:bg-slate-900/30 dark:text-slate-400",
                    shadow: "shadow-slate-500/10",
                    badge: "bg-slate-500 text-white"
                };
            case 'info':
            default:
                return {
                    container: "bg-white dark:bg-slate-800 border-l-4 border-blue-500",
                    iconBg: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
                    shadow: "shadow-blue-500/10",
                    badge: "bg-blue-500 text-white"
                };
        }
    };

    return (
        <div
            className="fixed bottom-8 right-8 z-[100] flex flex-col items-end pointer-events-none gap-4 w-full max-w-sm"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <AnimatePresence mode="popLayout">
                {visibleTaskIds.map((task) => {
                    const style = getStyles(task.type);

                    return (
                        <motion.div
                            key={task.uniqueId}
                            layout
                            initial={{ opacity: 0, x: 100, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            className="pointer-events-auto w-full cursor-pointer group relative"
                            onClick={() => handleClick(task.route)}
                        >
                            {/* Glow Effect behind the card */}
                            <div className={`absolute inset-0 rounded-xl blur-lg opacity-20 transition-opacity group-hover:opacity-40 ${style.shadow.replace('shadow-', 'bg-')}`}></div>

                            <div className={`
                                relative overflow-hidden rounded-r-xl rounded-l-md shadow-xl ${style.shadow} ${style.container}
                                transition-all duration-300 transform group-hover:-translate-x-1 group-hover:-translate-y-1
                            `}>
                                <div className="p-4 flex gap-4 items-center">

                                    {/* Animated Icon */}
                                    <div className={`p-3 rounded-full shrink-0 ${style.iconBg} relative overflow-hidden group-hover:scale-110 transition-transform duration-300`}>
                                        <AppIcon name={task.icon} size={24} strokeWidth={2.5} />
                                        {/* Shine effect on icon */}
                                        <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-tight tracking-tight">
                                                {task.title}
                                            </h4>
                                            <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-full ${style.badge} opacity-90`}>
                                                {task.type === 'neutral' ? 'System' : task.type}
                                            </span>
                                        </div>
                                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 leading-snug line-clamp-2">
                                            {task.message}
                                        </p>
                                    </div>

                                    {/* Action Arrow */}
                                    <div className="text-slate-300 group-hover:text-slate-500 dark:text-slate-600 dark:group-hover:text-slate-400 transition-colors">
                                        <AppIcon name="ChevronRight" size={18} />
                                    </div>
                                </div>

                                {/* Progress Bar (Visual Timer) */}
                                <motion.div
                                    initial={{ width: "100%" }}
                                    animate={{ width: "0%" }}
                                    transition={{ duration: 6, ease: "linear" }}
                                    className={`absolute bottom-0 left-0 h-1 ${style.badge}`}
                                />
                            </div>

                            {/* Close Button Bubble */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeTask(task.uniqueId);
                                }}
                                className="absolute -top-2 -right-2 bg-white dark:bg-slate-700 text-slate-400 hover:text-red-500 shadow-md p-1 rounded-full opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 border border-slate-100 dark:border-slate-600 z-10"
                            >
                                <AppIcon name="X" size={12} />
                            </button>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
};

export default NotificationBanner;
