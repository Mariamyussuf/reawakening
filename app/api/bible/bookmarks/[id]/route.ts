import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth';
import { rateLimiters } from '@/lib/middleware/ratelimit';
import { validateBody } from '@/lib/validation';
import { UpdateBibleBookmarkSchema } from '@/lib/validation/schemas';
import { ApiResponse } from '@/lib/api/response';
import { log } from '@/lib/logger';
import prisma from '@/lib/prisma';

// PUT /api/bible/bookmarks/:id - Update bookmark
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    // Apply rate limiting
    const rateLimitResponse = await rateLimiters.api(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    try {
        const session = await requireAuth();

        // Validate request body
        const validation = await validateBody(request, UpdateBibleBookmarkSchema);
        if (!validation.success) {
            return validation.response;
        }

        const { note, color } = validation.data;

        const existingBookmark = await prisma.bibleBookmark.findUnique({
            where: { id: params.id }
        });

        if (!existingBookmark) {
            return ApiResponse.error('Bookmark not found', 404);
        }

        // Check if user owns this bookmark
        if (existingBookmark.userId !== session.user.id) {
            return ApiResponse.forbidden('Unauthorized to update this bookmark');
        }

        // Update fields
        const data: any = {};
        if (note !== undefined) data.note = note || null;
        if (color !== undefined) data.color = color;

        const bookmark = await prisma.bibleBookmark.update({
            where: { id: params.id },
            data
        });

        const formattedBookmark = {
            id: bookmark.id,
            version: bookmark.version,
            bookId: bookmark.bookId,
            bookName: bookmark.bookName,
            chapter: bookmark.chapter,
            verse: bookmark.verse,
            verseText: bookmark.verseText,
            reference: bookmark.reference,
            note: bookmark.note,
            color: bookmark.color,
            createdAt: bookmark.createdAt,
            updatedAt: bookmark.updatedAt,
        };

        return ApiResponse.success(formattedBookmark, 200, 'Bookmark updated successfully');
    } catch (error: any) {
        log.error('Update bookmark error', error, { endpoint: '/api/bible/bookmarks/[id]', bookmarkId: params.id });
        return ApiResponse.internalError('An error occurred while updating bookmark');
    }
}

// DELETE /api/bible/bookmarks/:id - Delete bookmark
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    // Apply rate limiting
    const rateLimitResponse = await rateLimiters.api(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    try {
        const session = await requireAuth();

        const bookmark = await prisma.bibleBookmark.findUnique({
            where: { id: params.id }
        });

        if (!bookmark) {
            return ApiResponse.error('Bookmark not found', 404);
        }

        // Check if user owns this bookmark
        if (bookmark.userId !== session.user.id) {
            return ApiResponse.forbidden('Unauthorized to delete this bookmark');
        }

        await prisma.bibleBookmark.delete({
            where: { id: params.id }
        });

        return ApiResponse.success(null, 200, 'Bookmark deleted successfully');
    } catch (error: any) {
        log.error('Delete bookmark error', error, { endpoint: '/api/bible/bookmarks/[id]', bookmarkId: params.id });
        return ApiResponse.internalError('An error occurred while deleting bookmark');
    }
}
