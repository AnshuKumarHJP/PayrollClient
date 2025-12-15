import clsx from "clsx";

export default function StatusBadge({ status }) {
  const colors = {
    Active: "bg-green-100 text-green-700",
    Inactive: "bg-red-100 text-red-700",
    Onboarding: "bg-yellow-100 text-yellow-700",
  };

  return (
    <span
      className={clsx(
        "px-2 py-1 text-xs rounded-full",
        colors[status] || "bg-gray-100 text-gray-600"
      )}
    >
      {status}
    </span>
  );
}
