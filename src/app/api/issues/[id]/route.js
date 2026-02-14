import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Issue from "@/models/Issue";
import { getSessionFromCookie } from "@/lib/auth";

const VALID_STATUSES = ["Submitted", "Acknowledged", "Assigned", "In Progress", "Resolved", "Verified"];

export async function GET(request, { params }) {
  try {
    const id = params.id;
    await connectDB();

    const issue = await Issue.findById(id)
      .populate("createdBy", "name email")
      .populate("statusHistory.updatedBy", "name")
      .lean();

    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    const upvoteIds = (issue.upvotes || []).map((id) => id.toString());
    const serialized = {
      ...issue,
      _id: issue._id.toString(),
      createdBy: issue.createdBy
        ? {
            _id: issue.createdBy._id.toString(),
            name: issue.createdBy.name,
            email: issue.createdBy.email,
          }
        : null,
      upvoteCount: upvoteIds.length,
      upvotes: upvoteIds,
      statusHistory: (issue.statusHistory || []).map((h) => ({
        ...h,
        updatedBy: h.updatedBy
          ? { _id: h.updatedBy._id.toString(), name: h.updatedBy.name }
          : null,
      })),
    };

    return NextResponse.json(serialized);
  } catch (err) {
    console.error("Issue get error:", err);
    return NextResponse.json(
      { error: "Failed to fetch issue" },
      { status: 500 }
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const session = await getSessionFromCookie();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (session.role !== "official") {
      return NextResponse.json(
        { error: "Only officials can update issue status" },
        { status: 403 }
      );
    }

    const id = params.id;
    const body = await request.json();
    const { status, note, resolutionImage } = body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: "Valid status is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const issue = await Issue.findById(id);
    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    issue.status = status;
    issue.statusHistory.push({
      status,
      updatedBy: session.userId,
      note: (note || "").trim(),
      timestamp: new Date(),
    });

    if (resolutionImage) {
      issue.resolutionImage = resolutionImage;
    }

    if (status === "Resolved" && !issue.resolvedAt) {
      issue.resolvedAt = new Date();
    }

    await issue.save();

    return NextResponse.json({
      success: true,
      issue: {
        _id: issue._id.toString(),
        status: issue.status,
        resolvedAt: issue.resolvedAt,
        statusHistory: issue.statusHistory,
      },
    });
  } catch (err) {
    console.error("Issue update error:", err);
    return NextResponse.json(
      { error: "Failed to update issue" },
      { status: 500 }
    );
  }
}
