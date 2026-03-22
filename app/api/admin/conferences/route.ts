import { NextRequest } from 'next/server';

import { ApiResponse } from '@/lib/api/response';
import { CONFERENCE_STATUSES, normalizeConferenceStatus, serializeConference } from '@/lib/conferences';
import { log } from '@/lib/logger';
import { requireAdminOrLeader } from '@/lib/middleware/auth';
import { rateLimiters } from '@/lib/middleware/ratelimit';
import prisma from '@/lib/prisma';
import { sanitizeText } from '@/lib/sanitize';

export const dynamic = 'force-dynamic';

function buildConferencePayload(body: any) {
    const theme = sanitizeText(body?.theme || '').trim();
    const summary = sanitizeText(body?.summary || '').trim();
    const venue = sanitizeText(body?.venue || '').trim();
    const timeLabel = sanitizeText(body?.timeLabel || '').trim();
    const costLabel = sanitizeText(body?.costLabel || '').trim() || 'Free (Registration Required)';
    const registrationUrl = sanitizeText(body?.registrationUrl || '').trim();
    const details = sanitizeText(body?.details || '').trim();
    const startDateValue = body?.startDate ? new Date(body.startDate) : null;
    const endDateValue = body?.endDate ? new Date(body.endDate) : null;
    const status = normalizeConferenceStatus(body?.status);

    if (!theme || !summary || !venue || !timeLabel || !startDateValue) {
        throw new Error('Theme, summary, venue, time, and start date are required.');
    }

    if (Number.isNaN(startDateValue.getTime())) {
        throw new Error('Start date must be valid.');
    }

    if (endDateValue && Number.isNaN(endDateValue.getTime())) {
        throw new Error('End date must be valid.');
    }

    if (endDateValue && endDateValue < startDateValue) {
        throw new Error('End date cannot be before the start date.');
    }

    if (registrationUrl && !/^https?:\/\//i.test(registrationUrl)) {
        throw new Error('Registration URL must start with http:// or https://.');
    }

    return {
        theme,
        summary,
        venue,
        timeLabel,
        costLabel,
        registrationUrl: registrationUrl || null,
        details: details || null,
        startDate: startDateValue,
        endDate: endDateValue,
        isOnline: Boolean(body?.isOnline),
        registrationOpen: Boolean(body?.registrationOpen),
        featured: Boolean(body?.featured),
        status,
    };
}

export async function GET(request: NextRequest) {
    const rateLimitResponse = await rateLimiters.admin(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    try {
        await requireAdminOrLeader();

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const where =
            status && CONFERENCE_STATUSES.includes(status.toUpperCase() as any)
                ? { status: status.toUpperCase() }
                : undefined;

        const conferences = await prisma.conference.findMany({
            where,
            orderBy: [
                { featured: 'desc' },
                { startDate: 'desc' },
                { createdAt: 'desc' },
            ],
        });

        const [totalConferences, publishedConferences, openRegistrations] = await Promise.all([
            prisma.conference.count(),
            prisma.conference.count({ where: { status: 'PUBLISHED' } }),
            prisma.conference.count({ where: { status: 'PUBLISHED', registrationOpen: true } }),
        ]);

        return ApiResponse.success({
            conferences: conferences.map(serializeConference),
            overview: {
                totalConferences,
                publishedConferences,
                openRegistrations,
            },
        });
    } catch (error: any) {
        log.error('Get admin conferences error', error, { endpoint: '/api/admin/conferences' });
        return ApiResponse.internalError(error.message || 'An error occurred while loading conferences');
    }
}

export async function POST(request: NextRequest) {
    const rateLimitResponse = await rateLimiters.admin(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    try {
        await requireAdminOrLeader();

        const body = await request.json();
        const data = buildConferencePayload(body);

        if (data.featured) {
            await prisma.conference.updateMany({
                where: { featured: true },
                data: { featured: false },
            });
        }

        const conference = await prisma.conference.create({
            data,
        });

        return ApiResponse.created(
            { conference: serializeConference(conference) },
            'Conference created successfully'
        );
    } catch (error: any) {
        log.error('Create conference error', error, { endpoint: '/api/admin/conferences' });
        return ApiResponse.internalError(error.message || 'An error occurred while creating the conference');
    }
}
