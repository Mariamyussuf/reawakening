import { NextRequest, NextResponse } from 'next/server';
import { rateLimiters } from '@/lib/middleware/ratelimit';
import { ApiResponse } from '@/lib/api/response';
import { isMissingDevotionalsTableError, serializeDevotional } from '@/lib/devotionals';
import { log } from '@/lib/logger';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/devotionals - Get published devotionals
export async function GET(request: NextRequest) {
    // Apply rate limiting
    const rateLimitResponse = await rateLimiters.api(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '20');
        const skip = parseInt(searchParams.get('skip') || '0');
        const tag = searchParams.get('tag');
        const search = searchParams.get('search');

        const where: any = { status: 'PUBLISHED' };

        if (tag) {
            where.tags = { contains: tag };
        }

        if (search) {
            where.OR = [
                { title: { contains: search } },
                { content: { contains: search } },
                { excerpt: { contains: search } },
                { author: { contains: search } },
            ];
        }

        let devotionals;
        let total;

        try {
            [devotionals, total] = await Promise.all([
                prisma.devotional.findMany({
                    where,
                    orderBy: { publishDate: 'desc' },
                    take: limit,
                    skip: skip,
                }),
                prisma.devotional.count({ where }),
            ]);
        } catch (error) {
            if (isMissingDevotionalsTableError(error)) {
                return ApiResponse.success({
                    devotionals: [],
                    total: 0,
                    limit,
                    skip,
                    needsDatabaseSetup: true,
                });
            }

            throw error;
        }

        return ApiResponse.success({
            devotionals: devotionals.map(serializeDevotional),
            total,
            limit,
            skip,
        });
    } catch (error: any) {
        log.error('Get devotionals error', error, { endpoint: '/api/devotionals' });
        return ApiResponse.internalError('An error occurred while fetching devotionals');
    }
}
