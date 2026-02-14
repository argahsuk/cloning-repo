import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Issue from "@/models/Issue";

export async function GET() {
  try {
    await connectDB();
    const categories = await Issue.distinct("category");
    return NextResponse.json(categories.filter(Boolean).sort());
  } catch (err) {
    console.error("Categories error:", err);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
