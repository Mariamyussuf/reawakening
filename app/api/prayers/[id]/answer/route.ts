import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth';
import { rateLimiters } from '@/lib/middleware/ratelimit';
import { ApiResponse } from '@/lib/api/response';
import { log } from '@/lib/logger';
import prisma from '@/lib/prisma';

// PATCH /api/prayers/:id/answer - Mark prayer as answered
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    // Apply rate limiting
    const rateLimitResponse = await rateLimiters.api(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    try {
        const session = await requireAuth();

        const existingPrayer = await prisma.prayer.findUnique({
            where: { id: params.id }
        });

        if (!existingPrayer) {
            return ApiResponse.error('Prayer not found', 404);
        }

        // Check if user owns this prayer
        if (existingPrayer.userId !== session.user.id) {
            return ApiResponse.forbidden('Unauthorized to update this prayer');
        }

        const isAnswered = !existingPrayer.isAnswered;
        const answeredDate = isAnswered ? new Date() : null;

        const prayer = await prisma.prayer.update({
            where: { id: params.id },
            data: {
                isAnswered,
                answeredDate
            }
        });

        const formattedPrayer = {
            id: prayer.id,
            title: prayer.title,
            description: prayer.description,
            category: prayer.category,
            isAnonymous: prayer.isAnonymous,
            isAnswered: prayer.isAnswered,
            answeredDate: prayer.answeredDate,
            prayerCount: prayer.prayerCount,
            date: formatDate(prayer.createdAt),
            createdAt: prayer.createdAt,
        };

        return ApiResponse.success(formattedPrayer, 200, 'Prayer status updated successfully');
    } catch (error: any) {
        log.error('Mark prayer as answered error', error, { endpoint: '/api/prayers/[id]/answer', prayerId: params.id });
        return ApiResponse.internalError('An error occurred while updating prayer status');
    }
}

// Helper function to format date
function formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return days === 1 ? '1 day ago' : `${days} days ago`;
    } else if (hours > 0) {
        return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    } else if (minutes > 0) {
        return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
    } else {
        return 'Just now';
    }
}
