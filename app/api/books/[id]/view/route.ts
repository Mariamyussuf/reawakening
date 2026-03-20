import { NextRequest, NextResponse } from 'next/server';
import { rateLimiters } from '@/lib/middleware/ratelimit';
import { ApiResponse } from '@/lib/api/response';
import { log } from '@/lib/logger';
import prisma from '@/lib/prisma';

// POST /api/books/:id/view - Increment view count
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    // Apply rate limiting
    const rateLimitResponse = await rateLimiters.api(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    try {
        const book = await prisma.book.update({
            where: { id: params.id },
            data: { totalViews: { increment: 1 } }
        });

        return ApiResponse.success({ totalViews: book.totalViews }, 200, 'View count updated');
    } catch (error: any) {
        if (error.code === 'P2025') {
            return ApiResponse.error('Book not found', 404);
        }
        log.error('Increment view error', error, { endpoint: '/api/books/[id]/view', bookId: params.id });
        return ApiResponse.internalError('An error occurred while updating view count');
    }
}
