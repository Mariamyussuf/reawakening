import { NextResponse } from 'next/server';

/**
 * Standardized API response utility
 * Ensures consistent response format across all endpoints
 */
export class ApiResponse {
    /**
     * Success response
     * @param data - Response data
     * @param status - HTTP status code (default: 200)
     * @param message - Optional success message
     */
    static success<T>(data: T, status = 200, message?: string) {
        const response: any = {
            success: true,
            data,
        };

        if (message) {
            response.message = message;
        }

        return NextResponse.json(response, { status });
    }

    /**
     * Error response
     * @param message - Error message
     * @param status - HTTP status code (default: 400)
     * @param details - Optional error details
     */
    static error(message: string, status = 400, details?: any) {
        const response: any = {
            success: false,
            error: message,
        };

        if (details) {
            response.details = details;
        }

        return NextResponse.json(response, { status });
    }

    /**
     * Created response (201)
     */
    static created<T>(data: T, message?: string) {
        return this.success(data, 201, message);
    }

    /**
     * No content response (204)
     */
    static noContent() {
        return new NextResponse(null, { status: 204 });
    }

    /**
     * Unauthorized response (401)
     */
    static unauthorized(message = 'Unauthorized') {
        return this.error(message, 401);
    }

    /**
     * Forbidden response (403)
     */
    static forbidden(message = 'Forbidden: Insufficient permissions') {
        return this.error(message, 403);
    }

    /**
     * Not found response (404)
     */
    static notFound(message = 'Resource not found') {
        return this.error(message, 404);
    }

    /**
     * Conflict response (409)
     */
    static conflict(message = 'Resource conflict') {
        return this.error(message, 409);
    }

    /**
     * Too many requests response (429)
     */
    static tooManyRequests(message = 'Too many requests', retryAfter?: number) {
        const response: any = {
            success: false,
            error: message,
        };

        if (retryAfter) {
            response.retryAfter = retryAfter;
        }

        return NextResponse.json(response, { status: 429 });
    }

    /**
     * Internal server error response (500)
     */
    static internalError(message = 'An internal error occurred') {
        return this.error(message, 500);
    }
}
