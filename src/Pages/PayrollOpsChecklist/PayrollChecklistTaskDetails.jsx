import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AppIcon from "../../Component/AppIcon";
import { getPayrollOpsTaskById, updatePayrollOpsTask, updateTransactionStatus } from "./PayrollChecklistService";
import { Skeleton } from "../../Skeleton/Skeletons";
import CountdownTimer from "../../Component/CountdownTimer";
import useRole from "../../Hooks/useRole";

const PayrollChecklistTaskDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);

    const { isApprover, isClientUser, isUser, personal } = useRole();

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const data = await getPayrollOpsTaskById(id);
                setTask(data);
            } catch (error) {
                console.error("Task not found", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTask();
    }, [id]);

    const [managerRemark, setManagerRemark] = useState("");

    const handleGovernanceAction = async (action) => {
        if (!task) return;

        if (action === 'approve') {
            alert(`Task Verified.\nManager Remarks: ${managerRemark || 'None'}`);
        } else if (action === 'reject') {
            if (!managerRemark.trim()) {
                alert("Please provide remarks when requesting changes.");
                return;
            }
            try {
                const updated = { ...task, status: 'pending', description: `${task.description}\n\n[Manager Rejection]: ${managerRemark}` };
                await updatePayrollOpsTask(task.id, updated);
                setTask(updated);
                setManagerRemark("");
            } catch (error) {
                console.error("Failed to re-open task", error);
            }
        } else if (action === 'client_rollback') {
            const confirmed = window.confirm("Are you sure you want to rollback this entire processing batch? This will notify the operations team.");
            if (confirmed) {
                try {
                    const updatedTransactions = task.transactions.map(tr => ({ ...tr, status: 'pending' }));
                    const updatedTask = { ...task, status: 'pending', transactions: updatedTransactions, description: `${task.description}\n\n[Client Rollback]: ${managerRemark}` };
                    await updatePayrollOpsTask(task.id, updatedTask);
                    setTask(updatedTask);
                    alert("Batch has been rolled back to pending state.");
                } catch (error) {
                    console.error("Client rollback failed", error);
                }
            }
        }
    };

    const handleTransactionAction = async (transactionId, action) => {
        try {
            const newStatus = action === 'confirm' ? 'confirmed' : 'pending';
            await updateTransactionStatus(task.id, transactionId, newStatus);

            // Local state update
            const updatedTransactions = task.transactions.map(tr =>
                tr.id === transactionId ? { ...tr, status: newStatus } : tr
            );
            setTask({ ...task, transactions: updatedTransactions });
        } catch (error) {
            console.error("Failed to update transaction", error);
        }
    };

    const handleBatchAction = async (action) => {
        try {
            const newStatus = action === 'confirmAll' ? 'confirmed' : 'pending';
            // Simulate batch update
            const updatedTransactions = task.transactions.map(tr => ({ ...tr, status: newStatus }));
            await updatePayrollOpsTask(task.id, { ...task, transactions: updatedTransactions });
            setTask({ ...task, transactions: updatedTransactions });
            alert(`Entire batch has been ${action === 'confirmAll' ? 'confirmed' : 'rolled back'}.`);
        } catch (error) {
            console.error("Failed to update batch", error);
        }
    };



    // Mock Workflow steps with extended details
    const workflowSteps = [
        {
            id: 1,
            role: "OpsMember",
            status: "Completed",
            actionStatus: "Approved",
            user: "Sarah Jenkins",
            timestamp: "2024-02-14 10:30 AM",
            remarks: "Documents verified and uploaded successfully.",
            color: "emerald",
            communication: {
                email: "Doc_Verification_Success",
                sms: "Sent"
            },
            sla: {
                taken: "4 hours",
                allowed: "24 hours",
                status: "On Time"
            },
            attachments: [
                { name: "Verified_Docs.pdf", size: "2.4 MB" }
            ]
        },
        {
            id: 2,
            role: "PayrollOps",
            status: task?.status === 'completed' ? "Completed" : "In Progress",
            actionStatus: task?.status === 'completed' ? "Approved" : "Pending Action",
            user: task?.assignee || "Unassigned",
            timestamp: task?.status === 'completed' ? "2024-02-15 02:00 PM" : "-",
            remarks: task?.description || "Processing task details...",
            color: task?.status === 'completed' ? "emerald" : "amber",
            communication: {
                email: "Payroll_Processing_Started",
                sms: "Pending"
            },
            sla: {
                taken: "Running",
                allowed: "48 hours",
                status: "Warning"
            }
        },
        {
            id: 3,
            role: "PayrollAdmin",
            status: "Pending",
            actionStatus: "Waiting",
            user: "-",
            timestamp: "-",
            remarks: "-",
            color: "slate",
            communication: {
                email: "-",
                sms: "-"
            },
            sla: {
                taken: "-",
                allowed: "12 hours",
                status: "-"
            }
        }
    ];

    if (loading) return <div className="p-8">
        <Skeleton className="h-10 w-48 mb-6" />
        <Skeleton className="h-64 w-full" />
    </div>;

    if (!task) return <div className="p-8 text-center text-slate-500">Task not found</div>;


    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900/50 pb-20">
            {/* Contextual Header */}
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 sticky top-0 z-40 transition-all">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700/50 rounded-xl transition-all group shrink-0"
                            title="Back to Dashboard"
                        >
                            <AppIcon name="ArrowLeft" size={20} className="text-slate-500 group-hover:text-indigo-600 dark:text-slate-400" />
                        </button>
                        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-1.5 py-0.5 rounded flex items-center gap-1">
                                    <AppIcon name="Shield" size={10} />
                                    {personal} VIEW
                                </span>
                                <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                                    Ticketing ID: #{task.id}
                                </h1>
                            </div>
                            <p className="text-[10px] text-slate-400 font-medium">Updated: {workflowSteps[1].timestamp !== '-' ? workflowSteps[1].timestamp : workflowSteps[0].timestamp}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex flex-col items-end">
                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Task Status</span>
                            <div className={`flex items-center gap-1.5 text-xs font-bold ${task.status === 'completed' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${task.status === 'completed' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                {task.status.toUpperCase()}
                            </div>
                        </div>
                        <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95">
                            <AppIcon name="DownloadCloud" size={16} />
                            Generate Report
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-[1600px] mx-auto p-4 sm:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* MAIN COLUMN */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* BATCH TRANSACTIONS - PROMINENT POSITION */}
                        {(task.isBatch || true) && (
                            <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden group">
                                <div className="p-5 border-b border-slate-100 dark:border-slate-700 bg-gradient-to-r from-indigo-50/50 to-transparent dark:from-indigo-900/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl transition-transform group-hover:scale-110">
                                            <AppIcon name="Layers" size={20} />
                                        </div>
                                        <div>
                                            <h2 className="font-bold text-slate-800 dark:text-slate-100 text-base">Batch Transactions</h2>
                                            <p className="text-[11px] text-slate-500 font-medium">Verify individual payout records in this batch</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2.5 w-full sm:w-auto">
                                        {(isUser || isApprover) && (
                                            <button
                                                onClick={() => handleBatchAction('rollbackAll')}
                                                className="grow sm:grow-0 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-900/20 transition-all flex items-center justify-center gap-2"
                                            >
                                                <AppIcon name="RotateCcw" size={14} />
                                                {isClientUser ? 'Request Rollback' : 'Rollback All'}
                                            </button>
                                        )}
                                        {isUser && (
                                            <button
                                                onClick={() => handleBatchAction('confirmAll')}
                                                className="grow sm:grow-0 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 shadow-sm"
                                            >
                                                <AppIcon name="CheckCircle2" size={14} />
                                                Confirm All
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50/50 dark:bg-slate-900/20 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-700">
                                                <th className="px-6 py-4">Transaction Item</th>
                                                <th className="px-6 py-4">Amount</th>
                                                <th className="px-6 py-4 text-center">Status</th>
                                                <th className="px-6 py-4 text-right">Verification</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                                            {(task.transactions || [
                                                { id: 'TR-001', label: 'Employee #1092 - Base Salary', value: '₹45,000', status: 'confirmed' },
                                                { id: 'TR-002', label: 'Employee #1092 - HRA Allowance', value: '₹18,000', status: 'confirmed' },
                                                { id: 'TR-003', label: 'Incentive Payout - Sales Team Q4', value: '₹1,20,000', status: 'pending' },
                                                { id: 'TR-004', label: 'Statutory Bonus - Dec 2023', value: '₹5,500', status: 'pending' }
                                            ]).map((tr) => (
                                                <tr key={tr.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-all group/row">
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-slate-700 dark:text-slate-200 text-sm group-hover/row:text-indigo-600 transition-colors">{tr.label}</div>
                                                        <div className="text-[10px] text-slate-400 font-black tracking-widest mt-0.5">REF: {tr.id}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="font-bold text-slate-800 dark:text-slate-300 font-mono text-sm">{tr.value}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex justify-center">
                                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${tr.status === 'confirmed'
                                                                ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-900/30'
                                                                : 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:border-amber-900/30'
                                                                }`}>
                                                                <div className={`w-1.5 h-1.5 rounded-full ${tr.status === 'confirmed' ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
                                                                {tr.status}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        {tr.status === 'confirmed' ? (
                                                            <button
                                                                onClick={() => handleTransactionAction(tr.id, 'rollback')}
                                                                className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-all active:scale-90"
                                                                title="Rollback Transaction"
                                                            >
                                                                <AppIcon name="RotateCcw" size={16} />
                                                            </button>
                                                        ) : (
                                                            <button
                                                                onClick={() => handleTransactionAction(tr.id, 'confirm')}
                                                                className="p-2 text-slate-300 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 rounded-xl transition-all active:scale-90"
                                                                title="Confirm Transaction"
                                                            >
                                                                <AppIcon name="CheckCircle2" size={18} />
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        )}

                        {/* WORKFLOW TIMELINE */}
                        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
                            <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                                <div className="flex items-center gap-3">
                                    <div className="p-2.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 rounded-xl">
                                        <AppIcon name="GitBranch" size={18} />
                                    </div>
                                    <h2 className="font-bold text-slate-800 dark:text-slate-100 text-base">Process Cycle Overview</h2>
                                </div>
                                <button className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1.5">
                                    <AppIcon name="ExternalLink" size={14} />
                                    Audit View
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="space-y-10 relative">
                                    {/* Animated Connector Line */}
                                    <div className="absolute left-[19px] top-4 bottom-4 w-[3px] bg-slate-100 dark:bg-slate-700/50 z-0 rounded-full overflow-hidden">
                                        <div className="h-2/3 w-full bg-gradient-to-b from-emerald-500 to-indigo-500 rounded-full"></div>
                                    </div>

                                    {workflowSteps.map((step) => {
                                        const isCompleted = step.status === 'Completed';
                                        const isCurrent = step.status === 'In Progress';

                                        return (
                                            <div key={step.id} className="relative z-10 grid grid-cols-[40px,1fr] gap-6 group/step">
                                                {/* Visual Node */}
                                                <div className="flex flex-col items-center">
                                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 ${isCompleted ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/20' :
                                                        isCurrent ? 'bg-white dark:bg-slate-800 border-indigo-500 text-indigo-600 shadow-xl shadow-indigo-500/10' :
                                                            'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-300'
                                                        }`}>
                                                        {isCompleted ? <AppIcon name="Check" size={20} strokeWidth={3} /> :
                                                            isCurrent ? <div className="w-2.5 h-2.5 bg-indigo-500 rounded-full animate-ping" /> :
                                                                <div className="w-2 h-2 bg-slate-300 dark:bg-slate-600 rounded-full" />}
                                                    </div>
                                                </div>

                                                {/* Content Card */}
                                                <div className="space-y-3">
                                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                                        <div className="flex items-center gap-3">
                                                            <h3 className={`font-bold text-sm ${isCurrent ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-slate-100'}`}>
                                                                {step.role}
                                                            </h3>
                                                            {step.sla?.status && (
                                                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border ${step.sla.status === 'On Time' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                                                                    }`}>
                                                                    {step.sla.status}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg">
                                                            {step.timestamp !== '-' ? step.timestamp : 'Pending Activity'}
                                                        </span>
                                                    </div>

                                                    <div className={`rounded-2xl p-4 transition-all duration-300 border ${isCompleted ? 'bg-emerald-50/20 dark:bg-emerald-900/5 border-emerald-100/50 dark:border-emerald-900/10' :
                                                        isCurrent ? 'bg-white dark:bg-slate-800 border-indigo-100 dark:border-indigo-900/30 shadow-md transform hover:scale-[1.01]' :
                                                            'bg-slate-50/50 dark:bg-slate-800/20 border-slate-100 dark:border-slate-800'
                                                        }`}>
                                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-4">
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center font-bold text-gray-500 border-2 border-white dark:border-gray-800 shrink-0">
                                                                    {step.user !== '-' ? step.user[0] : '?'}
                                                                </div>
                                                                <div>
                                                                    <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Owner</div>
                                                                    <div className="text-xs font-bold text-gray-700 dark:text-gray-200">{step.user !== '-' ? step.user : 'Unassigned'}</div>
                                                                </div>
                                                            </div>

                                                            <div className="h-8 w-px bg-gray-100 dark:bg-gray-800 hidden sm:block mx-2"></div>

                                                            <div className="flex items-center gap-4">
                                                                <div className="flex flex-col">
                                                                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Comms</span>
                                                                    <div className="flex items-center gap-2">
                                                                        <div className={`p-1 rounded-md ${step.communication?.email !== '-' ? 'text-primary-600 bg-primary-50 dark:bg-primary-900/20' : 'text-gray-300 bg-gray-50 dark:bg-gray-800'}`} title="Email Status">
                                                                            <AppIcon name="Mail" size={12} />
                                                                        </div>
                                                                        <div className={`p-1 rounded-md ${step.communication?.sms === 'Sent' ? 'text-green-600 bg-green-50 dark:bg-green-900/20' : 'text-gray-300 bg-gray-50 dark:bg-gray-800'}`} title="SMS Status">
                                                                            <AppIcon name="MessageSquare" size={12} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                            <div className="space-y-1.5">
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Latest Action</span>
                                                                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${step.actionStatus === 'Approved' ? 'bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:border-green-800' :
                                                                    step.actionStatus === 'Pending Action' ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800' :
                                                                        'bg-gray-50 text-gray-400 border-gray-100 dark:bg-gray-800/50 dark:border-gray-700'
                                                                    }`}>
                                                                    {step.actionStatus}
                                                                </div>
                                                            </div>

                                                            <div className="space-y-1.5 ">
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">SLA Metrics</span>
                                                                <div className="flex items-center gap-3">
                                                                    <div className="flex-1 max-w-[120px]">
                                                                        <div className="flex justify-between text-[9px] font-bold text-gray-400 mb-1">
                                                                            <span>{step.sla?.taken}</span>
                                                                            <span>{step.sla?.allowed}</span>
                                                                        </div>
                                                                        <div className="h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                                                            <div className={`h-full rounded-full ${step.sla?.status === 'On Time' ? 'bg-green-500' : 'bg-amber-500'}`} style={{ width: step.sla?.taken !== '-' ? '40%' : '0%' }} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {step.attachments && step.attachments.length > 0 && (
                                                                <div className="space-y-1.5">
                                                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Evidence</span>
                                                                    {step.attachments.map((file, idx) => (
                                                                        <div key={idx} className="flex items-center gap-2 p-1.5 rounded-lg bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 group/file cursor-pointer hover:border-primary-200 transition-colors">
                                                                            <AppIcon name="Paperclip" size={12} className="text-gray-400 group-hover/file:text-primary-500" />
                                                                            <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 truncate max-w-[100px]">{file.name}</span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>

                                                        {step.remarks !== '-' && (
                                                            <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-800">
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-1">Activity Remarks</span>
                                                                <div className="text-[11px] text-gray-500 dark:text-gray-400 italic leading-relaxed bg-gray-50/50 dark:bg-gray-800/20 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                                                                    "{step.remarks}"
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SIDEBAR COLUMN */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* TASK SUMMARY CARD */}
                        <aside className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-700 sticky top-24 overflow-hidden">
                            <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                                <h3 className="font-bold text-slate-800 dark:text-slate-100 tracking-tight">Configuration Snapshot</h3>
                                <AppIcon name="Shield" size={16} className="text-indigo-400" />
                            </div>

                            <div className="p-6 space-y-8">
                                <section>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Subject</label>
                                    <h4 className="font-bold text-slate-900 dark:text-white text-base leading-snug">{task.title}</h4>
                                </section>

                                <div className="grid grid-cols-2 gap-6">
                                    <section>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Urgency</label>
                                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border ${task.priority === 'critical' ? 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-900/10' :
                                            task.priority === 'high' ? 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/10' :
                                                'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-900/10'
                                            }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${task.priority === 'critical' ? 'bg-rose-500' : 'bg-indigo-500'}`}></div>
                                            {task.priority}
                                        </span>
                                    </section>
                                    <section>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Deadline</label>
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
                                            <AppIcon name="Calendar" size={14} className="text-slate-400" />
                                            {task.dueDate}
                                        </div>
                                    </section>
                                </div>

                                <section className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Remaining Window</label>
                                    <CountdownTimer dueDate={task.dueDate} status={task.status} />
                                </section>

                                <section>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Instructional Scope</label>
                                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                                        {task.description || "Detailed processing requirements were not specified for this activity."}
                                    </p>
                                </section>

                                {/* MANAGER VALIDATION ZONE */}
                                {isApprover && task.status === 'completed' && (
                                    <section className="pt-6 border-t border-slate-100 dark:border-slate-700">
                                        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-5 shadow-lg shadow-indigo-600/20 text-white group">
                                            <h4 className="font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <AppIcon name="CheckSquare" size={16} />
                                                Manager Approval
                                            </h4>

                                            <textarea
                                                value={managerRemark}
                                                onChange={(e) => setManagerRemark(e.target.value)}
                                                placeholder="Verification comments..."
                                                className="w-full text-xs p-3 rounded-xl bg-white/10 border border-white/20 focus:bg-white/20 outline-none resize-none mb-4 min-h-[100px] transition-all placeholder:text-indigo-200/50 leading-relaxed"
                                            />

                                            <div className="flex flex-col gap-2">
                                                <button
                                                    onClick={() => handleGovernanceAction('approve')}
                                                    className="w-full py-3 bg-white text-indigo-700 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-sm hover:translate-y-[-2px] active:translate-y-0"
                                                >
                                                    Verify & Close Payout
                                                </button>
                                                <button
                                                    onClick={() => handleGovernanceAction('reject')}
                                                    className="w-full py-3 bg-indigo-500/30 hover:bg-indigo-500/50 text-white border border-white/20 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
                                                >
                                                    <AppIcon name="RotateCcw" size={12} />
                                                    Request Revision
                                                </button>
                                            </div>
                                        </div>
                                    </section>
                                )}

                                {/* CLIENT GOVERNANCE ZONE */}
                                {isClientUser && (
                                    <section className="pt-6 border-t border-slate-100 dark:border-slate-700">
                                        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-5 shadow-lg shadow-emerald-600/20 text-white">
                                            <h4 className="font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                                                <AppIcon name="UserCheck" size={16} />
                                                Client Review
                                            </h4>

                                            <textarea
                                                value={managerRemark}
                                                onChange={(e) => setManagerRemark(e.target.value)}
                                                placeholder="Add feedback or reasons for rollback..."
                                                className="w-full text-xs p-3 rounded-xl bg-white/10 border border-white/20 focus:bg-white/20 outline-none resize-none mb-4 min-h-[100px] transition-all placeholder:text-emerald-200/50 leading-relaxed"
                                            />

                                            <div className="flex flex-col gap-2">
                                                <button
                                                    onClick={() => alert("Cycle Acknowledged.")}
                                                    className="w-full py-3 bg-white text-emerald-700 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-sm hover:translate-y-[-2px]"
                                                >
                                                    Acknowledge Cycle
                                                </button>
                                                <button
                                                    onClick={() => handleGovernanceAction('client_rollback')}
                                                    className="w-full py-3 bg-emerald-500/30 hover:bg-emerald-500/50 text-white border border-white/20 font-black text-[10px] uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2"
                                                >
                                                    <AppIcon name="RotateCcw" size={12} />
                                                    Initiate Rollback
                                                </button>
                                            </div>
                                        </div>
                                    </section>
                                )}

                                {/* QUICK SUPPORT CARD */}
                                <section className="p-4 rounded-2xl border-2 border-dashed border-slate-100 dark:border-slate-700 flex items-center gap-4 group cursor-pointer hover:border-indigo-400 transition-all">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                        <AppIcon name="LifeBuoy" size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <h5 className="font-bold text-xs text-slate-800 dark:text-slate-100 mb-0.5">Contact Helpdesk</h5>
                                        <p className="text-[10px] text-slate-500">Raise query regarding this task</p>
                                    </div>
                                    <AppIcon name="ChevronRight" size={14} className="text-slate-300 group-hover:text-indigo-600" />
                                </section>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PayrollChecklistTaskDetails;
