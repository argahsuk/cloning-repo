"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import IssuesMap from "@/components/IssuesMap";

export default function MapPage() {
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    fetch("/api/issues")
      .then((r) => r.json())
      .then(setIssues)
      .catch(() => setIssues([]));
  }, []);

  const withLocation = issues.filter(
    (i) => i.location?.lat != null && i.location?.lng != null
  );

  return (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <Link href="/dashboard" className="text-blue-600 hover:underline text-sm">
          ← Dashboard
        </Link>
        <h1 className="text-xl font-bold text-slate-800">Issue map</h1>
      </div>
      <p className="text-slate-600 text-sm mb-4">
        {withLocation.length} of {issues.length} issues have location data.
      </p>
      <IssuesMap issues={issues} />
    </div>
  );
}
