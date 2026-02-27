import React from "react";
import ReactECharts from "echarts-for-react";

const LeaveChart = () => {
    const data = [
        { name: "On Time", value: 1254, color: "#111827" },
        { name: "Late", value: 32, color: "#10B981" },
        { name: "Work From Home", value: 658, color: "#EA580C" },
        { name: "Absent", value: 14, color: "#DC2626" },
        { name: "Sick Leave", value: 68, color: "#FBBF24" }
    ];

    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c}',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderColor: '#e2e8f0',
            borderWidth: 1,
            textStyle: { color: '#1e293b' },
        },
        series: [
            {
                name: 'Leave Details',
                type: 'pie',
                radius: ['50%', '80%'],
                avoidLabelOverlap: false,
                label: { show: false },
                itemStyle: {
                    borderRadius: 4,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                data: data.map(item => ({
                    name: item.name,
                    value: item.value,
                    itemStyle: { color: item.color }
                }))
            }
        ],
        animationDuration: 1500,
        animationEasing: 'cubicOut',
    };

    return (
        <div className="bg-white rounded-xl shadow p-5 h-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-800">Leave Details</h3>
                <button className="text-xs border px-2 py-1 rounded flex items-center gap-1 text-gray-500">
                    2024
                </button>
            </div>

            <div className="flex items-center h-full pb-4">
                {/* Legend Left */}
                <div className="flex-1 space-y-3">
                    {data.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                            <span className="font-bold text-gray-800">{item.value}</span>
                            <span className="text-gray-500 text-xs">{item.name === "On Time" ? "on time" : item.name === "Late" ? "Late Attendance" : item.name}</span>
                        </div>
                    ))}
                    <div className="mt-4 pt-2 border-t border-gray-100 flex items-center gap-2">
                        <div className="w-4 h-4 border rounded bg-gray-50"></div>
                        <span className="text-xs text-gray-500">Better than <span className="font-bold text-gray-800">85%</span> of Employees</span>
                    </div>
                </div>

                {/* Chart Right */}
                <div className="w-40 h-40">
                    <ReactECharts
                        option={option}
                        style={{ height: '100%', width: '100%' }}
                        opts={{ renderer: 'svg' }}
                    />
                </div>
            </div>

        </div>
    );
};

export default LeaveChart;
