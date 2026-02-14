"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import SlaTimer from "@/components/SlaTimer";

const SEVERITY_COLORS = {
  Low: "bg-green-100 text-green-800",
  Medium: "bg-yellow-100 text-yellow-800",
  High: "bg-red-100 text-red-800",
};

const STATUS_COLORS = {
  Submitted: "bg-slate-100 text-slate-800",
  Acknowledged: "bg-blue-100 text-blue-800",
  Assigned: "bg-indigo-100 text-indigo-800",
  "In Progress": "bg-amber-100 text-amber-800",
  Resolved: "bg-green-100 text-green-800",
  Verified: "bg-emerald-100 text-emerald-800",
};

export default function IssueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [issue, setIssue] = useState(null);
  const [user, setUser] = useState(null);
  const [upvoting, setUpvoting] = useState(false);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => setUser(data.user));
  }, []);

  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/issues/${params.id}`)
      .then((r) => r.json())
      .then((data) => setIssue(data))
      .catch(() => setIssue(null));
  }, [params.id]);

  const hasUpvoted = user && issue && (issue.upvotes || []).includes(user.userId);
  const upvoteCount = issue ? (issue.upvoteCount ?? (issue.upvotes || []).length) : 0;

  async function handleUpvote() {
    if (!user || hasUpvoted || upvoting) return;
    setUpvoting(true);
    try {
      const res = await fetch(`/api/issues/${params.id}/upvote`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setIssue((prev) => ({
          ...prev,
          upvoteCount: data.upvoteCount,
          upvotes: [...(prev.upvotes || []), user.userId],
        }));
      }
    } finally {
      setUpvoting(false);
    }
  }

  if (!issue) {
    return (
      <div className="text-slate-500">
        Loading… or issue not found. <Link href="/dashboard" className="text-blue-600 underline">Back to dashboard</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/dashboard" className="text-blue-600 hover:underline text-sm mb-4 inline-block">
        ← Back to dashboard
      </Link>

      <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-2xl font-bold text-slate-800">{issue.title}</h1>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className={`text-sm px-2 py-1 rounded ${SEVERITY_COLORS[issue.severity] || ""}`}>
              {issue.severity}
            </span>
            <span className={`text-sm px-2 py-1 rounded ${STATUS_COLORS[issue.status] || ""}`}>
              {issue.status}
            </span>
            <span className="text-sm px-2 py-1 rounded bg-slate-100 text-slate-700">
              {issue.category}
            </span>
          </div>
          <p className="mt-3 text-slate-600 whitespace-pre-wrap">{issue.description}</p>
          {issue.image && (
            <div className="mt-4">
              <img
                src={issue.image}
                alt="Issue"
                className="max-w-full max-h-64 rounded border border-slate-200"
              />
            </div>
          )}
          {issue.location?.lat != null && issue.location?.lng != null && (
            <p className="mt-2 text-sm text-slate-500">
              Location: {issue.location.lat.toFixed(4)}, {issue.location.lng.toFixed(4)}
            </p>
          )}
          <div className="mt-4 flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <button
                onClick={handleUpvote}
                disabled={!user || hasUpvoted || upvoting}
                className={`px-3 py-1.5 rounded font-medium text-sm transition ${
                  hasUpvoted
                    ? "bg-slate-200 text-slate-500 cursor-default"
                    : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                }`}
              >
                👍 Upvote {upvoteCount}
              </button>
              {!user && (
                <span className="text-xs text-slate-500">Log in to upvote</span>
              )}
            </div>
            <SlaTimer
              createdAt={issue.createdAt}
              resolvedAt={issue.resolvedAt}
              className="text-sm"
            />
            <span className="text-sm text-slate-500">
              Reported by {issue.createdBy?.name || "—"} on{" "}
              {new Date(issue.createdAt).toLocaleString()}
            </span>
          </div>
        </div>

        {issue.resolutionImage && (
          <div className="p-6 border-t border-slate-200 bg-slate-50">
            <h3 className="font-semibold text-slate-800 mb-2">Resolution image</h3>
            <img
              src={issue.resolutionImage}
              alt="Resolution"
              className="max-w-full max-h-64 rounded border border-slate-200"
            />
          </div>
        )}

        <div className="p-6 border-t border-slate-200">
          <h3 className="font-semibold text-slate-800 mb-3">Status timeline</h3>
          <div className="relative pl-6 border-l-2 border-slate-200 space-y-4">
            {(issue.statusHistory || []).map((entry, i) => (
              <div key={i} className="relative -left-6">
                <div className="absolute left-0 w-3 h-3 rounded-full bg-blue-500 -translate-x-[7px] mt-1.5" />
                <div className="pl-4">
                  <span className={`text-sm px-2 py-0.5 rounded ${STATUS_COLORS[entry.status] || ""}`}>
                    {entry.status}
                  </span>
                  <p className="text-sm text-slate-600 mt-1">
                    {entry.updatedBy?.name || "—"} · {new Date(entry.timestamp).toLocaleString()}
                  </p>
                  {entry.note && (
                    <p className="text-sm text-slate-500 mt-0.5 italic">{entry.note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
