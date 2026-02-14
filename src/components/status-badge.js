import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_STYLES = {
  Submitted: "bg-slate-100 text-slate-800 border-slate-200",
  Acknowledged: "bg-blue-100 text-blue-800 border-blue-200",
  Assigned: "bg-indigo-100 text-indigo-800 border-indigo-200",
  "In Progress": "bg-amber-100 text-amber-800 border-amber-200",
  Resolved: "bg-green-100 text-green-800 border-green-200",
  Verified: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

export function StatusBadge({ status, className }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "border text-xs font-normal",
        STATUS_STYLES[status] || "bg-slate-100 text-slate-700 border-slate-200",
        className
      )}
    >
      {status || "—"}
    </Badge>
  );
}
