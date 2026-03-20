import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth';
import { rateLimiters } from '@/lib/middleware/ratelimit';
import { validateBody } from '@/lib/validation';
import { UpdatePrayerSchema } from '@/lib/validation/schemas';
import { ApiResponse } from '@/lib/api/response';
import { log } from '@/lib/logger';
import prisma from '@/lib/prisma';

// PUT /api/prayers/:id - Update prayer
export async function PUT(
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

        // Validate request body
        const validation = await validateBody(request, UpdatePrayerSchema);
        if (!validation.success) {
            return validation.response;
        }

        const { title, description, category } = validation.data;

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

        const prayer = await prisma.prayer.update({
            where: { id: params.id },
            data: {
                title: title ? title.trim() : undefined,
                description: description ? description.trim() : undefined,
                category: category || undefined,
            }
        });

        const formattedPrayer = {
            id: prayer.id,
            title: prayer.title,
            description: prayer.description,
            category: prayer.category,
            isAnonymous: prayer.isAnonymous,
            isAnswered: prayer.isAnswered,
            prayerCount: prayer.prayerCount,
            date: formatDate(prayer.createdAt),
            createdAt: prayer.createdAt,
        };

        return ApiResponse.success(formattedPrayer, 200, 'Prayer updated successfully');
    } catch (error: any) {
        log.error('Update prayer error', error, { endpoint: '/api/prayers/[id]', prayerId: params.id });
        return ApiResponse.internalError('An error occurred while updating prayer');
    }
}

// DELETE /api/prayers/:id - Delete prayer
export async function DELETE(
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

        const prayer = await prisma.prayer.findUnique({
            where: { id: params.id }
        });

        if (!prayer) {
            return ApiResponse.error('Prayer not found', 404);
        }

        // Check if user owns this prayer
        if (prayer.userId !== session.user.id) {
            return ApiResponse.forbidden('Unauthorized to delete this prayer');
        }

        await prisma.prayer.delete({
            where: { id: params.id }
        });

        return ApiResponse.success(null, 200, 'Prayer deleted successfully');
    } catch (error: any) {
        log.error('Delete prayer error', error, { endpoint: '/api/prayers/[id]', prayerId: params.id });
        return ApiResponse.internalError('An error occurred while deleting prayer');
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
