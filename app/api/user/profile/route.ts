import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth';
import { rateLimiters } from '@/lib/middleware/ratelimit';
import { validateBody } from '@/lib/validation';
import { UpdateProfileSchema } from '@/lib/validation/schemas';
import { ApiResponse } from '@/lib/api/response';
import { log } from '@/lib/logger';
import prisma from '@/lib/prisma';

// PUT /api/user/profile - Update user profile
export async function PUT(request: NextRequest) {
    // Apply rate limiting
    const rateLimitResponse = await rateLimiters.api(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    try {
        const session = await requireAuth();

        // Validate request body
        const validation = await validateBody(request, UpdateProfileSchema);
        if (!validation.success) {
            return validation.response;
        }

        const updates = validation.data;

        // Filter out sensitive fields just in case (though schema should catch this)
        const allowedUpdates = {
            name: updates.name,
            phone: updates.phone,
            campus: updates.campus,
            bio: updates.bio,
            avatar: updates.avatar
        };

        const user = await prisma.user.update({
            where: { id: session.user.id },
            data: allowedUpdates,
        });

        if (!user) {
            return ApiResponse.error('User not found', 404);
        }

        return ApiResponse.success({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                campus: user.campus,
                bio: user.bio,
                avatar: user.avatar,
            },
        }, 200, 'Profile updated successfully');
    } catch (error: any) {
        log.error('Update profile error', error, { endpoint: '/api/user/profile' });
        return ApiResponse.internalError('An error occurred while updating profile');
    }
}

