import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Jan", employee: 30, intern: 20 },
  { name: "Feb", employee: 45, intern: 28 },
  { name: "Mar", employee: 55, intern: 33 },
  { name: "Apr", employee: 38, intern: 27 },
  { name: "May", employee: 44, intern: 20 },
  { name: "Jun", employee: 60, intern: 25 },
  { name: "Jul", employee: 41, intern: 30 },
  { name: "Aug", employee: 49, intern: 28 },
];

export default function PerformanceChart() {
  return (
    <>
      <h3 className="text-sm font-semibold">Over all Employee Performance</h3>

      <div className="flex items-center gap-4 text-xs mt-2">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-yellow-400 rounded" /> Employee
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-500 rounded" /> Intern
        </div>
      </div>

      <ResponsiveContainer width="100%" height={230}>
        <AreaChart data={data}>
          <Area dataKey="employee" stroke="#FACC15" fill="#FACC1544" />
          <Area dataKey="intern" stroke="#3B82F6" fill="#3B82F644" />
          <XAxis dataKey="name" />
          <Tooltip />
        </AreaChart>
      </ResponsiveContainer>
    </>
  );
}
