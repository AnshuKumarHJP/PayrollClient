import React from "react";
import ReactECharts from "echarts-for-react";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../Library/Card";

export default function AttendanceCard() {
    const data = [
        { name: "Spending Hours", value: 45, color: "#22C55E" },
        { name: "Total Hours", value: 130, color: "#2563EB" },
        { name: "Remaining Hours", value: 75, color: "#6366F1" },
        { name: "Not spent", value: 10, color: "#EF4444" },
    ];

    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} Hrs',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderColor: '#e2e8f0',
            borderWidth: 1,
            textStyle: { color: '#1e293b' },
        },
        series: [
            {
                name: 'Attendance',
                type: 'pie',
                radius: ['60%', '80%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: { show: false },
                emphasis: {
                    label: { show: false }
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
        <Card className="w-full">
            {/* HEADER */}
            <CardHeader>
                <CardTitle className="text-lg flex justify-between items-center text-slate-800">
                    My Attendance
                    <span className="text-sm text-gray-400 flex items-center gap-1 cursor-pointer hover:text-gray-600 transition-colors">
                        View Full Stats <ArrowRight size={14} />
                    </span>
                </CardTitle>
            </CardHeader>

            {/* BODY → responsive layout */}
            <CardContent
                className="
                    flex flex-col md:flex-row 
                    justify-between items-center 
                    gap-6 md:gap-4
                "
            >
                {/* LEFT LEGEND */}
                <div className="space-y-4 w-full md:w-1/2">
                    {data.map((item, index) => (
                        <div key={index} className="flex items-center gap-3 text-sm">
                            <span
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                            ></span>

                            <span className="font-semibold whitespace-nowrap text-slate-700">{item.value} Hrs</span>
                            <span className="text-gray-500 whitespace-nowrap">{item.name}</span>
                        </div>
                    ))}
                </div>

                {/* RIGHT PIE CHART - fully responsive */}
                <div className="w-full md:w-1/2 flex justify-center">
                    <div className="relative" style={{ width: "100%", maxWidth: 240, height: 240 }}>
                        <ReactECharts
                            option={option}
                            style={{ height: '100%', width: '100%' }}
                            opts={{ renderer: 'svg' }}
                        />

                        {/* CENTER VALUE */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <p className="text-xl font-semibold text-slate-800">130</p>
                            <p className="text-gray-500 text-xs">/ 45 hrs spend</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
