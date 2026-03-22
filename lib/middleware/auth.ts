import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Custom error classes
export class UnauthorizedError extends Error {
    status = 401;
    constructor(message = 'Unauthorized') {
        super(message);
        this.name = 'UnauthorizedError';
    }
}

export class ForbiddenError extends Error {
    status = 403;
    constructor(message = 'Forbidden: Insufficient permissions') {
        super(message);
        this.name = 'ForbiddenError';
    }
}

export class NotFoundError extends Error {
    status = 404;
    constructor(message = 'Resource not found') {
        super(message);
        this.name = 'NotFoundError';
    }
}

// Type-safe session with role
export interface AuthenticatedSession {
    user: {
        id: string;
        email: string;
        name: string;
        role: 'member' | 'admin' | 'leader';
    };
}

function normalizeRole(role: string | undefined): 'member' | 'admin' | 'leader' {
    const normalizedRole = role?.toLowerCase();

    if (normalizedRole === 'admin' || normalizedRole === 'leader') {
        return normalizedRole;
    }

    return 'member';
}

/**
 * Require authentication for a route
 * @throws UnauthorizedError if not authenticated
 */
export async function requireAuth(): Promise<AuthenticatedSession> {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
        throw new UnauthorizedError();
    }

    return session as AuthenticatedSession;
}

/**
 * Require specific role(s) for a route
 * @param roles - Array of allowed roles
 * @throws UnauthorizedError if not authenticated
 * @throws ForbiddenError if user doesn't have required role
 */
export async function requireRole(
    roles: ('admin' | 'leader' | 'member')[]
): Promise<AuthenticatedSession> {
    const session = await requireAuth();
    const userRole = normalizeRole(session.user.role);

    if (!roles.includes(userRole)) {
        throw new ForbiddenError(`Access requires one of: ${roles.join(', ')}`);
    }

    return session;
}

/**
 * Require admin or leader role
 */
export async function requireAdminOrLeader(): Promise<AuthenticatedSession> {
    return requireRole(['admin', 'leader']);
}

/**
 * Require admin role only
 */
export async function requireAdmin(): Promise<AuthenticatedSession> {
    return requireRole(['admin']);
}

/**
 * Wrapper for API route handlers with error handling
 */
export function withAuth<T extends any[]>(
    handler: (session: AuthenticatedSession, ...args: T) => Promise<NextResponse>,
    options?: { requireRole?: ('admin' | 'leader' | 'member')[] }
) {
    return async (...args: T): Promise<NextResponse> => {
        try {
            const session = options?.requireRole
                ? await requireRole(options.requireRole)
                : await requireAuth();

            return await handler(session, ...args);
        } catch (error) {
            if (error instanceof UnauthorizedError) {
                return NextResponse.json(
                    { error: error.message },
                    { status: error.status }
                );
            }
            if (error instanceof ForbiddenError) {
                return NextResponse.json(
                    { error: error.message },
                    { status: error.status }
                );
            }
            throw error; // Re-throw unknown errors
        }
    };
}
