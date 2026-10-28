import { Inbox } from "lucide-react";

export default function EmptyState({ title, text, action }) {
  return (
    <div className="rounded-2xl sm:rounded-3xl border border-dashed border-brand-200 bg-white px-4 py-8 sm:px-6 sm:py-14 text-center">
      <Inbox className="mx-auto h-9 w-9 sm:h-10 sm:w-10 text-brand-500" />
      <h3 className="mt-3 font-semibold text-gray-900 text-base sm:text-lg">{title}</h3>
      {text && <p className="mt-1 text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">{text}</p>}
      {action && <div className="mt-4 sm:mt-5">{action}</div>}
    </div>
  );
}
