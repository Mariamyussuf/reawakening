import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth';
import { rateLimiters } from '@/lib/middleware/ratelimit';
import { ApiResponse } from '@/lib/api/response';
import { log } from '@/lib/logger';
import prisma from '@/lib/prisma';

// GET /api/prayers/community - Get community prayers (excluding user's own)
export async function GET(request: NextRequest) {
    // Apply rate limiting
    const rateLimitResponse = await rateLimiters.api(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    try {
        const session = await requireAuth();

        const userId = session.user.id;

        // Get community prayers (not anonymous, not user's own, optionally filter by answered)
        const prayers = await prisma.prayer.findMany({
            where: {
                userId: { not: userId },
                isAnonymous: false,
            },
            orderBy: { createdAt: 'desc' },
            take: 50,
            include: {
                user: {
                    select: {
                        name: true,
                        email: true
                    }
                }
            }
        });

        // Format response
        const formattedPrayers = prayers.map((prayer) => {
            let prayedBy: string[] = [];
            try {
                prayedBy = prayer.prayedBy ? JSON.parse(prayer.prayedBy) : [];
            } catch (e) {
                prayedBy = [];
            }

            return {
                id: prayer.id,
                author: prayer.user?.name || 'Anonymous',
                avatar: prayer.user?.name?.charAt(0).toUpperCase() || 'A',
                title: prayer.title,
                description: prayer.description,
                category: prayer.category,
                prayerCount: prayer.prayerCount,
                date: formatDate(prayer.createdAt),
                createdAt: prayer.createdAt,
                hasPrayed: prayedBy.includes(session.user.id),
            };
        });

        return ApiResponse.success({ prayers: formattedPrayers });
    } catch (error: any) {
        log.error('Get community prayers error', error, { endpoint: '/api/prayers/community' });
        return ApiResponse.internalError('An error occurred while fetching community prayers');
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
