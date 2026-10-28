const colors = {
  Draft: "bg-gray-100 text-gray-700",
  "Pending Review": "bg-yellow-100 text-yellow-800",
  Approved: "bg-green-100 text-green-800",
  Released: "bg-blue-100 text-blue-800",
  "Partially Supplied": "bg-indigo-100 text-indigo-800",
  Completed: "bg-emerald-100 text-emerald-800",
  Expired: "bg-orange-100 text-orange-800",
  Rejected: "bg-red-100 text-red-800",
  Cancelled: "bg-gray-200 text-gray-600",
  Paid: "bg-emerald-100 text-emerald-800",
  "Partially Paid": "bg-indigo-100 text-indigo-800",
  "On Hold": "bg-orange-100 text-orange-800",
  Disputed: "bg-red-100 text-red-800",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
        colors[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}
