"use client";

import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SeverityBadge } from "@/components/severity-badge";
import { StatusBadge } from "@/components/status-badge";
import { getSlaInfo, getSlaColorClass } from "@/lib/sla";
import { ThumbsUp, Clock, MapPin, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * IssueCard Component
 * Wide layout with restored fixed height and pill-shaped SLA badge.
 */
export function IssueCard({ issue, maxUpvotes = 0 }) {
  const sla = getSlaInfo(issue.createdAt);
  
  const isTrending = 
    maxUpvotes > 0 && 
    (issue.upvoteCount || 0) === maxUpvotes && 
    (issue.upvoteCount || 0) > 0;
    
  const isResolved = issue.status === "Resolved" || issue.status === "Verified";
  const creatorName = issue.creator?.name || issue.createdBy?.name || "Anonymous";

  return (
    <Link href={`/issues/${issue._id}`} className="block w-full">
      <Card className="group relative overflow-hidden transition-all hover:shadow-md hover:border-primary/30 border-slate-200 bg-white">
        {/* Restored fixed height to h-[160px] to prevent it from looking "long" */}
        <div className="flex flex-row h-[160px]">
          
          {/* LEFT SIDE: IMAGE - Made wider (w-48) to contribute to the "Wide" feel */}
          <div className="relative w-36 sm:w-48 shrink-0 bg-slate-100 overflow-hidden border-r">
            {issue.image ? (
              <img
                src={issue.image}
                alt={issue.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-slate-300">
                <MapPin className="h-8 w-8 opacity-20" />
              </div>
            )}
            
            {isTrending && (
              <div className="absolute top-2 left-2 z-10">
                <Badge className="bg-destructive/10 text-destructive border-destructive/20 gap-1 px-2 py-0 text-[10px] font-bold uppercase tracking-wider" variant="outline">
                  <Flame className="h-3 w-3" />
                  Hot
                </Badge>
              </div>
            )}
          </div>

          {/* RIGHT SIDE: CONTENT - Increased horizontal padding for width */}
          <div className="flex flex-1 flex-col min-w-0">
            <CardContent className="p-4 sm:px-6 flex flex-col h-full justify-between">
              
              {/* Top Section */}
              <div className="space-y-1.5">
                <h3 className="line-clamp-1 text-base font-semibold leading-snug text-foreground group-hover:text-primary transition-colors">
                  {issue.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="text-xs font-normal px-2 bg-slate-100">
                    {issue.category}
                  </Badge>
                  <SeverityBadge severity={issue.severity} />
                  <StatusBadge status={issue.status} />
                </div>
              </div>

              {/* Bottom Metrics & Metadata */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-6">
                    <span className="flex items-center gap-1.5 font-medium">
                      <ThumbsUp className="h-3.5 w-3.5" />
                      {issue.upvoteCount || 0}
                    </span>
                    
                    {!isResolved && (
                      /* FIXED: px-4 and rounded-full creates the non-popped pill shape */
                      <span className={cn(
                        "flex items-center gap-1.5 rounded-full px-4 py-0.5 text-xs font-medium border whitespace-nowrap", 
                        getSlaColorClass(sla.color)
                      )}>
                        <Clock className="h-3 w-3" />
                        {sla.label}
                      </span>
                    )}
                  </div>

                  {issue.location && (
                    <span className="hidden md:flex items-center gap-1 text-xs">
                      <MapPin className="h-3.5 w-3.5" />
                      {issue.location.lat.toFixed(2)}, {issue.location.lng.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Footer exactly as requested */}
                <p className="text-xs text-muted-foreground pt-2 border-t border-slate-50">
                  Reported by <span className="font-medium text-slate-600">{creatorName}</span> &middot; {new Date(issue.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>

            </CardContent>
          </div>
          
        </div>
      </Card>
    </Link>
  );
}