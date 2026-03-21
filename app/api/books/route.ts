import { NextRequest, NextResponse } from 'next/server';
import { rateLimiters } from '@/lib/middleware/ratelimit';
import { ApiResponse } from '@/lib/api/response';
import { log } from '@/lib/logger';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/books - Get all books with optional filters
export async function GET(request: NextRequest) {
    // Apply rate limiting
    const rateLimitResponse = await rateLimiters.api(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const featured = searchParams.get('featured') === 'true';
        const popular = searchParams.get('popular') === 'true';
        const newRelease = searchParams.get('newRelease') === 'true';
        const search = searchParams.get('search');
        const limit = parseInt(searchParams.get('limit') || '50');
        const skip = parseInt(searchParams.get('skip') || '0');
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') || 'desc';

        const where: any = {};

        if (category) {
            where.categories = { contains: category };
        }

        if (featured) {
            where.featured = true;
        }

        if (popular) {
            where.popular = true;
        }

        if (newRelease) {
            where.newRelease = true;
        }

        if (search) {
            where.OR = [
                { title: { contains: search } },
                { author: { contains: search } },
                { description: { contains: search } },
                { tags: { contains: search } },
                { categories: { contains: search } },
            ];
        }

        const orderBy: any = {};
        if (sortBy === 'views') {
            orderBy.totalViews = sortOrder === 'asc' ? 'asc' : 'desc';
        } else if (sortBy === 'downloads') {
            orderBy.totalDownloads = sortOrder === 'asc' ? 'asc' : 'desc';
        } else if (sortBy === 'rating') {
            orderBy.averageRating = sortOrder === 'asc' ? 'asc' : 'desc';
        } else {
            orderBy[sortBy] = sortOrder === 'asc' ? 'asc' : 'desc';
        }

        const books = await prisma.book.findMany({
            where,
            orderBy,
            take: limit,
            skip: skip,
        });

        const total = await prisma.book.count({ where });

        // Format response
        const formattedBooks = books.map((book) => ({
            id: book.id,
            title: book.title,
            author: book.author,
            description: book.description,
            coverImage: book.coverImage,
            pdfUrl: book.pdfUrl,
            fileSize: book.fileSize,
            pageCount: book.pageCount,
            categories: book.categories ? JSON.parse(book.categories) : [],
            tags: book.tags ? JSON.parse(book.tags) : [],
            publishYear: book.publishYear,
            publisher: book.publisher,
            isbn: book.isbn,
            language: book.language,
            difficulty: book.difficulty,
            featured: book.featured,
            popular: book.popular,
            newRelease: book.newRelease,
            totalDownloads: book.totalDownloads,
            totalViews: book.totalViews,
            averageRating: book.averageRating,
            createdAt: book.createdAt,
            updatedAt: book.updatedAt,
        }));

        return ApiResponse.success({
            books: formattedBooks,
            total,
            limit,
            skip,
        });
    } catch (error: any) {
        log.error('Get books error', error, { endpoint: '/api/books' });
        return ApiResponse.internalError('An error occurred while fetching books');
    }
}
