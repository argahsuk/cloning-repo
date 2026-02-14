import { NextResponse } from "next/server";
import { destroySession, getSessionIdFromCookie, COOKIE_NAME } from "@/lib/auth";

export async function POST() {
  try {
    const sessionId = await getSessionIdFromCookie();
    if (sessionId) {
      await destroySession(sessionId);
    }

    const res = NextResponse.json({ success: true });
    res.cookies.set(COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      path: "/",
    });
    return res;
  } catch (err) {
    console.error("Logout error:", err);
    return NextResponse.json({ success: true });
  }
}
