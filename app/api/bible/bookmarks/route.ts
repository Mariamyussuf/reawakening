import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import BibleBookmark from '@/models/BibleBookmark';

// GET /api/bible/bookmarks - Get user's bookmarks
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await dbConnect();

        const { searchParams } = new URL(request.url);
        const bookId = searchParams.get('bookId');
        const chapter = searchParams.get('chapter');
        const version = searchParams.get('version');

        const query: any = { userId: (session.user as any).id };

        if (bookId) query.bookId = bookId;
        if (chapter) query.chapter = parseInt(chapter);
        if (version) query.version = version;

        const bookmarks = await BibleBookmark.find(query)
            .sort({ createdAt: -1 })
            .lean();

        // Format response
        const formattedBookmarks = bookmarks.map((bookmark: any) => ({
            id: bookmark._id.toString(),
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

        return NextResponse.json({ bookmarks: formattedBookmarks }, { status: 200 });
    } catch (error: any) {
        console.error('Get bookmarks error:', error);
        return NextResponse.json(
            { error: 'An error occurred while fetching bookmarks' },
            { status: 500 }
        );
    }
}

// POST /api/bible/bookmarks - Create bookmark
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { version, bookId, bookName, chapter, verse, verseText, reference, note, color } = await request.json();

        // Validation
        if (!version || !bookId || !bookName || !chapter || !reference) {
            return NextResponse.json(
                { error: 'Please provide version, bookId, bookName, chapter, and reference' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Check if bookmark already exists
        const existing = await BibleBookmark.findOne({
            userId: (session.user as any).id,
            version,
            bookId,
            chapter,
            verse: verse || null,
        });

        if (existing) {
            return NextResponse.json(
                { error: 'Bookmark already exists' },
                { status: 400 }
            );
        }

        const bookmark = await BibleBookmark.create({
            userId: (session.user as any).id,
            version,
            bookId,
            bookName,
            chapter,
            verse: verse || undefined,
            verseText: verseText || undefined,
            reference,
            note: note || undefined,
            color: color || 'yellow',
        });

        const formattedBookmark = {
            id: bookmark._id.toString(),
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

        return NextResponse.json(
            { message: 'Bookmark created successfully', bookmark: formattedBookmark },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Create bookmark error:', error);
        return NextResponse.json(
            { error: 'An error occurred while creating bookmark' },
            { status: 500 }
        );
    }
}
