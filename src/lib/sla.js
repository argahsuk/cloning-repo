export function getSlaInfo(createdAt) {
  if (!createdAt) return { color: "muted", label: "—" };
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now - created;
  const hours = diffMs / (1000 * 60 * 60);
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hrs = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  let color = "muted";
  if (hours < 24) color = "green";
  else if (hours < 48) color = "yellow";
  else color = "red";

  let label;
  if (days > 0) {
    label = `Open ${days}d ${hrs}h`;
  } else {
    label = `Open ${hrs}h`;
  }
  return { color, label };
}

export function getSlaColorClass(color) {
  switch (color) {
    case "green":
      return "bg-green-100 text-green-800 border-green-200";
    case "yellow":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "red":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
}
