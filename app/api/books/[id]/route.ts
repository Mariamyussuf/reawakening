import { NextRequest, NextResponse } from 'next/server';
import { rateLimiters } from '@/lib/middleware/ratelimit';
import { ApiResponse } from '@/lib/api/response';
import { log } from '@/lib/logger';
import prisma from '@/lib/prisma';

// GET /api/books/:id - Get single book
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
        const book = await prisma.book.findUnique({
            where: { id: params.id }
        });

        if (!book) {
            return ApiResponse.error('Book not found', 404);
        }

        // Format response
        const formattedBook = {
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
        };

        return ApiResponse.success({ book: formattedBook });
    } catch (error: any) {
        log.error('Get book error', error, { endpoint: '/api/books/[id]', bookId: params.id });
        return ApiResponse.internalError('An error occurred while fetching book');
    }
}
