import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth';
import { rateLimiters } from '@/lib/middleware/ratelimit';
import { ApiResponse } from '@/lib/api/response';
import { log } from '@/lib/logger';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request: NextRequest) {
    // Apply rate limiting
    const rateLimitResponse = await rateLimiters.api(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    try {
        const session = await requireAuth();

        await dbConnect();

        const user = await User.findById(session.user.id).select('-password');

        if (!user) {
            return ApiResponse.error('User not found', 404);
        }

        return ApiResponse.success({ user });
    } catch (error: any) {
        log.error('Get user error', error, { endpoint: '/api/user' });
        return ApiResponse.internalError('An error occurred while fetching user data');
    }
}

export async function PATCH(request: NextRequest) {
    // Apply rate limiting
    const rateLimitResponse = await rateLimiters.api(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    try {
        const session = await requireAuth();

        // Validate request body
        const { validateBody } = await import('@/lib/validation');
        const { UpdateProfileSchema } = await import('@/lib/validation/schemas');
        const validation = await validateBody(request, UpdateProfileSchema);
        if (!validation.success) {
            return validation.response;
        }

        const updates = validation.data;

        await dbConnect();

        const user = await User.findByIdAndUpdate(
            session.user.id,
            { $set: updates },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return ApiResponse.error('User not found', 404);
        }

        return ApiResponse.success({ user });
    } catch (error: any) {
        log.error('Update user error', error, { endpoint: '/api/user' });
        return ApiResponse.internalError('An error occurred while updating user data');
    }
}
