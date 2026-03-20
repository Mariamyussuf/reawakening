import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth';
import { rateLimiters } from '@/lib/middleware/ratelimit';
import { ApiResponse } from '@/lib/api/response';
import { log } from '@/lib/logger';
import prisma from '@/lib/prisma';

// POST /api/prayers/:id/pray - Increment prayer count (user prays for this request)
export async function POST(
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

        const userId = session.user.id;
        const prayer = await prisma.prayer.findUnique({
            where: { id: params.id }
        });

        if (!prayer) {
            return ApiResponse.error('Prayer not found', 404);
        }

        // Check if user already prayed for this
        let prayedBy: string[] = [];
        try {
            prayedBy = prayer.prayedBy ? JSON.parse(prayer.prayedBy) : [];
        } catch (e) {
            prayedBy = [];
        }

        const hasPrayed = prayedBy.includes(userId);
        let updatedPrayerCount = prayer.prayerCount;

        if (hasPrayed) {
            // Remove prayer (unpray)
            prayedBy = prayedBy.filter((id) => id !== userId);
            updatedPrayerCount = Math.max(0, updatedPrayerCount - 1);
        } else {
            // Add prayer
            prayedBy.push(userId);
            updatedPrayerCount += 1;
        }

        const updatedPrayer = await prisma.prayer.update({
            where: { id: params.id },
            data: {
                prayedBy: JSON.stringify(prayedBy),
                prayerCount: updatedPrayerCount
            }
        });

        return ApiResponse.success({
            prayerCount: updatedPrayer.prayerCount,
            hasPrayed: !hasPrayed,
        }, 200, hasPrayed ? 'Prayer removed' : 'Thank you for praying!');
    } catch (error: any) {
        log.error('Pray for request error', error, { endpoint: '/api/prayers/[id]/pray', prayerId: params.id });
        return ApiResponse.internalError('An error occurred while updating prayer count');
    }
}
