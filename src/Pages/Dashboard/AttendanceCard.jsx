import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../Lib/card";

export default function AttendanceCard() {
    const data = [
        { name: "Spending Hours", value: 45, color: "#22C55E" },
        { name: "Total Hours", value: 130, color: "#2563EB" },
        { name: "Remaining Hours", value: 75, color: "#6366F1" },
        { name: "Not spent", value: 10, color: "#EF4444" },
    ];

    return (
        <Card className="w-full">
            {/* HEADER */}
            <CardHeader>
                <CardTitle className="text-lg flex justify-between items-center">
                    My Attendance
                    <span className="text-sm text-gray-400 flex items-center gap-1 cursor-pointer hover:text-gray-600">
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

                            <span className="font-semibold whitespace-nowrap">{item.value} Hrs</span>
                            <span className="text-gray-500 whitespace-nowrap">{item.name}</span>
                        </div>
                    ))}
                </div>

                {/* RIGHT PIE CHART - fully responsive */}
                <div className="w-full md:w-1/2 flex justify-center">
                    <div className="relative" style={{ width: "100%", maxWidth: 240, height: 240 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    dataKey="value"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius="60%"
                                    outerRadius="80%"
                                    stroke="#fff"
                                    strokeWidth={2}
                                    cornerRadius={8}
                                    startAngle={90}
                                    endAngle={-270}
                                >
                                    {data.map((item, index) => (
                                        <Cell key={index} fill={item.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>

                        {/* CENTER VALUE */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <p className="text-xl font-semibold">130</p>
                            <p className="text-gray-500 text-xs">/ 45 hrs spend</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
