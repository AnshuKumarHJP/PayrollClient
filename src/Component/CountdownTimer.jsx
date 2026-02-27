import { useEffect, useState } from "react";
import AppIcon from "./AppIcon";

const CountdownTimer = ({ dueDate, status }) => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    if (!dueDate) return null;

    let due;
    if (dueDate.includes('-')) {
        const parts = dueDate.split('-');
        if (parts.length === 3) {
            const [y, m, d] = parts.map(Number);
            if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
                due = new Date(y, m - 1, d);
            }
        }
    }
    if (!due || isNaN(due.getTime())) due = new Date(dueDate);
    if (isNaN(due.getTime())) return null;

    due.setHours(23, 59, 59, 999);

    const diff = due - currentTime;
    const isPast = diff < 0;
    const absDiff = Math.abs(diff);

    const days = Math.floor(absDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((absDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((absDiff % (1000 * 60)) / 1000);

    if (status === 'completed') {
        return (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-md w-fit border border-emerald-100 dark:border-emerald-800">
                <AppIcon name="CheckCircle" size={10} />
                Completed
            </span>
        );
    }

    if (isPast) {
        return (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-900/20 px-2 py-0.5 rounded-md w-fit border border-rose-100 dark:border-rose-800 animate-pulse">
                <AppIcon name="AlertCircle" size={10} />
                Overdue by {days}d {hours}h {minutes}m {seconds}s
            </span>
        );
    }

    // Critical: Less than 3 days (Red)
    if (days < 1) {
        return (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-900/20 px-2 py-0.5 rounded-md w-fit border border-rose-100 dark:border-rose-800">
                <AppIcon name="AlertTriangle" size={10} />
                Critical: {days}d {hours}h {minutes}m {seconds}s left
            </span>
        );
    }

    // Warning: Less than 7 days (Amber)
    if (days < 7) {
        return (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-md w-fit border border-amber-100 dark:border-amber-800">
                <AppIcon name="Clock" size={10} />
                Due Soon: {days}d {hours}h {minutes}m {seconds}s
            </span>
        );
    }

    // Safe (Indigo)
    return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded-md w-fit border border-indigo-100 dark:border-indigo-800">
            <AppIcon name="Hourglass" size={10} />
            {days}d {hours}h {minutes}m {seconds}s remaining
        </span>
    );
};
export default CountdownTimer;