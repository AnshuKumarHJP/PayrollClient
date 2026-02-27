import React from "react";
import ReactECharts from "echarts-for-react";

const TaskStatistics = ({ theme, isDark }) => {
    const data = [
        { name: "Ongoing", value: 40, color: "#10B981" },
        { name: "On Hold", value: 16, color: "#BFDBFE" },
        { name: "Overdue", value: 10, color: "#FBBF24" },
        { name: "Pending", value: 24, color: "#EF4444" },
    ];

    const option = {
        tooltip: {
            show: true,
            trigger: 'item',
            formatter: '{b}: {c}%',
            backgroundColor: isDark ? 'rgba(30, 41, 59, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            borderColor: isDark ? '#334155' : '#e2e8f0',
            borderWidth: 1,
            textStyle: { color: isDark ? '#f8fafc' : '#1e293b' },
        },
        series: [
            {
                name: 'Tasks',
                type: 'pie',
                radius: ['80%', '100%'],
                center: ['50%', '75%'],
                startAngle: 180,
                label: { show: false },
                emphasis: {
                    scale: true,
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                data: [
                    ...data.map(item => ({
                        name: item.name,
                        value: item.value,
                        itemStyle: { color: item.color }
                    })),
                    {
                        value: data.reduce((acc, curr) => acc + curr.value, 0),
                        name: "invisible",
                        itemStyle: { color: 'rgba(0,0,0,0)' },
                        label: { show: false },
                        tooltip: { show: false }
                    }
                ]
            }
        ]
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow dark:shadow-none p-5 h-full flex flex-col transition-colors duration-300">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">Tasks Statistics</h3>
                <span className="text-xs text-gray-400 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">This Week</span>
            </div>

            <div className="relative h-48 w-full overflow-hidden">
                <ReactECharts
                    option={option}
                    style={{ height: '300px', width: '100%', marginTop: '-30px' }}
                    opts={{ renderer: 'svg' }}
                />

                {/* Center label */}
                <div className="absolute inset-0 top-[40%] flex flex-col items-center justify-center">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Total Tasks</span>
                    <span className="text-2xl font-bold dark:text-white">124/165</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="flex flex-col items-center p-3 border dark:border-green-600/30 rounded-lg bg-green-500 dark:bg-green-600 text-white shadow-sm">
                    <span className="text-2xl font-bold">389/689 hrs</span>
                    <span className="text-[10px] opacity-90">Spent on Overall Tasks This Week</span>
                </div>
                <div className="flex items-center justify-center">
                    <button className="px-4 py-2 border dark:border-slate-600 rounded-lg text-sm bg-white dark:bg-slate-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-600 transition-colors">
                        View All
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap justify-between mt-4 text-xs text-gray-500 dark:text-gray-400 px-2 gap-y-2">
                {data.map((item, index) => (
                    <div key={index} className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                        {item.name} {item.value}%
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TaskStatistics;
