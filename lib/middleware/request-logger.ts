import { NextRequest, NextResponse } from 'next/server';
import { log } from '@/lib/logger';

/**
 * Request logging middleware
 * Logs all incoming requests with relevant metadata
 */
export function logRequest(request: NextRequest, response: NextResponse, duration?: number) {
    const { method, url } = request;
    const { status } = response;
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';

    const logData = {
        method,
        url,
        status,
        userAgent,
        ip,
        ...(duration && { duration: `${duration}ms` }),
    };

    // Log based on status code
    if (status >= 500) {
        log.error(`Request failed: ${method} ${url}`, undefined, logData);
    } else if (status >= 400) {
        log.warn(`Request error: ${method} ${url}`, logData);
    } else {
        log.http(`${method} ${url}`, logData);
    }
}

/**
 * Wrapper to add request logging to API route handlers
 */
export function withRequestLogging<T extends any[]>(
    handler: (...args: T) => Promise<NextResponse>
) {
    return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
        const startTime = Date.now();
        let response: NextResponse;

        try {
            response = await handler(request, ...args);
        } catch (error) {
            const duration = Date.now() - startTime;
            log.error('Request handler error', error, {
                method: request.method,
                url: request.url,
            });

            // Return error response
            response = NextResponse.json(
                { success: false, error: 'An internal error occurred' },
                { status: 500 }
            );
            logRequest(request, response, duration);
            return response;
        }

        const duration = Date.now() - startTime;
        logRequest(request, response, duration);
        return response;
    };
}
