import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { rateLimiters } from '@/lib/middleware/ratelimit';
import { validateBody } from '@/lib/validation';
import { RegisterSchema } from '@/lib/validation/schemas';
import { ApiResponse } from '@/lib/api/response';

const INVALID_ENV_LITERALS = new Set(['', 'undefined', 'null']);

function normalizeEnvValue(value: string | undefined): string | undefined {
    const trimmedValue = value?.trim();

    if (!trimmedValue) {
        return undefined;
    }

    return INVALID_ENV_LITERALS.has(trimmedValue.toLowerCase()) ? undefined : trimmedValue;
}

function maskValue(value: string | undefined): string {
    if (!value) {
        return 'missing';
    }

    if (value.length <= 8) {
        return `${value.slice(0, 2)}***`;
    }

    return `${value.slice(0, 4)}...${value.slice(-4)}`;
}

export async function POST(request: NextRequest) {
    // Apply rate limiting for authentication
    const rateLimitResponse = await rateLimiters.auth(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    try {
        // Validate request body
        const validation = await validateBody(request, RegisterSchema);
        if (!validation.success) {
            return validation.response;
        }

        const { name, email, password } = validation.data;

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return ApiResponse.error('User with this email already exists', 400);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            }
        });

        // Return user without password
        const userResponse = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            joinDate: user.joinDate,
        };

        return ApiResponse.created(userResponse, 'User created successfully');
    } catch (error: any) {
        const { log } = await import('@/lib/logger');
        const databaseUrl = normalizeEnvValue(process.env.DATABASE_URL);
        const databaseAuthToken = normalizeEnvValue(process.env.DATABASE_AUTH_TOKEN);
        const nextAuthSecret = normalizeEnvValue(process.env.NEXTAUTH_SECRET);

        log.error('Registration error', error, {
            endpoint: '/api/auth/register',
            diagnostics: {
                nodeEnv: process.env.NODE_ENV || 'development',
                vercelEnv: process.env.VERCEL_ENV || 'missing',
                vercelRegion: process.env.VERCEL_REGION || 'missing',
                gitCommitSha: process.env.VERCEL_GIT_COMMIT_SHA || 'missing',
                gitCommitRef: process.env.VERCEL_GIT_COMMIT_REF || 'missing',
                hasDatabaseUrl: Boolean(databaseUrl),
                databaseUrlMasked: maskValue(databaseUrl),
                hasDatabaseAuthToken: Boolean(databaseAuthToken),
                databaseAuthTokenMasked: maskValue(databaseAuthToken),
                hasNextAuthSecret: Boolean(nextAuthSecret),
                nextAuthSecretMasked: maskValue(nextAuthSecret),
            },
        });
        return ApiResponse.internalError('An error occurred during registration');
    }
}

