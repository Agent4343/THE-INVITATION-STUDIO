import { NextResponse } from "next/server";
import { createAdminToken } from "@/lib/adminAuth";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

const ADMIN_LOGIN_LIMIT = {
  windowMs: 10 * 60 * 1000,
  maxRequests: 10,
};

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rateLimit = checkRateLimit(`admin-login:${ip}`, ADMIN_LOGIN_LIMIT);
    if (rateLimit.limited) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfterSeconds),
          },
        },
      );
    }

    const body = await request.text();

    if (!body) {
      return NextResponse.json(
        { error: "Empty request body" },
        { status: 400 },
      );
    }

    let parsed;
    try {
      parsed = JSON.parse(body);
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 },
      );
    }

    const { email, password } = parsed;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        { error: "Admin credentials not configured on server" },
        { status: 500 },
      );
    }

    if (email !== adminEmail || password !== adminPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const token = createAdminToken(email);

    return NextResponse.json({ token, email });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
