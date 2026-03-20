import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Redis client (optional - falls back to in-memory if not configured)
let redis: Redis | null = null;
let ratelimiters: Map<string, Ratelimit> = new Map();

// Initialize Redis if UPSTASH_REDIS_REST_URL is provided
import { env } from '@/lib/env';

if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
    redis = new Redis({
        url: env.UPSTASH_REDIS_REST_URL,
        token: env.UPSTASH_REDIS_REST_TOKEN,
    });
}

// Rate limit configurations
export const RateLimitConfig = {
    // Authentication endpoints - strict limits
    auth: {
        window: '15 m', // 15 minutes
        limit: 5, // 5 attempts per 15 minutes
    },
    // General API endpoints
    api: {
        window: '1 m', // 1 minute
        limit: 60, // 60 requests per minute
    },
    // File upload endpoints
    upload: {
        window: '1 h', // 1 hour
        limit: 10, // 10 uploads per hour
    },
    // Search endpoints
    search: {
        window: '1 m', // 1 minute
        limit: 30, // 30 searches per minute
    },
    // Admin endpoints - more lenient for authenticated admins
    admin: {
        window: '1 m', // 1 minute
        limit: 100, // 100 requests per minute
    },
} as const;

/**
 * Get or create a rate limiter instance
 */
function getRateLimiter(key: string, config: { window: string; limit: number }): Ratelimit {
    if (ratelimiters.has(key)) {
        return ratelimiters.get(key)!;
    }

    const ratelimit = redis
        ? new Ratelimit({
              redis,
              limiter: Ratelimit.slidingWindow(config.limit, config.window),
              analytics: true,
          })
        : // Fallback to in-memory if Redis not configured
          new Ratelimit({
              redis: {
                  sadd: async () => {},
                  eval: async () => ({ remaining: config.limit, reset: Date.now() + 60000 }),
              } as any,
              limiter: Ratelimit.slidingWindow(config.limit, config.window),
              analytics: true,
          });

    ratelimiters.set(key, ratelimit);
    return ratelimit;
}

/**
 * Get client identifier for rate limiting
 */
function getIdentifier(request: NextRequest): string {
    // Try to get user ID from session if available
    // For now, use IP address as fallback
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'unknown';
    return ip;
}

/**
 * Rate limit middleware
 * @param request - NextRequest object
 * @param config - Rate limit configuration
 * @returns NextResponse with error if rate limited, null if allowed
 */
export async function rateLimit(
    request: NextRequest,
    config: { window: string; limit: number } = RateLimitConfig.api
): Promise<NextResponse | null> {
    try {
        const identifier = getIdentifier(request);
        const ratelimit = getRateLimiter('default', config);

        const { success, limit, remaining, reset } = await ratelimit.limit(identifier);

        // Add rate limit headers
        const headers = new Headers();
        headers.set('X-RateLimit-Limit', limit.toString());
        headers.set('X-RateLimit-Remaining', remaining.toString());
        headers.set('X-RateLimit-Reset', new Date(reset).toISOString());

        if (!success) {
            return NextResponse.json(
                {
                    error: 'Too many requests. Please try again later.',
                    retryAfter: Math.ceil((reset - Date.now()) / 1000),
                },
                {
                    status: 429,
                    headers,
                }
            );
        }

        return null; // Request allowed
    } catch (error) {
        // If rate limiting fails, allow the request (fail open)
        console.error('Rate limit error:', error);
        return null;
    }
}

/**
 * Rate limit wrapper for specific endpoint types
 */
export const rateLimiters = {
    auth: (request: NextRequest) => rateLimit(request, RateLimitConfig.auth),
    api: (request: NextRequest) => rateLimit(request, RateLimitConfig.api),
    upload: (request: NextRequest) => rateLimit(request, RateLimitConfig.upload),
    search: (request: NextRequest) => rateLimit(request, RateLimitConfig.search),
    admin: (request: NextRequest) => rateLimit(request, RateLimitConfig.admin),
};

/**
 * Higher-order function to wrap API route handlers with rate limiting
 */
export function withRateLimit<T extends any[]>(
    handler: (...args: T) => Promise<NextResponse>,
    config: { window: string; limit: number } = RateLimitConfig.api
) {
    return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
        const rateLimitResponse = await rateLimit(request, config);
        if (rateLimitResponse) {
            return rateLimitResponse;
        }
        return handler(request, ...args);
    };
}
