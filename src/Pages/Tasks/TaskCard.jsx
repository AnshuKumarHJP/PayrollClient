import React from 'react';
import AppIcon from '../../Component/AppIcon';

const TaskCard = ({ task, onClaim, onAssign, onStatusChange, onRelease, onWork, personalView = false, canClaim = true, canAssign = true }) => {

  // Helpers
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'text-rose-600 bg-rose-50 border-rose-200 dark:text-rose-400 dark:bg-rose-900/20 dark:border-rose-800/50';
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-200 dark:text-orange-400 dark:bg-orange-900/20 dark:border-orange-800/50';
      case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-200 dark:text-amber-400 dark:bg-amber-900/20 dark:border-amber-800/50';
      default: return 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/20 dark:border-emerald-800/50';
    }
  };

  const getPriorityDot = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]';
      case 'High': return 'bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]';
      case 'Medium': return 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]';
      default: return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]';
    }
  };

  return (
    <div className="group bg-white dark:bg-slate-800/90 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-indigo-200 dark:hover:border-indigo-500/40 transition-all duration-300 flex flex-col relative overflow-hidden">

      {/* Top Header Section */}
      <div className="p-5 pb-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            {/* Minimalist Priority Badge */}
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getPriorityColor(task.priority)}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${getPriorityDot(task.priority)}`}></span>
              {task.priority}
            </span>

            {/* Clean Form Name */}
            {task.formName && (
              <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 uppercase tracking-widest">
                {task.formName}
              </span>
            )}
          </div>

          <span className="text-[12px] font-mono font-semibold text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 transition-colors">
            #{task.id}
          </span>
        </div>

        {/* Title & Description */}
        <h3
          onClick={() => onWork && onWork(task.id)}
          className="font-semibold text-slate-900 dark:text-slate-100 text-[16px] leading-snug mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors cursor-pointer line-clamp-2"
        >
          {task.title}
        </h3>

        <p className="text-slate-500 dark:text-slate-400 text-[13px] line-clamp-1 mb-4">
          {task.description}
        </p>

        {/* Inline Meta Info */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-slate-500 dark:text-slate-400 font-medium">
          <div className="flex items-center gap-1.5">
            <AppIcon name="Clock" size={14} className="opacity-70" />
            <span>{task.estimate} est.</span>
          </div>
          <div className="flex items-center gap-1.5">
            <AppIcon name="Calendar" size={14} className={task.overdueDays > 0 ? "text-rose-500" : "opacity-70"} />
            <span className={task.overdueDays > 0 ? 'text-rose-600 dark:text-rose-400 font-semibold' : ''}>Due {task.dueDate}</span>
          </div>
          {(task.attachments > 0 || task.comments > 0) && (
            <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600 hidden sm:block"></div>
          )}
          {task.attachments > 0 && (
            <div className="flex items-center gap-1">
              <AppIcon name="Paperclip" size={13} className="opacity-70" /> {task.attachments}
            </div>
          )}
          {task.comments > 0 && (
            <div className="flex items-center gap-1">
              <AppIcon name="MessageSquare" size={13} className="opacity-70" /> {task.comments}
            </div>
          )}
        </div>
      </div>

      {/* Slim Progress Bar */}
      {task.progress > 0 && (
        <div className="px-5 pb-5 mt-auto">
          <div className="w-full bg-slate-100 dark:bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-1000 ease-out relative ${task.progress === 100 ? 'bg-emerald-500' : task.progress > 50 ? 'bg-indigo-500' : 'bg-blue-500'}`}
              style={{ width: `${task.progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Unified Minimal Footer */}
      <div className="p-4 px-5 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between mt-auto">

        {/* Left: Avatar / Assigment */}
        <div className="flex items-center">
          {task.assignees?.length > 0 ? (
            <div className="flex items-center">
              <div className="flex -space-x-2">
                {task.assignees.map((avatar, idx) => (
                  <div key={idx} className="relative z-0">
                    <img
                      src={avatar}
                      className="w-7 h-7 rounded-full border-2 border-white dark:border-slate-800 object-cover"
                      alt="Assignee"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[12px] font-medium text-slate-400 dark:text-slate-500">
              <div className="w-6 h-6 rounded-full bg-slate-200/50 dark:bg-slate-700/50 flex items-center justify-center border border-dashed border-slate-300 dark:border-slate-600">
                <AppIcon name="User" size={10} className="opacity-50" />
              </div>
              Unassigned
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {!personalView ? (
            <div className="flex items-center gap-2">
              {canAssign && (
                <button
                  onClick={(e) => { e.stopPropagation(); onAssign && onAssign(task.id); }}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                  title="Delegate Task"
                >
                  <AppIcon name="UserPlus" size={16} />
                </button>
              )}
              {canClaim && (
                <button
                  onClick={(e) => { e.stopPropagation(); onClaim && onClaim(task.id); }}
                  className="h-8 px-4 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-[12px] font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5"
                >
                  Pick Up
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 mr-1">
                {canAssign && (
                  <button onClick={(e) => { e.stopPropagation(); onAssign && onAssign(task.id); }} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors" title="Re-assign">
                    <AppIcon name="Users" size={16} />
                  </button>
                )}
                {task.status !== 'Completed' && (
                  <button onClick={(e) => { e.stopPropagation(); onRelease && onRelease(task.id); }} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-lg transition-colors" title="Release">
                    <AppIcon name="LogOut" size={16} />
                  </button>
                )}
              </div>
              <button onClick={(e) => { e.stopPropagation(); onWork && onWork(task.id); }} className="h-8 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-[12px] font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5">
                {task.status === 'Open' ? 'Start' : 'Pick Up'}
                <AppIcon name="ArrowRight" size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
