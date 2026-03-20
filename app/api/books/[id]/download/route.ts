import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth';
import { rateLimiters } from '@/lib/middleware/ratelimit';
import { ApiResponse } from '@/lib/api/response';
import { log } from '@/lib/logger';
import prisma from '@/lib/prisma';

// POST /api/books/:id/download - Increment download count and return download URL
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
        await requireAuth();

        const book = await prisma.book.update({
            where: { id: params.id },
            data: { totalDownloads: { increment: 1 } }
        });

        return ApiResponse.success({
            totalDownloads: book.totalDownloads,
            pdfUrl: book.pdfUrl,
        }, 200, 'Download count updated');
    } catch (error: any) {
        if (error.code === 'P2025') {
            return ApiResponse.error('Book not found', 404);
        }
        log.error('Increment download error', error, { endpoint: '/api/books/[id]/download', bookId: params.id });
        return ApiResponse.internalError('An error occurred while updating download count');
    }
}
