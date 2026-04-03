import { createHmac, timingSafeEqual } from "node:crypto";

function getJwtSecret() {
  return process.env.JWT_SECRET!;
}

export interface AdminTokenPayload {
  role: "admin";
  email: string;
  exp: number;
}

/**
 * Create a signed admin token.
 */
export function createAdminToken(email: string): string {
  const payload: AdminTokenPayload = {
    role: "admin",
    email,
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };

  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");

  const signature = createHmac("sha256", getJwtSecret())
    .update(payloadB64)
    .digest("base64url");

  return `${payloadB64}.${signature}`;
}

/**
 * Verify an admin token's signature, expiration, and role.
 * Returns the decoded payload or null.
 */
export function verifyAdminToken(token: string): AdminTokenPayload | null {
  try {
    const [payloadB64, signature] = token.split(".");

    if (!payloadB64 || !signature) return null;

    const expectedSignature = createHmac("sha256", getJwtSecret())
      .update(payloadB64)
      .digest("base64url");

    const sigBuf = Buffer.from(signature, "base64url");
    const expectedBuf = Buffer.from(expectedSignature, "base64url");
    if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) return null;

    const payload: AdminTokenPayload = JSON.parse(
      Buffer.from(payloadB64, "base64url").toString("utf-8"),
    );

    if (payload.exp < Date.now()) return null;
    if (payload.role !== "admin") return null;

    return payload;
  } catch {
    return null;
  }
}

/**
 * Extract and verify the admin token from an Authorization header.
 * Returns the admin payload or null.
 */
export function getAdminFromRequest(
  request: Request,
): AdminTokenPayload | null {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.slice(7);
  return verifyAdminToken(token);
}
