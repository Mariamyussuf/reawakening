import { NextRequest, NextResponse } from 'next/server';
import { rateLimiters } from '@/lib/middleware/ratelimit';
import { ApiResponse } from '@/lib/api/response';
import { log } from '@/lib/logger';
import prisma from '@/lib/prisma';

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

        const devotionals = await prisma.devotional.findMany({
            where,
            orderBy: { publishDate: 'desc' },
            take: limit,
            skip: skip,
        });

        const total = await prisma.devotional.count({ where });

        // Format response
        const formattedDevotionals = devotionals.map((devotional) => ({
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
        }));

        return ApiResponse.success({
            devotionals: formattedDevotionals,
            total,
            limit,
            skip,
        });
    } catch (error: any) {
        log.error('Get devotionals error', error, { endpoint: '/api/devotionals' });
        return ApiResponse.internalError('An error occurred while fetching devotionals');
    }
}
