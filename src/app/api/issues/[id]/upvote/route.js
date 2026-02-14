import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Issue from "@/models/Issue";
import { getSessionFromCookie } from "@/lib/auth";

export async function POST(request, { params }) {
  try {
    const session = await getSessionFromCookie();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = params.id;
    await connectDB();

    const issue = await Issue.findById(id);
    if (!issue) {
      return NextResponse.json({ error: "Issue not found" }, { status: 404 });
    }

    const userId = session.userId;
    const upvotes = issue.upvotes || [];
    const alreadyVoted = upvotes.some((id) => id.toString() === userId);

    if (alreadyVoted) {
      return NextResponse.json(
        { error: "You have already upvoted this issue" },
        { status: 400 }
      );
    }

    upvotes.push(userId);
    issue.upvotes = upvotes;
    await issue.save();

    return NextResponse.json({
      success: true,
      upvoteCount: upvotes.length,
    });
  } catch (err) {
    console.error("Upvote error:", err);
    return NextResponse.json(
      { error: "Failed to upvote" },
      { status: 500 }
    );
  }
}
