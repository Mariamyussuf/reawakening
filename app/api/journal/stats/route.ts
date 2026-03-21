import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth';
import { rateLimiters } from '@/lib/middleware/ratelimit';
import { ApiResponse } from '@/lib/api/response';
import { log } from '@/lib/logger';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/journal/stats - Get journal statistics
export async function GET(request: NextRequest) {
    // Apply rate limiting
    const rateLimitResponse = await rateLimiters.api(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    try {
        const session = await requireAuth();
        const userId = session.user.id;

        // Get total entries
        const totalEntries = await prisma.journalEntry.count({
            where: { userId }
        });

        // Get entries this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const thisMonth = await prisma.journalEntry.count({
            where: {
                userId,
                createdAt: { gte: startOfMonth }
            }
        });

        // Get answered prayers (entries with category 'ANSWERED')
        const answered = await prisma.journalEntry.count({
            where: {
                userId,
                category: 'ANSWERED'
            }
        });

        // Calculate current streak
        const streak = await calculateStreak(userId);

        // Get entries by category
        const categoryGroups = await prisma.journalEntry.groupBy({
            by: ['category'],
            where: { userId },
            _count: { category: true },
            orderBy: {
                _count: { category: 'desc' }
            }
        });

        return ApiResponse.success({
            totalEntries,
            thisMonth,
            answered,
            streak,
            categoryStats: categoryGroups.map((group) => ({
                category: group.category,
                count: group._count.category,
            })),
        });
    } catch (error: any) {
        log.error('Get journal stats error', error, { endpoint: '/api/journal/stats' });
        return ApiResponse.internalError('An error occurred while fetching journal statistics');
    }
}

// Helper function to calculate streak
async function calculateStreak(userId: string): Promise<number> {
    const entries = await prisma.journalEntry.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        select: { createdAt: true }
    });

    if (entries.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    // Filter distinctive days first to avoid multiple entries per day counting issues
    const uniqueDays = new Set<string>();
    entries.forEach(entry => {
        const d = new Date(entry.createdAt);
        d.setHours(0, 0, 0, 0);
        uniqueDays.add(d.toISOString());
    });

    // Sort days descending
    const sortedDays = Array.from(uniqueDays)
        .map(d => new Date(d))
        .sort((a, b) => b.getTime() - a.getTime());

    for (const entryDate of sortedDays) {
        // Reset time for comparison
        entryDate.setHours(0, 0, 0, 0);

        const diffDays = Math.floor(
            (currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays === 0) {
            // Entry is today, streak starts/continues
            if (streak === 0) streak = 1;
        } else if (diffDays === 1) {
            // Entry was yesterday vs current checked date
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else if (diffDays > 1) {
            // Gap found
            if (streak === 0 && diffDays > 0) {
                // No entry today, check if entry was yesterday
                // If diff is 1 (yesterday), we would have hit the block above.
                // If diff > 1, streak is broken immediately if we haven't started.
                // But wait, the logic needs to effectively "rewind" current date
                // The simple loop above in original code was:
                // if diff is streak, increment streak, rewind current date
                // This assumes we start with streak 0 and current date today.
                // If entry is today (diff 0): 0 == 0 -> streak=1, curr=yesterday
                // If entry is yesterday (diff 1): 1 == 1 -> streak=2, curr=dayBefore
            }
            break;
        }
    }

    // Let's reimplement strictly following the logic:
    // We want consecutive days starting from today or yesterday.

    streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Check if we have an entry today
    const hasToday = sortedDays.some(d => d.getTime() === today.getTime());

    let checkDate = new Date(today);
    if (!hasToday) {
        // If no entry today, start checking from yesterday
        checkDate.setDate(checkDate.getDate() - 1);
    }

    for (const day of sortedDays) {
        if (day.getTime() === checkDate.getTime()) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else if (day.getTime() > checkDate.getTime()) {
            // Should not happen if sorted descending and we handled today
            continue;
        } else {
            // Gap found
            break;
        }
    }

    return streak;
}
