import React from "react";
import ReactECharts from "echarts-for-react";
import { Circle } from "lucide-react";

// Chart data
const data = [
  { name: "Remote", value: 23, color: "#2F66F4" }, // Blue
  { name: "Onsite", value: 77, color: "#F4B000" }, // Yellow
];

export default function EmployeeDistributionCard() {
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c}%',
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      textStyle: { color: '#1e293b' },
    },
    series: [
      {
        name: 'Distribution',
        type: 'pie',
        radius: ['60%', '80%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: { show: false },
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
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 flex items-center gap-6 w-full">
      {/* Pie Chart */}
      <div className="relative w-[170px] h-[155px]">
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'svg' }}
        />

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-2xl font-semibold text-slate-800">200</span>
          <span className="text-[10px] text-gray-500 -mt-1 uppercase tracking-wider">Employees</span>
        </div>
      </div>

      {/* Labels */}
      <div className="space-y-4">
        {/* Remote */}
        <div className="flex items-center gap-3">
          <Circle size={10} color="#2F66F4" fill="#2F66F4" />
          <div>
            <p className="text-sm font-semibold text-gray-900">23%</p>
            <p className="text-xs text-gray-500">Remote</p>
          </div>
        </div>

        {/* Onsite */}
        <div className="flex items-center gap-3">
          <Circle size={10} color="#F4B000" fill="#F4B000" />
          <div>
            <p className="text-sm font-semibold text-gray-900">77%</p>
            <p className="text-xs text-gray-500">Onsite</p>
          </div>
        </div>
      </div>
    </div>
  );
}
