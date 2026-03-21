import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth';
import { rateLimiters } from '@/lib/middleware/ratelimit';
import { validateBody } from '@/lib/validation';
import { UpdatePreferencesSchema } from '@/lib/validation/schemas';
import { ApiResponse } from '@/lib/api/response';
import { log } from '@/lib/logger';
import prisma from '@/lib/prisma';

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
        const prismaUpdates = {
            dailyVerse: updates.notifications?.dailyVerse,
            eventReminders: updates.notifications?.eventReminders,
            prayerRequests: updates.notifications?.prayerRequests,
            weeklyDigest: updates.notifications?.weeklyDigest,
            showProfile: updates.privacy?.showProfile,
            showActivity: updates.privacy?.showActivity,
            allowMessages: updates.privacy?.allowMessages,
        };

        const user = await prisma.user.update({
            where: { id: session.user.id },
            data: prismaUpdates,
        });

        if (!user) {
            return ApiResponse.error('User not found', 404);
        }

        return ApiResponse.success({
            preferences: {
                notifications: {
                    dailyVerse: user.dailyVerse,
                    eventReminders: user.eventReminders,
                    prayerRequests: user.prayerRequests,
                    weeklyDigest: user.weeklyDigest,
                },
                privacy: {
                    showProfile: user.showProfile,
                    showActivity: user.showActivity,
                    allowMessages: user.allowMessages,
                },
            },
        }, 200, 'Preferences updated successfully');
    } catch (error: any) {
        log.error('Update preferences error', error, { endpoint: '/api/user/preferences' });
        return ApiResponse.internalError('An error occurred while updating preferences');
    }
}
