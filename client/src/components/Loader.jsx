import { Loader2 } from "lucide-react";

export default function Loader({ label = "Loading..." }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-brand-700" role="status">
      <Loader2 className="h-6 w-6 animate-spin" />
      <span>{label}</span>
    </div>
  );
}
