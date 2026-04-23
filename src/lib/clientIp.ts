import type { NextRequest } from 'next/server';

/**
 * Client IP for rate limiting. Uses the first X-Forwarded-For hop (typical behind one trusted proxy).
 * Do not treat as cryptographically trustworthy — only for coarse abuse throttling.
 */
export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first.slice(0, 128);
  }
  const realIp = request.headers.get('x-real-ip')?.trim();
  if (realIp) return realIp.slice(0, 128);
  return '127.0.0.1';
}
