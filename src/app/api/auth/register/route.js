import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: "Name, email, password and role are required" },
        { status: 400 }
      );
    }

    if (!["resident", "official"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    await connectDB();

    const normalizedEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail }).lean();
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Register error:", err);
    const isDev = process.env.NODE_ENV === "development";
    const message =
      err.message?.includes("MONGODB_URI") || err.message?.includes("connection")
        ? "Database not configured. Add MONGODB_URI to .env.local and restart the server."
        : isDev
          ? err.message || "Registration failed"
          : "Registration failed";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
