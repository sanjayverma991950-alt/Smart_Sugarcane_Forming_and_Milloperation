import { Inbox } from "lucide-react";

export default function EmptyState({ title, text, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-brand-100 bg-white px-6 py-14 text-center">
      <Inbox className="mx-auto h-10 w-10 text-brand-500" />
      <h3 className="mt-3 font-semibold text-gray-900">{title}</h3>
      {text && <p className="mt-1 text-sm text-gray-600">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
