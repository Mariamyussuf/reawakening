import { NextRequest } from 'next/server';

import { ApiResponse } from '@/lib/api/response';
import { log } from '@/lib/logger';
import { requireAdminOrLeader } from '@/lib/middleware/auth';
import { rateLimiters } from '@/lib/middleware/ratelimit';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const rateLimitResponse = await rateLimiters.admin(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    try {
        const session = await requireAdminOrLeader();

        const [
            totalUsers,
            totalAdmins,
            totalLeaders,
            totalMembers,
            totalBooks,
            featuredBooks,
            totalDevotionals,
            publishedDevotionals,
            draftDevotionals,
            scheduledDevotionals,
            totalPrayers,
            answeredPrayers,
            activePrayers,
        ] = await Promise.all([
            prisma.user.count(),
            prisma.user.count({ where: { role: 'ADMIN' } }),
            prisma.user.count({ where: { role: 'LEADER' } }),
            prisma.user.count({ where: { role: 'MEMBER' } }),
            prisma.book.count(),
            prisma.book.count({ where: { featured: true } }),
            prisma.devotional.count(),
            prisma.devotional.count({ where: { status: 'PUBLISHED' } }),
            prisma.devotional.count({ where: { status: 'DRAFT' } }),
            prisma.devotional.count({ where: { status: 'SCHEDULED' } }),
            prisma.prayer.count(),
            prisma.prayer.count({ where: { isAnswered: true } }),
            prisma.prayer.count({ where: { isAnswered: false } }),
        ]);

        return ApiResponse.success({
            viewer: {
                name: session.user.name,
                email: session.user.email,
                role: session.user.role,
            },
            overview: {
                totalUsers,
                totalAdmins,
                totalLeaders,
                totalMembers,
                totalBooks,
                featuredBooks,
                totalDevotionals,
                publishedDevotionals,
                draftDevotionals,
                scheduledDevotionals,
                totalPrayers,
                answeredPrayers,
                activePrayers,
            },
            generatedAt: new Date().toISOString(),
        });
    } catch (error: any) {
        log.error('Get admin dashboard error', error, { endpoint: '/api/admin/dashboard' });
        return ApiResponse.internalError('An error occurred while loading the admin dashboard');
    }
}
