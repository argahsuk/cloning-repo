import { NextResponse } from "next/server";
import { getSessionFromCookie } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getSessionFromCookie();
    if (!session) {
      return NextResponse.json({ user: null });
    }
    return NextResponse.json({
      user: {
        userId: session.userId,
        name: session.name,
        email: session.email,
        role: session.role,
      },
    });
  } catch (err) {
    console.error("Session error:", err);
    return NextResponse.json({ user: null });
  }
}
