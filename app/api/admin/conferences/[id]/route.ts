import { NextRequest } from 'next/server';

import { ApiResponse } from '@/lib/api/response';
import {
    isMissingConferenceSchemaError,
    normalizeConferenceStatus,
    serializeConference,
} from '@/lib/conferences';
import { log } from '@/lib/logger';
import {
    ForbiddenError,
    UnauthorizedError,
    requireAdminOrLeader,
} from '@/lib/middleware/auth';
import { rateLimiters } from '@/lib/middleware/ratelimit';
import prisma from '@/lib/prisma';
import { sanitizeText } from '@/lib/sanitize';

export const dynamic = 'force-dynamic';

function buildConferenceUpdates(body: any) {
    const theme = sanitizeText(body?.theme || '').trim();
    const summary = sanitizeText(body?.summary || '').trim();
    const venue = sanitizeText(body?.venue || '').trim();
    const timeLabel = sanitizeText(body?.timeLabel || '').trim();
    const costLabel = sanitizeText(body?.costLabel || '').trim() || 'Free (Registration Required)';
    const registrationUrl = sanitizeText(body?.registrationUrl || '').trim();
    const details = sanitizeText(body?.details || '').trim();
    const startDate = body?.startDate ? new Date(body.startDate) : null;
    const endDate = body?.endDate ? new Date(body.endDate) : null;
    const status = normalizeConferenceStatus(body?.status);

    if (!theme || !summary || !venue || !timeLabel || !startDate) {
        throw new Error('Theme, summary, venue, time, and start date are required.');
    }

    if (Number.isNaN(startDate.getTime())) {
        throw new Error('Start date must be valid.');
    }

    if (endDate && Number.isNaN(endDate.getTime())) {
        throw new Error('End date must be valid.');
    }

    if (endDate && endDate < startDate) {
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
        startDate,
        endDate,
        isOnline: Boolean(body?.isOnline),
        registrationOpen: Boolean(body?.registrationOpen),
        featured: Boolean(body?.featured),
        status,
    };
}

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const rateLimitResponse = await rateLimiters.admin(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    try {
        await requireAdminOrLeader();

        const conference = await prisma.conference.findUnique({
            where: { id: params.id },
        });

        if (!conference) {
            return ApiResponse.notFound('Conference not found');
        }

        return ApiResponse.success({ conference: serializeConference(conference) });
    } catch (error: any) {
        if (error instanceof UnauthorizedError) {
            return ApiResponse.unauthorized(error.message);
        }

        if (error instanceof ForbiddenError) {
            return ApiResponse.forbidden(error.message);
        }

        if (isMissingConferenceSchemaError(error)) {
            return ApiResponse.error(
                'Conferences are not available yet because the database schema has not been updated in this environment.',
                503
            );
        }

        log.error('Get admin conference error', error, {
            endpoint: '/api/admin/conferences/[id]',
            conferenceId: params.id,
        });
        return ApiResponse.internalError(error.message || 'An error occurred while loading the conference');
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const rateLimitResponse = await rateLimiters.admin(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    try {
        await requireAdminOrLeader();

        const body = await request.json();
        const data = buildConferenceUpdates(body);

        if (data.featured) {
            await prisma.conference.updateMany({
                where: {
                    featured: true,
                    id: { not: params.id },
                },
                data: { featured: false },
            });
        }

        const conference = await prisma.conference.update({
            where: { id: params.id },
            data,
        });

        return ApiResponse.success(
            { conference: serializeConference(conference) },
            200,
            'Conference updated successfully'
        );
    } catch (error: any) {
        if (error instanceof UnauthorizedError) {
            return ApiResponse.unauthorized(error.message);
        }

        if (error instanceof ForbiddenError) {
            return ApiResponse.forbidden(error.message);
        }

        if (isMissingConferenceSchemaError(error)) {
            return ApiResponse.error(
                'Conferences are not available yet because the database schema has not been updated in this environment.',
                503
            );
        }

        log.error('Update conference error', error, {
            endpoint: '/api/admin/conferences/[id]',
            conferenceId: params.id,
        });
        return ApiResponse.internalError(error.message || 'An error occurred while updating the conference');
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const rateLimitResponse = await rateLimiters.admin(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    try {
        await requireAdminOrLeader();

        await prisma.conference.delete({
            where: { id: params.id },
        });

        return ApiResponse.success(null, 200, 'Conference deleted successfully');
    } catch (error: any) {
        if (error instanceof UnauthorizedError) {
            return ApiResponse.unauthorized(error.message);
        }

        if (error instanceof ForbiddenError) {
            return ApiResponse.forbidden(error.message);
        }

        if (isMissingConferenceSchemaError(error)) {
            return ApiResponse.error(
                'Conferences are not available yet because the database schema has not been updated in this environment.',
                503
            );
        }

        log.error('Delete conference error', error, {
            endpoint: '/api/admin/conferences/[id]',
            conferenceId: params.id,
        });
        return ApiResponse.internalError(error.message || 'An error occurred while deleting the conference');
    }
}
