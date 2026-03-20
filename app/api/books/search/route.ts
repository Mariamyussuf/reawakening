import { NextRequest, NextResponse } from 'next/server';
import { rateLimiters } from '@/lib/middleware/ratelimit';
import { ApiResponse } from '@/lib/api/response';
import { log } from '@/lib/logger';
import prisma from '@/lib/prisma';

// GET /api/books/search - Search books
export async function GET(request: NextRequest) {
    // Apply rate limiting (stricter for search)
    const rateLimitResponse = await rateLimiters.search(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');
        const limit = parseInt(searchParams.get('limit') || '20');

        if (!query || query.trim().length === 0) {
            return ApiResponse.error('Please provide a search query', 400);
        }

        const searchTerm = query.trim();

        const books = await prisma.book.findMany({
            where: {
                OR: [
                    { title: { contains: searchTerm } },
                    { author: { contains: searchTerm } },
                    { description: { contains: searchTerm } },
                    { tags: { contains: searchTerm } },
                ]
            },
            take: limit
        });

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
            total: formattedBooks.length,
        });
    } catch (error: any) {
        log.error('Search books error', error, { endpoint: '/api/books/search' });
        return ApiResponse.internalError('An error occurred while searching books');
    }
}
