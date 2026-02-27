import React from "react";
import ReactECharts from "echarts-for-react";

const AttendanceWidget = () => {
    // Semi-circle gauge simulation for "Attendance" time
    const data = [
        { value: 70, name: 'Active', itemStyle: { color: "#F97316" } },
        { value: 30, name: 'Inactive', itemStyle: { color: "#F3F4F6" } }
    ];

    const option = {
        series: [
            {
                type: 'pie',
                radius: ['80%', '100%'],
                center: ['50%', '75%'],
                startAngle: 180,
                label: { show: false },
                silent: true,
                data: [
                    ...data,
                    {
                        value: 100,
                        itemStyle: { color: 'rgba(0,0,0,0)' },
                        label: { show: false },
                        tooltip: { show: false }
                    }
                ]
            }
        ],
        animationDuration: 1500,
        animationEasing: 'cubicOut',
    };

    return (
        <div className="bg-white rounded-xl shadow p-5 h-full flex flex-col justify-center items-center relative overflow-hidden border border-orange-500">
            {/* Background Pattern Simulation */}
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <div className="grid grid-cols-4 gap-2">
                    {[...Array(16)].map((_, i) => <div key={i} className="w-1 h-1 bg-orange-500 rounded-full"></div>)}
                </div>
            </div>

            <div className="text-xs text-orange-500 font-medium mb-1">Attendance</div>
            <div className="text-xl font-bold text-gray-800 mb-6">08:35 AM, 11 Mar 2025</div>

            <div className="w-48 h-24 relative overflow-hidden">
                <ReactECharts
                    option={option}
                    style={{ height: '240px', width: '100%', marginTop: '-30px' }}
                    opts={{ renderer: 'svg' }}
                />
            </div>

            <div className="mt-2 text-center text-xs text-gray-500 flex gap-4">
            </div>

            {/* Bottom border decoration */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-orange-500"></div>
        </div>
    );
};

export default AttendanceWidget;
