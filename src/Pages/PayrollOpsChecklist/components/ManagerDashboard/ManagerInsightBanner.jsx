import React from 'react';
import AppIcon from "../../../../Component/AppIcon";

const ManagerInsightBanner = ({ pendingCritical, pendingOverdue, onViewCritical }) => {
    // Only hide if BOTH are 0 (or undefined)
    if (!pendingCritical && !pendingOverdue) return null;
    if (pendingCritical === 0 && pendingOverdue === 0) return null;

    const isCritical = pendingCritical > 0;

    // Professional Color Configurations
    const styles = isCritical ? {
        wrapper: "bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900",
        iconBox: "bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-400",
        title: "text-rose-900 dark:text-rose-100",
        text: "text-rose-700 dark:text-rose-300",
        button: "bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-200 dark:shadow-none"
    } : {
        wrapper: "bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900",
        iconBox: "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400",
        title: "text-amber-900 dark:text-amber-100",
        text: "text-amber-700 dark:text-amber-300",
        button: "bg-amber-600 hover:bg-amber-700 text-white shadow-sm shadow-amber-200 dark:shadow-none"
    };

    return (
        <div className={`rounded-xl p-4 relative overflow-hidden mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${styles.wrapper}`}>

            {/* Content Section */}
            <div className="flex items-start gap-3 sm:gap-4 w-full">
                <div className={`p-2 sm:p-2.5 rounded-lg shrink-0 ${styles.iconBox}`}>
                    <AppIcon name={isCritical ? "AlertOctagon" : "AlertTriangle"} size={20} className="sm:w-6 sm:h-6" />
                </div>

                <div className="flex-1">
                    <h3 className={`text-sm sm:text-base font-bold leading-tight mb-1 ${styles.title}`}>
                        {isCritical ? "Critical Attention Required" : "Action Needed: Overdue Tasks"}
                    </h3>
                    <p className={`text-xs sm:text-sm leading-snug ${styles.text}`}>
                        {isCritical
                            ? `You have ${pendingCritical} critical tasks pending that require immediate action.`
                            : `There are ${pendingOverdue} overdue tasks. Please review the team's progress.`}
                    </p>
                </div>
            </div>

            {/* Action Button */}
            <button
                onClick={onViewCritical}
                className={`w-full sm:w-auto px-4 py-2.5 sm:py-2 rounded-lg text-sm font-semibold transition-all active:scale-95 whitespace-nowrap shrink-0 flex items-center justify-center gap-2 ${styles.button}`}
            >
                {isCritical ? "Review Critical" : "Review Overdue"}
                <AppIcon name="ArrowRight" size={16} className="sm:hidden" />
            </button>
        </div>
    );
};


export default ManagerInsightBanner;
