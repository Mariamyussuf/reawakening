import { NextRequest, NextResponse } from 'next/server';
import { rateLimiters } from '@/lib/middleware/ratelimit';
import { validateQuery } from '@/lib/validation';
import { SearchSchema } from '@/lib/validation/schemas';
import { ApiResponse } from '@/lib/api/response';
import { log } from '@/lib/logger';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { parseStoredStringArray } from '@/lib/parse-string-array';

export const dynamic = 'force-dynamic';

// GET /api/search - Enhanced full-text search across all content types
export async function GET(request: NextRequest) {
    // Apply rate limiting (stricter for search)
    const rateLimitResponse = await rateLimiters.search(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    try {
        // Validate query parameters
        const validation = validateQuery(request, SearchSchema);
        if (!validation.success) {
            return validation.response;
        }

        const { q: query, type = 'all', limit = 20, skip = 0 } = validation.data;
        const searchTerm = query.trim();

        const results: any = {
            books: [],
            devotionals: [],
            prayers: [],
            total: 0,
        };

        // Search Books
        if (type === 'all' || type === 'books' || !type) {
            const books = await prisma.book.findMany({
                where: {
                    OR: [
                        { title: { contains: searchTerm } },
                        { author: { contains: searchTerm } },
                        { description: { contains: searchTerm } },
                        { tags: { contains: searchTerm } }, // Simple contains for JSON string
                    ]
                },
                take: limit,
                skip: skip,
            });

            results.books = books.map((book) => ({
                id: book.id,
                type: 'book',
                title: book.title,
                author: book.author,
                description: book.description,
                coverImage: book.coverImage,
                categories: book.categories ? JSON.parse(book.categories) : [],
                tags: parseStoredStringArray(book.tags),
                publishYear: book.publishYear,
                createdAt: book.createdAt,
            }));
        }

        // Search Devotionals
        if (type === 'all' || type === 'devotionals' || !type) {
            const devotionals = await prisma.devotional.findMany({
                where: {
                    status: 'PUBLISHED',
                    OR: [
                        { title: { contains: searchTerm } },
                        { excerpt: { contains: searchTerm } },
                        { author: { contains: searchTerm } },
                        { tags: { contains: searchTerm } },
                        { scripture: { contains: searchTerm } },
                    ]
                },
                take: limit,
                skip: skip,
            });

            results.devotionals = devotionals.map((devotional) => ({
                id: devotional.id,
                type: 'devotional',
                title: devotional.title,
                excerpt: devotional.excerpt,
                author: devotional.author,
                coverImage: devotional.coverImage,
                tags: parseStoredStringArray(devotional.tags),
                scripture: devotional.scripture,
                publishDate: devotional.publishDate,
                createdAt: devotional.createdAt,
            }));
        }

        // Search Prayers (only if user is authenticated)
        if (type === 'all' || type === 'prayers' || !type) {
            const session = await getServerSession(authOptions);

            if (session && session.user) {
                const prayers = await prisma.prayer.findMany({
                    where: {
                        userId: session.user.id,
                        OR: [
                            { title: { contains: searchTerm } },
                            { description: { contains: searchTerm } },
                            { category: { contains: searchTerm } },
                        ]
                    },
                    take: limit,
                    skip: skip,
                    orderBy: { createdAt: 'desc' }
                });

                results.prayers = prayers.map((prayer) => ({
                    id: prayer.id,
                    type: 'prayer',
                    title: prayer.title,
                    description: prayer.description,
                    category: prayer.category,
                    isAnswered: prayer.isAnswered,
                    prayerCount: prayer.prayerCount,
                    createdAt: prayer.createdAt,
                }));
            }
        }

        // Calculate total results
        results.total = results.books.length + results.devotionals.length + results.prayers.length;

        return ApiResponse.success({
            query: searchTerm,
            results,
            total: results.total,
            limit,
            skip,
        });
    } catch (error: any) {
        log.error('Search error', error, { endpoint: '/api/search' });
        return ApiResponse.internalError('An error occurred while searching');
    }
}
