import { createHmac } from "node:crypto";

function getJwtSecret() {
  return process.env.JWT_SECRET!;
}

interface TokenPayload {
  designId: string;
  codeId: string;
  exp: number;
}

/**
 * Create a signed token containing the given payload.
 * Format: base64url(JSON payload).base64url(HMAC-SHA256 signature)
 */
export function createToken(payload: { designId: string; codeId: string }): string {
  const tokenPayload: TokenPayload = {
    ...payload,
    exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  };

  const payloadB64 = Buffer.from(JSON.stringify(tokenPayload))
    .toString("base64url");

  const signature = createHmac("sha256", getJwtSecret())
    .update(payloadB64)
    .digest("base64url");

  return `${payloadB64}.${signature}`;
}

/**
 * Verify a token's signature and expiration.
 * Returns the decoded payload or throws an error.
 */
export function verifyToken(token: string): TokenPayload {
  const [payloadB64, signature] = token.split(".");

  if (!payloadB64 || !signature) {
    throw new Error("Malformed token");
  }

  const expectedSignature = createHmac("sha256", getJwtSecret())
    .update(payloadB64)
    .digest("base64url");

  if (signature !== expectedSignature) {
    throw new Error("Invalid token signature");
  }

  const payload: TokenPayload = JSON.parse(
    Buffer.from(payloadB64, "base64url").toString("utf-8"),
  );

  if (payload.exp < Date.now()) {
    throw new Error("Token expired");
  }

  return payload;
}
