import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const SEVERITY_STYLES = {
  Low: "bg-green-100 text-green-800 border-green-200",
  Medium: "bg-amber-100 text-amber-800 border-amber-200",
  High: "bg-red-100 text-red-800 border-red-200",
};

export function SeverityBadge({ severity, className }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "border text-xs font-normal",
        SEVERITY_STYLES[severity] || "bg-slate-100 text-slate-700 border-slate-200",
        className
      )}
    >
      {severity || "—"}
    </Badge>
  );
}
