import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth';
import { rateLimiters } from '@/lib/middleware/ratelimit';
import { ApiResponse } from '@/lib/api/response';
import { log } from '@/lib/logger';
import prisma from '@/lib/prisma';

function serializeUser(user: {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    campus: string | null;
    bio: string | null;
    avatar: string | null;
    role: string;
    dailyVerse: boolean;
    eventReminders: boolean;
    prayerRequests: boolean;
    weeklyDigest: boolean;
    showProfile: boolean;
    showActivity: boolean;
    allowMessages: boolean;
    joinDate: Date;
    streak: number;
    totalVerses: number;
    completedCourses: number;
    lastActive: Date;
    createdAt: Date;
    updatedAt: Date;
}) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        campus: user.campus,
        bio: user.bio,
        avatar: user.avatar,
        role: user.role,
        joinDate: user.joinDate,
        streak: user.streak,
        totalVerses: user.totalVerses,
        completedCourses: user.completedCourses,
        lastActive: user.lastActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
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
    };
}

export async function GET(request: NextRequest) {
    // Apply rate limiting
    const rateLimitResponse = await rateLimiters.api(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    try {
        const session = await requireAuth();

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        });

        if (!user) {
            return ApiResponse.error('User not found', 404);
        }

        return ApiResponse.success({ user: serializeUser(user) });
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
        const allowedUpdates = {
            name: updates.name,
            phone: updates.phone,
            campus: updates.campus,
            bio: updates.bio,
            avatar: updates.avatar,
        };

        const user = await prisma.user.update({
            where: { id: session.user.id },
            data: allowedUpdates,
        });

        if (!user) {
            return ApiResponse.error('User not found', 404);
        }

        return ApiResponse.success({ user: serializeUser(user) });
    } catch (error: any) {
        log.error('Update user error', error, { endpoint: '/api/user' });
        return ApiResponse.internalError('An error occurred while updating user data');
    }
}
