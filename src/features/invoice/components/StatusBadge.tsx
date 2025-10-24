export default function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    PAID: "bg-green-100 text-green-800",
    PARTIALLY_PAID: "bg-blue-100 text-blue-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    OVERDUE: "bg-red-100 text-red-800",
    CANCELLED: "bg-zinc-100 text-zinc-700",
  };

  const colorClass =
    colors[status.toUpperCase()] || "bg-gray-100 text-gray-800";

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${colorClass}`}
    >
      {status.replace("_", " ").toLowerCase()}
    </span>
  );
}
