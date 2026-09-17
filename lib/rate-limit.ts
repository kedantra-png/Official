/**
 * IP-based in-memory rate limiting utility for API endpoints.
 * Provides brute-force protection for Admin Login and spam protection for Customer Reviews.
 */

interface RateLimitEntry {
  timestamps: number[];
}

// In-memory store for rate limiting by category + IP
const rateLimitStores = new Map<string, Map<string, RateLimitEntry>>();

function getStore(category: string): Map<string, RateLimitEntry> {
  let store = rateLimitStores.get(category);
  if (!store) {
    store = new Map<string, RateLimitEntry>();
    rateLimitStores.set(category, store);
  }
  return store;
}

/**
 * Extracts client IP address from standard reverse-proxy headers or falls back to localhost.
 */
export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }

  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  return "127.0.0.1";
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
}

/**
 * Generic sliding-window rate limit checker.
 * Automatically discards timestamps older than windowMs.
 */
export function checkRateLimit(
  category: string,
  ip: string,
  maxRequests: number,
  windowMs: number,
): RateLimitResult {
  const store = getStore(category);
  const now = Date.now();
  const windowStart = now - windowMs;

  const entry = store.get(ip) ?? { timestamps: [] };

  // Filter out timestamps outside the active window
  entry.timestamps = entry.timestamps.filter((ts) => ts > windowStart);

  if (entry.timestamps.length >= maxRequests) {
    const oldest = entry.timestamps[0];
    const retryAfterMs = Math.max(0, oldest + windowMs - now);
    const retryAfterSeconds = Math.max(1, Math.ceil(retryAfterMs / 1000));

    return {
      allowed: false,
      limit: maxRequests,
      remaining: 0,
      retryAfterSeconds,
    };
  }

  // Record this request
  entry.timestamps.push(now);
  store.set(ip, entry);

  return {
    allowed: true,
    limit: maxRequests,
    remaining: Math.max(0, maxRequests - entry.timestamps.length),
    retryAfterSeconds: 0,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin Login Brute-Force Protection
// 5 attempts allowed per 15-minute window per IP.
// Lockout triggers after 5 failed attempts.
// ─────────────────────────────────────────────────────────────────────────────
const ADMIN_LOGIN_CATEGORY = "admin_login";
const ADMIN_LOGIN_MAX_ATTEMPTS = 5;
const ADMIN_LOGIN_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export function checkAdminLoginLockout(ip: string): RateLimitResult {
  const store = getStore(ADMIN_LOGIN_CATEGORY);
  const now = Date.now();
  const windowStart = now - ADMIN_LOGIN_WINDOW_MS;

  const entry = store.get(ip) ?? { timestamps: [] };
  entry.timestamps = entry.timestamps.filter((ts) => ts > windowStart);
  store.set(ip, entry);

  if (entry.timestamps.length >= ADMIN_LOGIN_MAX_ATTEMPTS) {
    const oldest = entry.timestamps[0];
    const retryAfterMs = Math.max(0, oldest + ADMIN_LOGIN_WINDOW_MS - now);
    const retryAfterSeconds = Math.max(1, Math.ceil(retryAfterMs / 1000));

    return {
      allowed: false,
      limit: ADMIN_LOGIN_MAX_ATTEMPTS,
      remaining: 0,
      retryAfterSeconds,
    };
  }

  return {
    allowed: true,
    limit: ADMIN_LOGIN_MAX_ATTEMPTS,
    remaining: ADMIN_LOGIN_MAX_ATTEMPTS - entry.timestamps.length,
    retryAfterSeconds: 0,
  };
}

export function recordFailedAdminLogin(ip: string): void {
  const store = getStore(ADMIN_LOGIN_CATEGORY);
  const now = Date.now();
  const entry = store.get(ip) ?? { timestamps: [] };
  entry.timestamps.push(now);
  store.set(ip, entry);
}

export function resetAdminLoginAttempts(ip: string): void {
  const store = getStore(ADMIN_LOGIN_CATEGORY);
  store.delete(ip);
}

// ─────────────────────────────────────────────────────────────────────────────
// Customer Reviews Submission Rate Limiting
// Max 3 reviews per 10 minutes per IP to prevent spam and flooding.
// ─────────────────────────────────────────────────────────────────────────────
const REVIEWS_CATEGORY = "customer_reviews";
const REVIEWS_MAX_SUBMISSIONS = 3;
const REVIEWS_WINDOW_MS = 10 * 60 * 1000; // 10 minutes

export function checkReviewSubmissionRateLimit(ip: string): RateLimitResult {
  return checkRateLimit(
    REVIEWS_CATEGORY,
    ip,
    REVIEWS_MAX_SUBMISSIONS,
    REVIEWS_WINDOW_MS,
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Contact Inquiries Submission Rate Limiting
// Max 5 messages per 15 minutes per IP.
// ─────────────────────────────────────────────────────────────────────────────
const CONTACT_CATEGORY = "contact_inquiry";
const CONTACT_MAX_SUBMISSIONS = 5;
const CONTACT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

export function checkContactRateLimit(ip: string): RateLimitResult {
  return checkRateLimit(
    CONTACT_CATEGORY,
    ip,
    CONTACT_MAX_SUBMISSIONS,
    CONTACT_WINDOW_MS,
  );
}
