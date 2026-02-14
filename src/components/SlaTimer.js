export function getSlaColor(createdAt) {
  if (!createdAt) return "text-slate-500";
  const now = new Date();
  const created = new Date(createdAt);
  const hours = (now - created) / (1000 * 60 * 60);
  if (hours < 24) return "text-green-600";
  if (hours < 48) return "text-yellow-600";
  return "text-red-600";
}

export function formatSlaDuration(createdAt) {
  if (!createdAt) return "—";
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now - created;
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  if (days > 0) {
    return `Open for ${days} day${days !== 1 ? "s" : ""} ${hours} hour${hours !== 1 ? "s" : ""}`;
  }
  return `Open for ${hours} hour${hours !== 1 ? "s" : ""}`;
}

export default function SlaTimer({ createdAt, resolvedAt, className = "" }) {
  const isResolved = resolvedAt || false;
  const colorClass = isResolved ? "text-slate-500" : getSlaColor(createdAt);
  const text = isResolved
    ? "Resolved"
    : formatSlaDuration(createdAt);

  return (
    <span className={`font-medium ${colorClass} ${className}`}>
      {text}
    </span>
  );
}
