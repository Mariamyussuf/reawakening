import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import BibleBookmark from '@/models/BibleBookmark';

// PUT /api/bible/bookmarks/:id - Update bookmark
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { note, color } = await request.json();

        await dbConnect();

        const bookmark = await BibleBookmark.findById(params.id);

        if (!bookmark) {
            return NextResponse.json(
                { error: 'Bookmark not found' },
                { status: 404 }
            );
        }

        // Check if user owns this bookmark
        if (bookmark.userId.toString() !== (session.user as any).id) {
            return NextResponse.json(
                { error: 'Unauthorized to update this bookmark' },
                { status: 403 }
            );
        }

        // Update fields
        if (note !== undefined) bookmark.note = note || undefined;
        if (color !== undefined) bookmark.color = color;

        await bookmark.save();

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
            { message: 'Bookmark updated successfully', bookmark: formattedBookmark },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Update bookmark error:', error);
        return NextResponse.json(
            { error: 'An error occurred while updating bookmark' },
            { status: 500 }
        );
    }
}

// DELETE /api/bible/bookmarks/:id - Delete bookmark
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await dbConnect();

        const bookmark = await BibleBookmark.findById(params.id);

        if (!bookmark) {
            return NextResponse.json(
                { error: 'Bookmark not found' },
                { status: 404 }
            );
        }

        // Check if user owns this bookmark
        if (bookmark.userId.toString() !== (session.user as any).id) {
            return NextResponse.json(
                { error: 'Unauthorized to delete this bookmark' },
                { status: 403 }
            );
        }

        await BibleBookmark.findByIdAndDelete(params.id);

        return NextResponse.json(
            { message: 'Bookmark deleted successfully' },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Delete bookmark error:', error);
        return NextResponse.json(
            { error: 'An error occurred while deleting bookmark' },
            { status: 500 }
        );
    }
}
