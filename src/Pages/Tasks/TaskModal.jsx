import React from 'react';
import AppIcon from '../../Component/AppIcon';
import Modal from '../../Component/Modal';

const TaskModal = ({ isOpen, onClose, tasks, selectedTaskForAssign, users, userSearchTerm, setUserSearchTerm, assignTaskToUser }) => {
  const task = tasks.find(t => t.id === selectedTaskForAssign);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      Header={() => (
        <div className="flex flex-col w-full px-6 py-2 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg">
              <AppIcon name="UserPlus" className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">Assign Task</h3>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm ml-12">
            Select a team member to handle this request.
          </p>
        </div>
      )}
      Body={() => (
        <div className="flex flex-col gap-6 p-6 bg-slate-50/50 dark:bg-slate-900/50">
          {/* Task Context Card */}
          {task && (
            <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm relative overflow-hidden group">
              {/* Decorative Stripe */}
              <div className={`absolute top-0 left-0 w-1 h-full ${task.priority === 'Critical' ? 'bg-rose-500' :
                task.priority === 'High' ? 'bg-orange-500' :
                  task.priority === 'Medium' ? 'bg-amber-400' : 'bg-emerald-400'
                }`}></div>

              <div className="pl-3">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 mb-1 block">Selected Task</span>
                    <h4 className="font-bold text-slate-900 dark:text-white text-base leading-snug">{task.title}</h4>
                  </div>
                  <span className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-xs font-mono text-slate-500 border border-slate-200 dark:border-slate-600">
                    #{task.id}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
                  <div className="flex items-center gap-2">
                    <AppIcon name="AlertCircle" className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-500 dark:text-slate-400 text-xs">Priority:</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${task.priority === 'Critical' ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400' :
                      task.priority === 'High' ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' :
                        task.priority === 'Medium' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' :
                          'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                      }`}>{task.priority}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AppIcon name="Calendar" className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-500 dark:text-slate-400 text-xs">Due:</span>
                    <span className={`text-xs font-medium ${task.overdueDays > 0 ? 'text-rose-500' : 'text-slate-700 dark:text-slate-200'}`}>
                      {task.dueDate}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* User Selection Section */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-200">Available Members</label>
              <span className="text-xs text-slate-400">{users.length} users found</span>
            </div>

            <div className="relative group focus-within:ring-2 ring-indigo-500/10 rounded-xl transition-all">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <AppIcon name="Search" size={18} />
              </div>
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={userSearchTerm}
                onChange={(e) => setUserSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border-none shadow-sm rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-0"
              />
            </div>

            <div className="grid gap-2 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
              {users
                .filter(user =>
                  user.name.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
                  String(user.id).includes(userSearchTerm)
                )
                .map((user) => (
                  <button
                    key={user.id}
                    onClick={() => assignTaskToUser(user.id)}
                    className="group w-full flex items-center gap-4 p-3 bg-white dark:bg-slate-800 rounded-xl border border-transparent hover:border-indigo-500 dark:hover:border-indigo-400 hover:shadow-md transition-all duration-200 text-left relative overflow-hidden"
                  >
                    {/* Hover highlight stripe */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                    <div className="relative">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-slate-100 dark:border-slate-700 group-hover:border-indigo-100 dark:group-hover:border-indigo-900 transition-colors"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full" title="Available"></div>
                    </div>

                    <div className="flex-1">
                      <span className="text-sm font-bold text-slate-800 dark:text-white block group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {user.name}
                      </span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <AppIcon name="Hash" size={10} />
                        {user.id}
                      </span>
                    </div>

                    <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900 group-hover:text-indigo-600 transition-all">
                      <AppIcon name="ArrowRight" size={16} />
                    </div>
                  </button>
                ))}

              {users.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  <p>No users found matching "{userSearchTerm}"</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      Footer={() => (
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>
      )}
    />
  );
};

export default TaskModal;
