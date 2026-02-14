import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Issue from "@/models/Issue";
import { getSessionFromCookie } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSessionFromCookie();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.role !== "official") {
      return NextResponse.json(
        { error: "Only officials can view analytics" },
        { status: 403 }
      );
    }

    await connectDB();

    const total = await Issue.countDocuments();

    const openStatuses = ["Submitted", "Acknowledged", "Assigned", "In Progress"];
    const openCount = await Issue.countDocuments({ status: { $in: openStatuses } });
    const resolvedCount = await Issue.countDocuments({ status: "Resolved" });
    const verifiedCount = await Issue.countDocuments({ status: "Verified" });
    const resolvedOrVerified = resolvedCount + verifiedCount;

    const resolvedIssues = await Issue.find({
      resolvedAt: { $ne: null },
    })
      .select("createdAt resolvedAt")
      .lean();

    let avgResolutionTimeMs = 0;
    if (resolvedIssues.length > 0) {
      const totalMs = resolvedIssues.reduce(
        (acc, i) => acc + (new Date(i.resolvedAt) - new Date(i.createdAt)),
        0
      );
      avgResolutionTimeMs = totalMs / resolvedIssues.length;
    }

    const categoryCounts = await Issue.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);
    const mostCommonCategory =
      categoryCounts.length > 0 ? categoryCounts[0]._id : "N/A";

    const trending = await Issue.find({ status: { $in: openStatuses } })
      .sort({ upvotes: -1 })
      .limit(1)
      .populate("createdBy", "name")
      .lean();

    const trendingIssue =
      trending.length > 0
        ? {
            _id: trending[0]._id.toString(),
            title: trending[0].title,
            upvoteCount: (trending[0].upvotes || []).length,
            createdBy: trending[0].createdBy?.name,
          }
        : null;

    return NextResponse.json({
      totalIssues: total,
      openIssues: openCount,
      resolvedIssues: resolvedOrVerified,
      avgResolutionTimeMs: Math.round(avgResolutionTimeMs),
      mostCommonCategory,
      trendingIssue,
    });
  } catch (err) {
    console.error("Analytics error:", err);
    return NextResponse.json(
      { error: "Failed to load analytics" },
      { status: 500 }
    );
  }
}
