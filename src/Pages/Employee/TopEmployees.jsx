import { Progress } from "../../Lib/progress";

export default function TopEmployees() {
  const list = [
    { name: "Floyd Miles", value: 85 },
    { name: "Savannah Nguyen", value: 78 },
    { name: "Cameron Williamson", value: 92 },
  ];

  return (
    <>
      <h3 className="text-sm font-semibold">Top 3 Employee by Performance</h3>

      <div className="mt-4 space-y-6">
        {list.map((item) => (
          <div key={item.name}>
            <p className="text-xs text-gray-600 mb-1">{item.name}</p>
            <Progress value={item.value} variant="success"/>
          </div>
        ))}
      </div>
    </>
  );
}
