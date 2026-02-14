"use client";

import { useState } from "react";
import useSWR from "swr";
import { IssueCard } from "@/components/IssueCard";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES } from "@/lib/constants";
import { Loader2, LayoutGrid, SlidersHorizontal } from "lucide-react";

const fetcher = async (url) => {
  const r = await fetch(url);
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data?.error || "Failed to fetch issues");
  return data;
};

export default function DashboardPage() {
  const [category, setCategory] = useState("all");
  const [severity, setSeverity] = useState("all");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("newest");

  const params = new URLSearchParams();
  if (category && category !== "all") params.set("category", category);
  if (severity && severity !== "all") params.set("severity", severity);
  if (status && status !== "all") params.set("status", status);
  params.set("sort", sort === "oldest_open" ? "oldest" : sort);

  const { data, error, isLoading } = useSWR(
    `/api/issues?${params.toString()}`,
    fetcher,
    { refreshInterval: 15000 },
  );

  // Safety check for data structure
  const issues = Array.isArray(data) ? data : data?.issues || [];

  const maxUpvotes =
    issues.length > 0 ? Math.max(...issues.map((i) => i.upvoteCount || 0)) : 0;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Public Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          Track civic issues reported by the community
        </p>
      </div>
      <div className="mb-6 flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </div>
        <div className="flex flex-1 flex-wrap gap-3">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={severity} onValueChange={setSeverity}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severity</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="High">High</SelectItem>
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Submitted">Submitted</SelectItem>
              <SelectItem value="Acknowledged">Acknowledged</SelectItem>
              <SelectItem value="Assigned">Assigned</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
              <SelectItem value="Verified">Verified</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="upvotes">Most Upvoted</SelectItem>
              <SelectItem value="oldest_open">Oldest Open</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {(category !== "all" || severity !== "all" || status !== "all") && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setCategory("all");
              setSeverity("all");
              setStatus("all");
            }}
          >
            Clear
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : issues.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-20">
          <LayoutGrid className="h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold text-foreground">
            No issues found
          </h3>
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-muted-foreground  tracking-tight ">
            {issues.length} total reports found
          </p>

          {/* WIDE GRID: 2 columns on desktop forces the cards to be wide */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            {issues.map((issue) => (
              <IssueCard
                key={issue._id}
                issue={issue}
                maxUpvotes={maxUpvotes}
              />
            ))}
          </div>
        </>
      )}
    </main>
  );
}
