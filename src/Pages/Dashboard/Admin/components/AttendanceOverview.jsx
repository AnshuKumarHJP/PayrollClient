import React from "react";
import ReactECharts from "echarts-for-react";

const AttendanceOverview = ({ theme, isDark }) => {
    // Default fallback colors
    const colors = {
        present: theme?.hex?.primary || "#10B981",
        late: theme?.hex?.secondary || "#F59E0B",
        permission: theme?.hex?.accent || "#3B82F6",
        absent: "#EF4444"
    };

    const data = [
        { name: "Present", value: 59, color: colors.present },
        { name: "Late", value: 21, color: colors.late },
        { name: "Permission", value: 2, color: colors.permission },
        { name: "Absent", value: 15, color: colors.absent },
    ];

    const total = 120;

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
                name: 'Attendance',
                type: 'pie',
                radius: ['60%', '85%'],
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
            <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100">Attendance Overview</h3>
                <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-slate-700 px-2 py-1 rounded">Today</span>
            </div>

            <div className="relative h-48 w-full flex-shrink-0 overflow-hidden">
                <ReactECharts
                    option={option}
                    style={{ height: '300px', width: '100%', marginTop: '-30px' }}
                    opts={{ renderer: 'svg' }}
                />
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pt-8 pointer-events-none">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Total Attendance</span>
                    <span className="text-2xl font-bold dark:text-white">{total}</span>
                </div>
            </div>

            <div className="flex flex-col gap-2 mt-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</h4>
                <div className="space-y-2">
                    {data.map((item) => (
                        <div key={item.name} className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                                <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
                            </div>
                            <span className="font-semibold text-gray-700 dark:text-gray-200">{item.value}%</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-between items-center mt-auto pt-4 text-xs">
                <span className="text-gray-500 dark:text-gray-500">Total Absenties <span className="font-bold text-gray-800 dark:text-gray-200 ml-1">5</span></span>
                <button className="text-orange-500 font-medium hover:underline">View Details</button>
            </div>
        </div>
    );
};

export default AttendanceOverview;
