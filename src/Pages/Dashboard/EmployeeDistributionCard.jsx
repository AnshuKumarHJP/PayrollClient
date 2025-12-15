import React from "react";
import { PieChart, Pie, Cell } from "recharts";
import { Circle } from "lucide-react";

// Chart data
const data = [
  { name: "Remote", value: 23, color: "#2F66F4" }, // Blue
  { name: "Onsite", value: 77, color: "#F4B000" }, // Yellow
];

export default function EmployeeDistributionCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 flex items-center gap-6 w-full">
      {/* Pie Chart */}
      <div className="relative">
        <PieChart width={170} height={155}>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={55}
            outerRadius={75}
            stroke="none"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-semibold text-black">200</span>
          <span className="text-sm text-gray-500 -mt-1">Employees</span>
        </div>
      </div>

      {/* Labels */}
      <div className="space-y-4">
        {/* Remote */}
        <div className="flex items-center gap-3">
          <Circle size={12} color="#2F66F4" fill="#2F66F4" />
          <div>
            <p className="text-sm font-semibold text-gray-900">23%</p>
            <p className="text-xs text-gray-500">Remote</p>
          </div>
        </div>

        {/* Onsite */}
        <div className="flex items-center gap-3">
          <Circle size={12} color="#F4B000" fill="#F4B000" />
          <div>
            <p className="text-sm font-semibold text-gray-900">77%</p>
            <p className="text-xs text-gray-500">Onsite</p>
          </div>
        </div>
      </div>
    </div>
  );
}
