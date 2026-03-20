import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth';
import { rateLimiters } from '@/lib/middleware/ratelimit';
import { validateBody } from '@/lib/validation';
import { UpdatePreferencesSchema } from '@/lib/validation/schemas';
import { ApiResponse } from '@/lib/api/response';
import { log } from '@/lib/logger';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// PUT /api/user/preferences - Update notification and privacy preferences
export async function PUT(request: NextRequest) {
    // Apply rate limiting
    const rateLimitResponse = await rateLimiters.api(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    try {
        const session = await requireAuth();

        // Validate request body
        const validation = await validateBody(request, UpdatePreferencesSchema);
        if (!validation.success) {
            return validation.response;
        }

        const updates = validation.data;

        await dbConnect();

        const user = await User.findByIdAndUpdate(
            session.user.id,
            { $set: filteredUpdates },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return ApiResponse.error('User not found', 404);
        }

        return ApiResponse.success({
            preferences: {
                notifications: user.notifications,
                privacy: user.privacy,
            },
        }, 'Preferences updated successfully');
    } catch (error: any) {
        log.error('Update preferences error', error, { endpoint: '/api/user/preferences' });
        return ApiResponse.internalError('An error occurred while updating preferences');
    }
}
