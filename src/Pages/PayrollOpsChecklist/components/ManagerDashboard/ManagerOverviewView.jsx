import { useEffect, useState } from "react";
import AppIcon from "../../../../Component/AppIcon";
import { getTeamUsers } from "../../PayrollChecklistService";
import { motion } from "framer-motion";

const ProgressItem = ({ label, value, max, alerts, colorClass, avatar, iconName, trend = "+5%", subInfo = "On Schedule" }) => {
    const percentage = max > 0 ? (value / max) * 100 : 0;
    const isCritical = alerts.some(a => a.label === 'CRIT' || a.label === 'DUE');

    return (
        <div className="group bg-white dark:bg-slate-800 p-3 rounded-lg transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:shadow-primary-500/5">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        {avatar ? (
                            <img src={avatar} alt={label} className="w-10 h-10 rounded-xl object-cover ring-2 ring-gray-100 dark:ring-gray-700 shadow-sm" />
                        ) : (
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-colors ${colorClass.bg} ${colorClass.text}`}>
                                <AppIcon name={iconName || colorClass.icon} size={20} />
                            </div>
                        )}
                        {isCritical && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white dark:border-gray-800 rounded-full" />
                        )}
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800 dark:text-slate-100 text-[14px] leading-tight mb-1">{label}</h4>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{value} / {max} Completed</span>
                            <span className="text-[10px] font-bold text-green-500 dark:text-green-400 italic">{trend}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-xl font-black text-gray-900 dark:text-white leading-none">{Math.round(percentage)}%</span>
                </div>
            </div>

            {/* Micro Alerts */}
            <div className="flex flex-wrap items-center gap-2 mb-4 h-6">
                {alerts.map((alert, idx) => (
                    <div key={idx} className={`flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border ${alert.style}`}>
                        {alert.count} {alert.label}
                    </div>
                ))}
                {!alerts.length && (
                    <div className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest bg-green-50 text-green-600 border border-green-100 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400 flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Optimal
                    </div>
                )}
            </div>

            {/* Progress Bar */}
            <div className="space-y-3">
                <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1.2, ease: "circOut" }}
                        className={`h-full rounded-full ${colorClass.bar}`}
                    />
                </div>
                <div className="flex justify-between items-center text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                    <span className="flex items-center gap-1">
                        <AppIcon name="Zap" size={10} />
                        Live Velocity
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">{subInfo}</span>
                </div>
            </div>
        </div>
    );
};

const ManagerOverviewView = ({ categoryStats, teamMembers, clientStats = [], teamWiseStats = [] }) => {
    const [teamUsers, setTeamUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getTeamUsers();
                setTeamUsers(data);
            } catch (error) {
                console.error("Failed to fetch team users", error);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div className="space-y-8 pb-12">
            {/* Row 1: Module Progress & Team Efficiency */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Category Breakdown */}
                <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary-600 text-white rounded-2xl shadow-lg shadow-primary-100 dark:shadow-none dark:bg-primary-700">
                                <AppIcon name="LayoutGrid" size={24} />
                            </div>
                            <div>
                                <h3 className="text-[17px] font-bold text-gray-900 dark:text-white tracking-tight">Functional Landscape</h3>
                                <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-0.5">Operational readiness by module</p>
                            </div>
                        </div>
                        <button className="h-9 px-4 rounded-xl text-[10px] font-black text-primary-600 dark:text-primary-400 uppercase tracking-widest bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-600 hover:text-white dark:hover:bg-primary-500 dark:hover:text-white transition-all">Details</button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {categoryStats.map((cat) => (
                            <ProgressItem
                                key={cat.value}
                                label={cat.label}
                                value={cat.completed}
                                max={cat.total}
                                alerts={[
                                    ...(cat.critical > 0 ? [{ count: cat.critical, label: 'CRIT', style: 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400' }] : [])
                                ]}
                                colorClass={{
                                    bg: 'bg-primary-50 dark:bg-primary-900/30',
                                    text: 'text-primary-600 dark:text-primary-400',
                                    bar: 'bg-primary-600 dark:bg-primary-500',
                                    icon: 'Layers'
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Team Performance */}
                <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-teal-600 text-white rounded-2xl shadow-lg shadow-teal-100 dark:shadow-none dark:bg-teal-700">
                                <AppIcon name="Zap" size={24} />
                            </div>
                            <div>
                                <h3 className="text-[17px] font-bold text-gray-900 dark:text-white tracking-tight">Throughput Pulse</h3>
                                <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-0.5">Resource velocity & task flow</p>
                            </div>
                        </div>
                        <button className="h-9 px-4 rounded-xl text-[10px] font-black text-teal-600 dark:text-teal-400 uppercase tracking-widest bg-teal-50 dark:bg-teal-900/30 hover:bg-teal-600 hover:text-white dark:hover:bg-teal-500 dark:hover:text-white transition-all">Workload</button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {teamMembers.length > 0 ? teamMembers.map((member) => (
                            <ProgressItem
                                key={member.name}
                                label={member.name}
                                value={member.completed}
                                max={member.tasks.length}
                                alerts={[
                                    ...(member.critical > 0 ? [{ count: member.critical, label: 'CRIT', style: 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400' }] : []),
                                    ...(member.overdue > 0 ? [{ count: member.overdue, label: 'DUE', style: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-400' }] : [])
                                ]}
                                colorClass={{
                                    bg: 'bg-teal-50 dark:bg-teal-900/30',
                                    text: 'text-teal-600 dark:text-teal-400',
                                    bar: 'bg-teal-600 dark:bg-teal-500',
                                    icon: 'User'
                                }}
                                avatar={teamUsers.find(u => u.name === member.name)?.avatar}
                            />
                        )) : (
                            <div className="col-span-2 py-16 text-center text-gray-400 dark:text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px]">No active data stream</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Row 2: Bandwidth Heatmap */}
            <div className="bg-indigo-700 dark:bg-slate-800 text-white p-4 rounded-lg overflow-hidden relative shadow-2xl shadow-primary-900/20">
                <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none text-primary-200 dark:text-primary-700">
                    <AppIcon name="BarChart3" size={160} />
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 relative z-10 gap-6">
                    <div>
                        <h3 className="text-2xl font-black tracking-tight flex items-center gap-3">
                            Resource Bandwidth
                            <span className="px-2 py-0.5 rounded bg-primary-400/20 text-primary-200 dark:text-primary-300 text-[9px] border border-primary-400/30 uppercase tracking-widest">AI Optimized</span>
                        </h3>
                        <p className="text-primary-100 dark:text-primary-300/60 text-sm mt-1 font-medium">Predictive capacity analysis & allocation heatmap</p>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/10 dark:bg-white/5 p-1 rounded-2xl border border-white/10">
                        {['Day', 'Week', 'Month'].map(t => (
                            <button key={t} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${t === 'Week' ? 'bg-blue-500 text-white' : 'text-primary-200 dark:text-primary-300 hover:text-white'}`}>{t}</button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 relative z-10">
                    {[
                        { label: 'Available Hours', value: '420h', status: 'Optimal', color: 'text-green-400' },
                        { label: 'Avg Task Effort', value: '1.4h', status: 'Efficient', color: 'text-blue-400' },
                        { label: 'Idle Velocity', value: '12%', status: 'Low Risk', color: 'text-green-400' },
                        { label: 'Peak Load', value: '88%', status: 'Attention', color: 'text-red-400' }
                    ].map((stat, i) => (
                        <div key={i} className="flex flex-col gap-2 border-l border-white/10 dark:border-white/5 pl-6">
                            <span className="text-[10px] font-black text-primary-200/60 dark:text-primary-300/40 uppercase tracking-[0.2em]">{stat.label}</span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-black tracking-tighter">{stat.value}</span>
                                <span className={`text-[9px] font-black uppercase tracking-widest ${stat.color}`}>{stat.status}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 grid grid-cols-6 md:grid-cols-12 h-16 gap-1.5 relative z-10">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <div key={i} className={`rounded-md transition-all group relative cursor-help flex flex-col justify-end ${i === 3 || i === 7 || i === 10 ? 'bg-red-500/80 shadow-[0_0_15px_rgba(244,63,94,0.3)]' :
                            i > 8 ? 'bg-white/10' : 'bg-blue-500/40'
                            }`} style={{ height: `${50 + Math.random() * 50}%` }}>
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-white dark:bg-gray-800 text-primary-950 dark:text-white text-[9px] font-black rounded border border-primary-100 dark:border-gray-700 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl z-20">
                                Period {i + 1}: {Math.round(40 + Math.random() * 60)}% Load
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Row 3: Client Distribution & Role Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Client-wise Progress */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center mb-8 gap-4">
                        <div className="p-3 bg-gray-800 dark:bg-gray-700 text-white rounded-2xl shadow-lg shadow-gray-200 dark:shadow-none">
                            <AppIcon name="Building2" size={24} />
                        </div>
                        <div>
                            <h3 className="text-[17px] font-bold text-gray-900 dark:text-white tracking-tight">Portfolio Spread</h3>
                            <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-0.5">Performance across client entities</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {clientStats.map((client) => (
                            <ProgressItem
                                key={client.label}
                                label={client.label}
                                value={client.completed}
                                max={client.total}
                                alerts={[
                                    ...(client.critical > 0 ? [{ count: client.critical, label: 'CRIT', style: 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400' }] : [])
                                ]}
                                colorClass={{
                                    bg: 'bg-gray-100 dark:bg-gray-700',
                                    text: 'text-gray-600 dark:text-gray-300',
                                    bar: 'bg-gray-700 dark:bg-gray-400',
                                    icon: 'Briefcase'
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Role Overview */}
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center mb-8 gap-4">
                        <div className="p-3 bg-primary-900 dark:bg-primary-800 text-white rounded-2xl shadow-lg dark:shadow-none">
                            <AppIcon name="ShieldCheck" size={24} />
                        </div>
                        <div>
                            <h3 className="text-[17px] font-bold text-gray-900 dark:text-white tracking-tight">Governance Status</h3>
                            <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-0.5">System access & role authorization</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        {teamWiseStats.length > 0 ? teamWiseStats.map((team) => (
                            <ProgressItem
                                key={team.label}
                                label={team.label}
                                value={team.completed}
                                max={team.total}
                                alerts={[{ count: team.members, label: 'MEMBERS', style: 'bg-primary-50 text-primary-600 border-primary-100 dark:bg-primary-900/30 dark:border-primary-800 dark:text-primary-400' }]}
                                colorClass={{
                                    bg: 'bg-primary-50 dark:bg-primary-900/30',
                                    text: 'text-primary-600 dark:text-primary-400',
                                    bar: 'bg-primary-900 dark:bg-primary-500',
                                    icon: 'Shield'
                                }}
                            />
                        )) : (
                            <div className="col-span-2 py-16 text-center text-gray-400 dark:text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px]">No structural sync detected</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default ManagerOverviewView;
