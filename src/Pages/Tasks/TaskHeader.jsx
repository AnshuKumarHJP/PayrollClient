import Button from '../../Library/Button';
import AppIcon from '../../Component/AppIcon';

const TaskHeader = ({ activeTask, navigate, isLoading, startWorking, onAction, elapsedTime, searchTerm, onSearchChange, isReviewer = false, isOperator = true }) => {
    const getPriorityStyles = (priority) => {
        switch (priority?.toLowerCase()) {
            case 'high': return 'bg-rose-50 text-rose-700 border-rose-200/50 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20';
            case 'medium': return 'bg-amber-50 text-amber-700 border-amber-200/50 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20';
            case 'low': return 'bg-emerald-50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20';
            default: return 'bg-slate-50 text-slate-700 border-slate-200/50 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20';
        }
    }

    const getStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
            case 'open': return 'bg-blue-50 text-blue-700 border-blue-200/50 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20';
            case 'in progress': return 'bg-indigo-50 text-indigo-700 border-indigo-200/50 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20';
            case 'review': return 'bg-purple-50 text-purple-700 border-purple-200/50 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20';
            case 'completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20';
            default: return 'bg-slate-50 text-slate-700 border-slate-200/50 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20';
        }
    }

    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-300">
            {/* Top Bar: Primary Info & Actions */}
            <div className="p-5 lg:p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                <div className="flex items-start gap-4">

                    <AppIcon
                        onClick={() => navigate('/tasks/my')}
                        name="ArrowLeftToLine" size={20}
                        className="mt-1 flex items-center justify-center  cursor-pointer" />

                    <div className="space-y-1.5 overflow-hidden shrink-0">
                        <div className="flex flex-wrap items-center gap-2.5">
                            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50">
                                <AppIcon name="ShieldCheck" size={12} className="text-indigo-600 dark:text-indigo-400" />
                                <span className="text-[10px] font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider whitespace-nowrap">Payroll Task</span>
                            </div>
                            <span className="text-slate-300 dark:text-slate-700 font-medium">/</span>
                            <span className="text-slate-500 dark:text-slate-400 text-[11px] font-semibold tracking-tight">ID: {activeTask?.id || '---'}</span>
                            {activeTask?.status && (
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase border ${getStatusStyles(activeTask.status)} shadow-sm`}>
                                    {activeTask.status}
                                </span>
                            )}
                        </div>
                        <h1 className="text-xl lg:text-2xl font-bold text-slate-800 dark:text-white tracking-tight leading-none whitespace-nowrap">
                            {activeTask?.title || 'Loading task...'}
                        </h1>
                    </div>
                </div>

                {/* SEARCH BAR CENTERED */}
                <div className="flex-1 max-w-xl mx-4 group hidden lg:block">
                    <div className="relative">
                        <AppIcon
                            name="Search"
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
                            size={16}
                        />
                        <input
                            type="text"
                            placeholder="Quick search records..."
                            value={searchTerm}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="w-full pl-11 pr-4 h-11 bg-slate-50 dark:text-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[13px] font-medium placeholder:text-slate-400 outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 dark:focus:border-indigo-500 transition-all font-semibold"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    <div className="flex items-center bg-slate-50 dark:bg-slate-800/50 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startWorking(activeTask)}
                            loading={isLoading}
                            icon={<AppIcon name="RefreshCcw" size={15} />}
                            className="text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-slate-800 rounded-lg py-2"
                        >
                            Sync
                        </Button>
                        <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                        <Button
                            variant="ghost"
                            size="sm"
                            icon={<AppIcon name="MoreHorizontal" size={16} />}
                            className="text-slate-500 hover:bg-white dark:hover:bg-slate-800 rounded-lg"
                        />
                    </div>

                    {isOperator && (
                        <Button
                            variant="primary"
                            size="md"
                            onClick={() => onAction('Submit')}
                            icon={<AppIcon name="FileUp" size={16} />}
                            className="font-bold px-6 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:translate-y-0.5"
                        >
                            Submit Task
                        </Button>
                    )}

                    {isReviewer && (
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="md"
                                onClick={() => onAction('Reject')}
                                icon={<AppIcon name="XCircle" size={16} />}
                                className="font-bold h-10 px-5 rounded-xl text-rose-600 border-rose-200 hover:bg-rose-50 hover:border-rose-300 transition-all"
                            >
                                Reject
                            </Button>
                            <Button
                                variant="primary"
                                size="md"
                                onClick={() => onAction('Approve')}
                                icon={<AppIcon name="CheckCircle2" size={16} />}
                                className="font-bold h-10 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 border-none shadow-lg shadow-emerald-200 dark:shadow-none transition-all"
                            >
                                Approve
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Bar: Metadata Context */}
            <div className="bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800/50 px-6 py-4">
                <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                    <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-blue-100/50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                            <AppIcon name="Database" size={14} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">Data Source</span>
                            <span className="text-[12px] font-bold text-slate-700 dark:text-slate-300 leading-none truncate max-w-[140px]">
                                {isLoading ? 'Scanning...' : (activeTask?.source || 'Default Sync')}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-amber-100/50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
                            <AppIcon name="Clock" size={14} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">Time Elapsed</span>
                            <span className="text-[12px] font-bold text-slate-700 dark:text-slate-300 leading-none font-mono tracking-wide">
                                {elapsedTime || '00:00:00'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-purple-100/50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400">
                            <AppIcon name="User" size={14} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">Requester</span>
                            <span className="text-[12px] font-bold text-slate-700 dark:text-slate-300 leading-none">
                                {activeTask?.requester || '---'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-indigo-100/50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                            <AppIcon name="Layers" size={14} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">Department</span>
                            <span className="text-[12px] font-bold text-slate-700 dark:text-slate-300 leading-none">
                                {activeTask?.dept || '---'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <div className={`p-1.5 rounded-lg border ${getPriorityStyles(activeTask?.priority)}`}>
                            <AppIcon name="AlertCircle" size={14} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">Priority</span>
                            <span className={`text-[12px] font-bold leading-none ${getPriorityStyles(activeTask?.priority).split(' ')[1]}`}>
                                {activeTask?.priority || '---'}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5 ml-auto">
                        <div className="p-1.5 rounded-lg bg-rose-100/50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400">
                            <AppIcon name="Calendar" size={14} />
                        </div>
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1 text-right">Deadline</span>
                            <span className="text-[12px] font-bold text-slate-700 dark:text-slate-300 leading-none">
                                {activeTask?.dueDate || '---'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TaskHeader;
