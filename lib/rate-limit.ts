import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Only create Redis client if env vars are configured
const isRedisConfigured =
  !!process.env.KV_REST_API_URL && !!process.env.KV_REST_API_TOKEN;

const redis = isRedisConfigured
  ? new Redis({
      url: process.env.KV_REST_API_URL!,
      token: process.env.KV_REST_API_TOKEN!,
    })
  : null;

function createLimiter(
  prefix: string,
  limit: number,
  window: Parameters<typeof Ratelimit.slidingWindow>[1]
) {
  if (!redis) return null;
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(limit, window),
    prefix: `ratelimit:${prefix}`,
    analytics: true,
  });
}

export const rateLimits = {
  /** General API: 60 requests per minute */
  api: createLimiter("api", 60, "1 m"),
  /** Auth (login/register): 5 requests per 15 minutes */
  auth: createLimiter("auth", 5, "15 m"),
  /** Chat (AI): 20 requests per hour */
  chat: createLimiter("chat", 20, "1 h"),
  /** Payment endpoints: 10 requests per hour */
  payment: createLimiter("payment", 10, "1 h"),
  /** Newsletter subscribe: 3 requests per hour */
  newsletter: createLimiter("newsletter", 3, "1 h"),
  /** Password reset: 3 requests per hour */
  passwordReset: createLimiter("password-reset", 3, "1 h"),
};

export type RateLimiter = (typeof rateLimits)[keyof typeof rateLimits];

/**
 * Check rate limit for a given limiter and identifier.
 * Fail-open: if Redis is not configured or an error occurs, allow the request.
 */
export async function checkRateLimit(
  limiter: RateLimiter,
  identifier: string
): Promise<{ success: boolean; limit?: number; remaining?: number; reset?: number }> {
  // If Redis not configured or limiter is null, fail-open
  if (!isRedisConfigured || !limiter) {
    return { success: true };
  }

  try {
    const result = await limiter.limit(identifier);
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  } catch (error) {
    // Fail-open: allow request if rate limiting fails
    console.error("[rate-limit] Error checking rate limit:", error);
    return { success: true };
  }
}
