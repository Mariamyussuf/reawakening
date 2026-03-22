import { NextRequest } from 'next/server';

import { ApiResponse } from '@/lib/api/response';
import { isMissingDevotionalsTableError } from '@/lib/devotionals';
import { log } from '@/lib/logger';
import { requireAdminOrLeader } from '@/lib/middleware/auth';
import { rateLimiters } from '@/lib/middleware/ratelimit';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getConferenceOverview() {
    try {
        const [totalConferences, publishedConferences, openConferenceRegistrations] = await Promise.all([
            prisma.conference.count(),
            prisma.conference.count({ where: { status: 'PUBLISHED' } }),
            prisma.conference.count({ where: { status: 'PUBLISHED', registrationOpen: true } }),
        ]);

        return {
            totalConferences,
            publishedConferences,
            openConferenceRegistrations,
        };
    } catch {
        return {
            totalConferences: 0,
            publishedConferences: 0,
            openConferenceRegistrations: 0,
        };
    }
}

async function getDevotionalOverview() {
    try {
        const [totalDevotionals, publishedDevotionals, draftDevotionals, scheduledDevotionals] = await Promise.all([
            prisma.devotional.count(),
            prisma.devotional.count({ where: { status: 'PUBLISHED' } }),
            prisma.devotional.count({ where: { status: 'DRAFT' } }),
            prisma.devotional.count({ where: { status: 'SCHEDULED' } }),
        ]);

        return {
            totalDevotionals,
            publishedDevotionals,
            draftDevotionals,
            scheduledDevotionals,
        };
    } catch (error) {
        if (!isMissingDevotionalsTableError(error)) {
            throw error;
        }

        return {
            totalDevotionals: 0,
            publishedDevotionals: 0,
            draftDevotionals: 0,
            scheduledDevotionals: 0,
        };
    }
}

export async function GET(request: NextRequest) {
    const rateLimitResponse = await rateLimiters.admin(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    try {
        const session = await requireAdminOrLeader();

        const conferenceOverview = await getConferenceOverview();
        const devotionalOverview = await getDevotionalOverview();

        const [
            totalUsers,
            totalAdmins,
            totalLeaders,
            totalMembers,
            totalBooks,
            featuredBooks,
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
                totalConferences: conferenceOverview.totalConferences,
                publishedConferences: conferenceOverview.publishedConferences,
                openConferenceRegistrations: conferenceOverview.openConferenceRegistrations,
                totalDevotionals: devotionalOverview.totalDevotionals,
                publishedDevotionals: devotionalOverview.publishedDevotionals,
                draftDevotionals: devotionalOverview.draftDevotionals,
                scheduledDevotionals: devotionalOverview.scheduledDevotionals,
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
