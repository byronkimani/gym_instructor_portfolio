// Simple in-memory rate limiter
// Suitable for MVP / single-server Vercel deployment

type RateLimitRecord = {
  count: number;
  resetAt: number;
};

const rateLimitCache = new Map<string, RateLimitRecord>();

// Max 5 requests per IP per hour
const MAX_REQUESTS = 5;
const WINDOW_MS = 60 * 60 * 1000; // 1 hour in milliseconds

export function rateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = rateLimitCache.get(ip);

  // If no record exists or the window has passed, reset the count
  if (!record || record.resetAt < now) {
    rateLimitCache.set(ip, {
      count: 1,
      resetAt: now + WINDOW_MS,
    });
    return { allowed: true };
  }

  // If within the window, check the count
  if (record.count >= MAX_REQUESTS) {
    const retryAfterSeconds = Math.ceil((record.resetAt - now) / 1000);
    return { allowed: false, retryAfter: retryAfterSeconds };
  }

  // Increment the count
  record.count += 1;
  return { allowed: true };
}
