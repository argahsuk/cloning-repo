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

export function IssueCard({ issue, maxUpvotes = 0 }) {
  const sla = getSlaInfo(issue.createdAt);
  
  const isTrending = 
    maxUpvotes > 0 && 
    (issue.upvoteCount || 0) === maxUpvotes && 
    (issue.upvoteCount || 0) > 0;
    
  const isResolved = issue.status === "Resolved" || issue.status === "Verified";
  const creatorName = issue.createdBy?.name || issue.creator?.name || "Anonymous";

  return (
    <Link href={`/issue/${issue._id}`} className="block w-full">
      <Card className="group relative overflow-hidden transition-all hover:shadow-md hover:border-primary/30 border-slate-200 bg-white">
        {/* STRICT FIXED HEIGHT: h-[165px] 
            This ensures every card in your grid is identical.
        */}
        <div className="flex flex-row h-[165px]">
          
          {/* LEFT SIDE: Image */}
          <div className="relative w-32 sm:w-52 shrink-0 bg-slate-100 overflow-hidden border-r">
            {issue.image ? (
              <img
                src={issue.image}
                alt={issue.title}
                className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
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

          {/* RIGHT SIDE: Content */}
          <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
            <CardContent className="p-4 sm:px-6 flex flex-col h-full relative">
              
              {/* TOP: Title and Badges */}
              <div className="space-y-2">
                <h3 className="line-clamp-1 text-base font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
                  {issue.title}
                </h3>
                
                {/* Tag Container: 
                   h-12 and overflow-hidden ensures that if tags wrap to a 3rd line, 
                   they don't push the footer down.
                */}
                <div className="flex flex-wrap items-center gap-1.5 h-[48px] overflow-hidden content-start">
                  <Badge variant="secondary" className="text-[10px] font-normal px-2 bg-slate-100 whitespace-nowrap">
                    {issue.category}
                  </Badge>
                  <SeverityBadge severity={issue.severity} />
                  <StatusBadge status={issue.status} />
                </div>
              </div>

              {/* BOTTOM: Pushed to the base */}
              <div className="mt-auto">
                <div className="flex items-center justify-between text-sm text-muted-foreground pb-2">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1.5 font-medium text-slate-700">
                      <ThumbsUp className="h-3.5 w-3.5" />
                      {issue.upvoteCount || 0}
                    </span>
                    
                    {!isResolved && (
                      <span className={cn(
                        "flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-medium border whitespace-nowrap", 
                        getSlaColorClass(sla.color)
                      )}>
                        <Clock className="h-3 w-3" />
                        {sla.label}
                      </span>
                    )}
                  </div>

                  {issue.location && (
                    <span className="hidden xl:flex items-center gap-1 text-[10px] opacity-70">
                      <MapPin className="h-3 w-3" />
                      {issue.location.lat.toFixed(1)}, {issue.location.lng.toFixed(1)}
                    </span>
                  )}
                </div>

                <p className="text-[10px] text-muted-foreground border-t border-slate-100 pt-2 truncate">
                  Reported by <span className="font-medium text-slate-600">{creatorName}</span> &middot; {new Date(issue.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
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