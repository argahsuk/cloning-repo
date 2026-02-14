import { cookies } from "next/headers";
import crypto from "crypto";
import connectDB from "./db";
import User from "@/models/User";
import Session, { getExpiresAt } from "@/models/Session";

export const COOKIE_NAME = "civicbridge_session";
const SESSION_SECRET = process.env.SESSION_SECRET || "dev-secret-change-in-production";

function generateSessionId() {
  return crypto.randomBytes(32).toString("hex");
}

export async function createSession(userId, role) {
  await connectDB();
  const sessionId = generateSessionId();
  const expiresAt = getExpiresAt();
  await Session.create({
    sessionId,
    userId,
    role,
    expiresAt,
  });
  return { sessionId, expiresAt };
}

export async function getSessionFromCookie() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(COOKIE_NAME)?.value;
  if (!sessionId) return null;
  await connectDB();
  const session = await Session.findOne({
    sessionId,
    expiresAt: { $gt: new Date() },
  }).lean();
  if (!session) return null;
  const user = await User.findById(session.userId).select("name email role").lean();
  if (!user) return null;
  return {
    userId: session.userId.toString(),
    role: session.role,
    name: user.name,
    email: user.email,
  };
}

export async function destroySession(sessionId) {
  await connectDB();
  await Session.deleteOne({ sessionId });
}

export function getSessionIdFromCookie() {
  return cookies().then((c) => c.get(COOKIE_NAME)?.value);
}
