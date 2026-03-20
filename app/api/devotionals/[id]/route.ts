import { NextRequest, NextResponse } from 'next/server';
import { rateLimiters } from '@/lib/middleware/ratelimit';
import { ApiResponse } from '@/lib/api/response';
import { log } from '@/lib/logger';
import prisma from '@/lib/prisma';

// GET /api/devotionals/:id - Get single devotional
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    // Apply rate limiting
    const rateLimitResponse = await rateLimiters.api(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    try {
        const devotional = await prisma.devotional.findUnique({
            where: { id: params.id }
        });

        if (!devotional) {
            return ApiResponse.error('Devotional not found', 404);
        }

        // Only return published devotionals to non-admins
        // For admin access, check in admin routes
        if (devotional.status !== 'PUBLISHED') {
            return ApiResponse.error('Devotional not found', 404);
        }

        const formattedDevotional = {
            id: devotional.id,
            title: devotional.title,
            content: devotional.content,
            excerpt: devotional.excerpt,
            author: devotional.author,
            coverImage: devotional.coverImage,
            publishDate: devotional.publishDate,
            tags: devotional.tags ? JSON.parse(devotional.tags) : [],
            scripture: devotional.scripture,
            createdAt: devotional.createdAt,
        };

        return ApiResponse.success({ devotional: formattedDevotional });
    } catch (error: any) {
        log.error('Get devotional error', error, { endpoint: '/api/devotionals/[id]', devotionalId: params.id });
        return ApiResponse.internalError('An error occurred while fetching devotional');
    }
}
