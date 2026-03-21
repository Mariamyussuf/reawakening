import { NextRequest, NextResponse } from 'next/server';

type RateLimitState = {
    count: number;
    reset: number;
};

const rateLimitStore = new Map<string, RateLimitState>();

// Rate limit configurations
export const RateLimitConfig = {
    // Authentication endpoints - strict limits
    auth: {
        window: '15 m',
        limit: 5,
    },
    // General API endpoints
    api: {
        window: '1 m',
        limit: 60,
    },
    // File upload endpoints
    upload: {
        window: '1 h',
        limit: 10,
    },
    // Search endpoints
    search: {
        window: '1 m',
        limit: 30,
    },
    // Admin endpoints - more lenient for authenticated admins
    admin: {
        window: '1 m',
        limit: 100,
    },
} as const;

function parseWindow(window: string): number {
    const match = window.match(/^(\d+)\s?(ms|s|m|h|d)$/i);

    if (!match) {
        throw new Error(`Unable to parse rate limit window: ${window}`);
    }

    const value = Number.parseInt(match[1], 10);
    const unit = match[2].toLowerCase();

    switch (unit) {
        case 'ms':
            return value;
        case 's':
            return value * 1000;
        case 'm':
            return value * 60 * 1000;
        case 'h':
            return value * 60 * 60 * 1000;
        case 'd':
            return value * 24 * 60 * 60 * 1000;
        default:
            throw new Error(`Unsupported rate limit unit: ${unit}`);
    }
}

function cleanupExpiredEntries(now: number): void {
    for (const [key, value] of rateLimitStore.entries()) {
        if (value.reset <= now) {
            rateLimitStore.delete(key);
        }
    }
}

function getIdentifier(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') || 'unknown';
    return ip;
}

function limitInMemory(
    scope: string,
    identifier: string,
    config: { window: string; limit: number }
): { success: boolean; limit: number; remaining: number; reset: number } {
    const now = Date.now();
    const windowMs = parseWindow(config.window);
    const key = `${scope}:${identifier}`;

    cleanupExpiredEntries(now);

    const existing = rateLimitStore.get(key);

    if (!existing) {
        const reset = now + windowMs;
        rateLimitStore.set(key, { count: 1, reset });
        return {
            success: true,
            limit: config.limit,
            remaining: config.limit - 1,
            reset,
        };
    }

    existing.count += 1;

    return {
        success: existing.count <= config.limit,
        limit: config.limit,
        remaining: Math.max(0, config.limit - existing.count),
        reset: existing.reset,
    };
}

export async function rateLimit(
    request: NextRequest,
    config: { window: string; limit: number } = RateLimitConfig.api
): Promise<NextResponse | null> {
    try {
        const identifier = getIdentifier(request);
        const scope = `${config.limit}:${config.window}`;
        const { success, limit, remaining, reset } = limitInMemory(scope, identifier, config);

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

        return null;
    } catch (error) {
        console.error('Rate limit error:', error);
        return null;
    }
}

export const rateLimiters = {
    auth: (request: NextRequest) => rateLimit(request, RateLimitConfig.auth),
    api: (request: NextRequest) => rateLimit(request, RateLimitConfig.api),
    upload: (request: NextRequest) => rateLimit(request, RateLimitConfig.upload),
    search: (request: NextRequest) => rateLimit(request, RateLimitConfig.search),
    admin: (request: NextRequest) => rateLimit(request, RateLimitConfig.admin),
};

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
