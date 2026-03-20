import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth';
import { rateLimiters } from '@/lib/middleware/ratelimit';
import { validateBody } from '@/lib/validation';
import { BibleBookmarkSchema } from '@/lib/validation/schemas';
import { ApiResponse } from '@/lib/api/response';
import { log } from '@/lib/logger';
import prisma from '@/lib/prisma';

// GET /api/bible/bookmarks - Get user's bookmarks
export async function GET(request: NextRequest) {
    // Apply rate limiting
    const rateLimitResponse = await rateLimiters.api(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    try {
        const session = await requireAuth();

        const { searchParams } = new URL(request.url);
        const bookId = searchParams.get('bookId');
        const chapter = searchParams.get('chapter');
        const version = searchParams.get('version');

        const where: any = { userId: session.user.id };

        if (bookId) where.bookId = bookId;
        if (chapter) where.chapter = parseInt(chapter);
        if (version) where.version = version;

        const bookmarks = await prisma.bibleBookmark.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });

        // Format response
        const formattedBookmarks = bookmarks.map((bookmark) => ({
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
        }));

        return ApiResponse.success({ bookmarks: formattedBookmarks });
    } catch (error: any) {
        log.error('Get bookmarks error', error, { endpoint: '/api/bible/bookmarks' });
        return ApiResponse.internalError('An error occurred while fetching bookmarks');
    }
}

// POST /api/bible/bookmarks - Create bookmark
export async function POST(request: NextRequest) {
    // Apply rate limiting
    const rateLimitResponse = await rateLimiters.api(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    try {
        const session = await requireAuth();

        // Validate request body
        const validation = await validateBody(request, BibleBookmarkSchema);
        if (!validation.success) {
            return validation.response;
        }

        const { version, bookId, bookName, chapter, verse, verseText, reference, note, color } = validation.data;

        // Check if bookmark already exists
        const existing = await prisma.bibleBookmark.findFirst({
            where: {
                userId: session.user.id,
                version,
                bookId,
                chapter,
                verse: verse || null,
            }
        });

        if (existing) {
            return ApiResponse.error('Bookmark already exists', 400);
        }

        const bookmark = await prisma.bibleBookmark.create({
            data: {
                userId: session.user.id,
                version,
                bookId,
                bookName,
                chapter,
                verse: verse || null,
                verseText: verseText || null,
                reference,
                note: note || null,
                color: color || 'YELLOW',
            }
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

        return ApiResponse.created(formattedBookmark, 'Bookmark created successfully');
    } catch (error: any) {
        log.error('Create bookmark error', error, { endpoint: '/api/bible/bookmarks' });
        return ApiResponse.internalError('An error occurred while creating bookmark');
    }
}
