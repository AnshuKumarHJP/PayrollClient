import React, { useState, useEffect } from 'react';
import AppIcon from "../../../Component/AppIcon";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../Library/Select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../../../Library/Popover";
import SimpleCalendar from "../../../Component/SimpleCalendar";
import { Switch } from "../../../Library/Switch";
import { ClientPortalWorkflowStatus } from "../../../Data/StaticData";

const TaskForm = ({ initialData, tasks = [], categories, users, roles, forms, workflows, onSubmit, onCancel, selectedPayrollMonth }) => {
    const defaults = {
        title: '',
        description: '',
        category: categories[0]?.id || '',
        parentId: null,
        priority: 'medium',
        dueDate: selectedPayrollMonth ? `${selectedPayrollMonth.year}-${String(selectedPayrollMonth.month).padStart(2, '0')}-01` : '',
        assigneeType: 'user',
        assignee: '',
        recurrenceType: 'once',
        recurrenceDay: null,
        recurrenceWeekDays: [],
        reminderDays: 0,
        autoAssign: false,
        formId: null,
        workflowId: null
    };

    const [data, setData] = useState({ ...defaults, ...initialData });

    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    useEffect(() => {
        if (initialData) {
            setData(prev => ({
                ...defaults,
                ...initialData,
                dueDate: initialData.dueDate ? (initialData.dueDate.includes('T') ? initialData.dueDate.split('T')[0] : initialData.dueDate) : defaults.dueDate,
                assigneeType: initialData.assigneeType?.toLowerCase() || 'user',
                assignee: initialData.assignee || '',
                recurrenceType: initialData.recurrenceType || 'once',
                recurrenceDay: initialData.recurrenceDay || null,
                recurrenceWeekDays: initialData.recurrenceWeekDays || [],
                workflowId: initialData.workflowId || null,
            }));
        }
    }, [initialData]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700 shadow overflow-hidden mb-8 animate-in slide-in-from-top-4">

            {/* Header / Main Info */}
            {/* Header / Main Info */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-700/50 space-y-5">
                <div className="group">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Task Title</label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-200">
                            <AppIcon name="CheckSquare" size={20} />
                        </div>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData({ ...data, title: e.target.value })}
                            className="w-full text-lg font-bold bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl py-3 pl-12 pr-4 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition-all duration-200 focus:outline-none shadow-sm"
                            placeholder="What needs to be done?"
                            required
                        />
                    </div>
                </div>

                <div className="group pt-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Description</label>
                    <div className="relative">
                        <div className="absolute left-4 top-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors duration-200">
                            <AppIcon name="FileText" size={20} />
                        </div>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData({ ...data, description: e.target.value })}
                            className="w-full text-sm bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 focus:bg-white dark:focus:bg-slate-900 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 rounded-xl py-3 pl-12 pr-4 min-h-[100px] text-slate-900 dark:text-slate-100 resize-none transition-all duration-200 focus:outline-none placeholder:text-slate-400 shadow-sm leading-relaxed"
                            placeholder="Add details, requirements, or context..."
                        />
                    </div>
                </div>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Classification & Assignment */}
                <div className="space-y-6">
                    <div>
                        <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">
                            <div className="p-1.5 bg-indigo-50 dark:bg-indigo-900/20 rounded text-indigo-600">
                                <AppIcon name="Tag" size={14} />
                            </div>
                            Classification & Assignment
                        </h4>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">Category</label>
                                    <Select value={data.category?.toString()} onValueChange={(val) => setData({ ...data, category: parseInt(val) })}>
                                        <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 h-10">
                                            <SelectValue placeholder="Choose Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map(c => <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">Action Form</label>
                                    <Select value={data.formId?.toString()} onValueChange={(val) => setData({ ...data, formId: parseInt(val) })}>
                                        <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 h-10">
                                            <SelectValue placeholder="Select Form (Optional)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {forms.map(f => (
                                                <SelectItem key={f.Id} value={f.Id.toString()}>
                                                    {f.Name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">Task Workflow (Optional)</label>
                                    <Select value={data.workflowId?.toString()} onValueChange={(val) => setData({ ...data, workflowId: parseInt(val) })}>
                                        <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 h-10">
                                            <SelectValue placeholder="Select Workflow" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {workflows?.map(w => (
                                                <SelectItem key={w.Id} value={w.Id.toString()}>
                                                    {w.Name || w.WorkflowName || "Untitled Workflow"}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    {data.workflowId && (
                                        <div className="mt-3 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800/30 animate-in fade-in slide-in-from-top-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <AppIcon name="GitBranch" size={14} className="text-indigo-600 dark:text-indigo-400" />
                                                <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300">
                                                    {workflows.find(w => String(w.Id) === String(data.workflowId))?.Name || workflows.find(w => String(w.Id) === String(data.workflowId))?.WorkflowName || 'Workflow Selected'}
                                                </span>
                                            </div>

                                            {/* Workflow Steps Preview */}
                                            <div className="space-y-1.5 pl-1 border-l-2 border-indigo-200 dark:border-indigo-800/50 ml-1.5 my-2">
                                                {workflows.find(w => String(w.Id) === String(data.workflowId))?.ClientPortalWorkflowProperties?.sort((a, b) => a.FlowOrder - b.FlowOrder).map((step, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 text-[10px] text-slate-600 dark:text-slate-400">
                                                        <span className="w-4 h-4 flex items-center justify-center bg-white dark:bg-slate-800 rounded-full border border-indigo-100 dark:border-indigo-800 font-bold text-[9px] text-indigo-600 shrink-0">{step.FlowOrder || idx + 1}</span>
                                                        <span className="font-medium truncate">{ClientPortalWorkflowStatus.find(s => s.value == step.ActionProcessingStatus)?.label || step.ActionProcessingStatus}</span>
                                                        {step.CurrentRoleCode && <span className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-[9px] text-slate-500">{step.CurrentRoleCode}</span>}
                                                    </div>
                                                ))}
                                                {(!workflows.find(w => String(w.Id) === String(data.workflowId))?.ClientPortalWorkflowProperties?.length) && (
                                                    <p className="text-[10px] text-slate-400 italic pl-2">No steps defined for this workflow.</p>
                                                )}
                                            </div>

                                            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug mt-2 pt-2 border-t border-indigo-100 dark:border-indigo-800/30">
                                                This workflow will define the approval steps and automation logic for this task once initiated.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="pt-2">
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">Parent Task (Optional)</label>
                                <Select
                                    value={data.parentId?.toString() || "none"}
                                    onValueChange={(val) => setData({ ...data, parentId: val === "none" ? null : (isNaN(val) ? val : parseInt(val)) })}
                                >
                                    <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 h-10 transition-all hover:border-indigo-300">
                                        <SelectValue placeholder="Root Level Task" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[300px] overflow-y-auto">
                                        <SelectItem value="none">Root Level / No Parent</SelectItem>
                                        {tasks
                                            ?.filter(t => t.id !== data.id)
                                            .map(t => (
                                                <SelectItem key={t.id} value={t.id.toString()}>
                                                    {t.title} ({categories.find(c => c.id === t.category)?.name || "General"})
                                                </SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-3">
                                <label className="block text-xs font-semibold text-slate-500 ml-1">Assign Task To</label>
                                <div className="p-1 bg-slate-100 dark:bg-slate-800 rounded-lg flex mb-2 border border-slate-200 dark:border-slate-700">
                                    <button
                                        type="button"
                                        onClick={() => setData({ ...data, assigneeType: 'user', assignee: '' })}
                                        className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-bold rounded-md transition-all duration-200 ${data.assigneeType?.toLowerCase() === 'user'
                                            ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                            }`}
                                    >
                                        <AppIcon name="User" size={14} />
                                        Specific User
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setData({ ...data, assigneeType: 'role', assignee: '' })}
                                        className={`flex-1 flex items-center justify-center gap-2 py-1.5 text-xs font-bold rounded-md transition-all duration-200 ${data.assigneeType?.toLowerCase() === 'role'
                                            ? 'bg-white dark:bg-slate-700 text-purple-600 shadow-sm ring-1 ring-black/5 dark:ring-white/10'
                                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                            }`}
                                    >
                                        <AppIcon name="Shield" size={14} />
                                        Role Based
                                    </button>
                                </div>

                                <div className="relative">
                                    <div className={`absolute left-3 top-2.5 pointer-events-none ${data.assigneeType === 'role' ? 'text-purple-500' : 'text-indigo-500'}`}>
                                        <AppIcon name={data.assigneeType === 'role' ? "Shield" : "User"} size={16} />
                                    </div>
                                    <Select value={data.assignee || ""} onValueChange={(val) => setData({ ...data, assignee: val })}>
                                        <SelectTrigger className="pl-9 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 h-10 w-full transition-colors hover:border-indigo-300">
                                            <SelectValue placeholder={data.assigneeType?.toLowerCase() === 'role' ? 'Select Target Role...' : 'Select Team Member...'} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {data.assigneeType === 'role' ? (
                                                <>
                                                    {roles.length === 0 && <div className="p-2 text-xs text-slate-400 text-center">No roles found</div>}
                                                    {roles.map(r => (
                                                        <SelectItem key={r.value} value={r.value}>
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-5 h-5 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 text-[10px]">
                                                                    <AppIcon name="Shield" size={10} />
                                                                </div>
                                                                {r.label}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </>
                                            ) : (
                                                <>
                                                    <SelectItem value="All Team Members">
                                                        <div className="flex items-center gap-2 font-bold text-indigo-600">
                                                            <AppIcon name="Users" size={14} />
                                                            All Team Members
                                                        </div>
                                                    </SelectItem>
                                                    {users.map(u => (
                                                        <SelectItem key={u.name} value={u.name}>
                                                            <div className="flex items-center gap-2">
                                                                {u.avatar ? (
                                                                    <img src={u.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                                                                ) : (
                                                                    <div className="w-5 h-5 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 text-[10px] font-bold">
                                                                        {u.name.charAt(0)}
                                                                    </div>
                                                                )}
                                                                {u.name}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </>
                                            )}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <p className="text-[10px] text-slate-400 ml-1">
                                    {data.assigneeType === 'role'
                                        ? "Task will be visible to any user with this system role."
                                        : "Task will be assigned specifically to this user."}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Schedule & Automation */}
                <div className="space-y-6">
                    <div>
                        <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-200 mb-4">
                            <div className="p-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded text-emerald-600">
                                <AppIcon name="Calendar" size={14} />
                            </div>
                            Schedule & Rules
                        </h4>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">Priority</label>
                                <Select value={data.priority} onValueChange={(val) => setData({ ...data, priority: val })}>
                                    <SelectTrigger className={`border-slate-200 dark:border-slate-700 font-medium h-10 ${data.priority === 'critical' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-white dark:bg-slate-800'}`}>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${data.priority === 'critical' ? 'bg-red-500' : data.priority === 'high' ? 'bg-orange-500' : data.priority === 'medium' ? 'bg-indigo-500' : 'bg-slate-400'}`} />
                                            <SelectValue placeholder="Select Priority" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="low">Low Priority</SelectItem>
                                        <SelectItem value="medium">Medium Priority</SelectItem>
                                        <SelectItem value="high">High Priority</SelectItem>
                                        <SelectItem value="critical">Critical</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">Recurrence</label>
                                    <Select value={data.recurrenceType || 'once'} onValueChange={(val) => setData({ ...data, recurrenceType: val })}>
                                        <SelectTrigger className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 h-10"><SelectValue placeholder="Select Frequency" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="once">One-time</SelectItem>
                                            <SelectItem value="daily">Daily</SelectItem>
                                            <SelectItem value="weekly">Weekly</SelectItem>
                                            <SelectItem value="monthly">Monthly</SelectItem>
                                            <SelectItem value="yearly">Yearly</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">Completion Date</label>
                                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                                        <PopoverTrigger asChild>
                                            <button
                                                type="button"
                                                className="w-full px-3 h-10 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-between hover:bg-slate-50 transition-colors text-sm"
                                            >
                                                <span className={`flex items-center gap-2 ${data.dueDate ? "text-slate-900 dark:text-slate-100" : "text-slate-400"}`}>
                                                    {(() => {
                                                        if (!data.dueDate) return "Select Date";

                                                        // Robust parsing for "YYYY-MM-DD" to avoid timezone off-by-one errors
                                                        const [y, m, d] = data.dueDate.split('-').map(Number);
                                                        const target = new Date(y, m - 1, d);
                                                        const today = new Date();
                                                        today.setHours(0, 0, 0, 0);

                                                        const diffTime = target - today;
                                                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                                                        const absDays = Math.abs(diffDays);

                                                        const formattedDate = target.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

                                                        if (diffDays === 0) return `Today (${formattedDate})`;

                                                        let relative = "";
                                                        if (diffDays === 1) relative = "Tomorrow";
                                                        else if (diffDays === -1) relative = "Yesterday";
                                                        else if (diffDays > 0) {
                                                            // Future
                                                            if (absDays < 14) relative = `In ${absDays} Days`;
                                                            else if (absDays < 60) relative = `In ${Math.floor(absDays / 7)} Weeks`;
                                                            else if (absDays < 365) relative = `In ${Math.floor(absDays / 30)} Months`;
                                                            else relative = `In ${Math.floor(absDays / 365)} Years`;
                                                        } else {
                                                            // Past
                                                            if (absDays < 14) relative = `${absDays} Days Ago`;
                                                            else if (absDays < 60) relative = `${Math.floor(absDays / 7)} Weeks Ago`;
                                                            else if (absDays < 365) relative = `${Math.floor(absDays / 30)} Months Ago`;
                                                            else relative = `${Math.floor(absDays / 365)} Years Ago`;
                                                        }

                                                        return `${relative} (${formattedDate})`;
                                                    })()}
                                                </span>
                                                <AppIcon name="Calendar" size={14} className="text-slate-400" />
                                            </button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 border-none shadow-xl" align="start">
                                            <SimpleCalendar
                                                selectedDate={data.dueDate ? new Date(data.dueDate) : undefined}
                                                onSelect={(date) => {
                                                    // Format as YYYY-MM-DD using local time components to avoid UTC shifts
                                                    const year = date.getFullYear();
                                                    const month = String(date.getMonth() + 1).padStart(2, '0');
                                                    const day = String(date.getDate()).padStart(2, '0');
                                                    const isoDate = `${year}-${month}-${day}`;

                                                    setData({ ...data, dueDate: isoDate });
                                                    setIsCalendarOpen(false);
                                                }}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>

                            {/* Conditional Recurrence Details */}
                            {data.recurrenceType === 'monthly' && (
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">Day of Month</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="31"
                                        placeholder="e.g. 25"
                                        value={data.recurrenceDay || ''}
                                        onChange={(e) => setData({ ...data, recurrenceDay: parseInt(e.target.value) || null })}
                                        className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                                    />
                                </div>
                            )}

                            {data.recurrenceType === 'weekly' && (
                                <div>
                                    <label className="block text-xs font-semibold text-slate-500 mb-1.5 ml-1">Days of Week</label>
                                    <div className="flex gap-2 flex-wrap">
                                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                            <button
                                                key={day}
                                                type="button"
                                                onClick={() => {
                                                    const current = data.recurrenceWeekDays || [];
                                                    const newDays = current.includes(day)
                                                        ? current.filter(d => d !== day)
                                                        : [...current, day];
                                                    setData({ ...data, recurrenceWeekDays: newDays });
                                                }}
                                                className={`w-8 h-8 rounded-full text-[10px] font-bold flex items-center justify-center transition-all ${(data.recurrenceWeekDays || []).includes(day)
                                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                                                    : 'bg-white border border-slate-200 text-slate-400 hover:border-indigo-300'
                                                    }`}
                                            >
                                                {day.charAt(0)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                                {/* Auto Assign Section */}
                                <div className="p-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-700/50">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${data.autoAssign ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400' : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                                            <AppIcon name="Repeat" size={16} />
                                        </div>
                                        <div>
                                            <span className="block text-sm font-bold text-slate-700 dark:text-slate-200">Auto-Assign</span>
                                            <span className="block text-[10px] text-slate-500 font-medium">Repeat in next payroll cycle</span>
                                        </div>
                                    </div>
                                    <Switch
                                        checked={data.autoAssign}
                                        onCheckedChange={(checked) => setData({ ...data, autoAssign: checked })}
                                    />
                                </div>

                                {/* Reminders Section */}
                                <div className="p-4 flex items-center justify-between bg-white dark:bg-slate-800/20">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${data.reminderDays > 0 ? 'bg-orange-100 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400' : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400'}`}>
                                            <AppIcon name="Bell" size={16} />
                                        </div>
                                        <div>
                                            <span className="block text-sm font-bold text-slate-700 dark:text-slate-200">Reminders</span>
                                            <span className="block text-[10px] text-slate-500 font-medium">Alert before due date</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1 border border-slate-200 dark:border-slate-700">
                                        <button
                                            type="button"
                                            onClick={() => setData({ ...data, reminderDays: Math.max(0, (data.reminderDays || 0) - 1) })}
                                            className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-slate-700 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-all disabled:opacity-50"
                                            disabled={!data.reminderDays || data.reminderDays <= 0}
                                        >
                                            <AppIcon name="Minus" size={12} />
                                        </button>
                                        <div className="px-3 min-w-[3rem] text-center">
                                            <span className="text-sm font-bold text-slate-900 dark:text-slate-100">{data.reminderDays || 0}</span>
                                            <span className="text-[9px] text-slate-400 ml-1">Days</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setData({ ...data, reminderDays: (data.reminderDays || 0) + 1 })}
                                            className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-white dark:hover:bg-slate-700 rounded-md transition-all"
                                        >
                                            <AppIcon name="Plus" size={12} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-5 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-white hover:shadow-sm rounded-lg transition-all"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-bold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md shadow-indigo-200 dark:shadow-indigo-900/20 active:scale-95 transition-all flex items-center gap-2"
                >
                    <AppIcon name="Check" size={16} />
                    {initialData ? 'Update Task' : 'Create Task'}
                </button>
            </div>
        </form>
    );
};

export default TaskForm;
