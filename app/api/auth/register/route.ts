import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { rateLimiters } from '@/lib/middleware/ratelimit';
import { validateBody } from '@/lib/validation';
import { RegisterSchema } from '@/lib/validation/schemas';
import { ApiResponse } from '@/lib/api/response';

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
        log.error('Registration error', error, { endpoint: '/api/auth/register' });
        return ApiResponse.internalError('An error occurred during registration');
    }
}

