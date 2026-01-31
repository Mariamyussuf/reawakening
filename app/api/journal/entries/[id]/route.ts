import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import JournalEntry from '@/models/JournalEntry';

// GET /api/journal/entries/:id - Get single journal entry
export async function GET(
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

        const entry = await JournalEntry.findById(params.id);

        if (!entry) {
            return NextResponse.json(
                { error: 'Journal entry not found' },
                { status: 404 }
            );
        }

        // Check if user owns this entry
        if (entry.userId.toString() !== (session.user as any).id) {
            return NextResponse.json(
                { error: 'Unauthorized to view this entry' },
                { status: 403 }
            );
        }

        const formattedEntry = {
            id: entry._id.toString(),
            title: entry.title,
            content: entry.content,
            category: entry.category,
            mood: entry.mood,
            tags: entry.tags || [],
            date: formatDate(entry.createdAt),
            time: formatTime(entry.createdAt),
            createdAt: entry.createdAt,
            updatedAt: entry.updatedAt,
        };

        return NextResponse.json({ entry: formattedEntry }, { status: 200 });
    } catch (error: any) {
        console.error('Get journal entry error:', error);
        return NextResponse.json(
            { error: 'An error occurred while fetching journal entry' },
            { status: 500 }
        );
    }
}

// PUT /api/journal/entries/:id - Update journal entry
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

        const { title, content, category, mood, tags } = await request.json();

        await dbConnect();

        const entry = await JournalEntry.findById(params.id);

        if (!entry) {
            return NextResponse.json(
                { error: 'Journal entry not found' },
                { status: 404 }
            );
        }

        // Check if user owns this entry
        if (entry.userId.toString() !== (session.user as any).id) {
            return NextResponse.json(
                { error: 'Unauthorized to update this entry' },
                { status: 403 }
            );
        }

        // Validation
        if (content && content.length > 5000) {
            return NextResponse.json(
                { error: 'Content cannot be more than 5000 characters' },
                { status: 400 }
            );
        }

        if (title && title.length > 200) {
            return NextResponse.json(
                { error: 'Title cannot be more than 200 characters' },
                { status: 400 }
            );
        }

        // Update fields
        if (title !== undefined) entry.title = title?.trim() || undefined;
        if (content !== undefined) entry.content = content.trim();
        if (category !== undefined) entry.category = category;
        if (mood !== undefined) entry.mood = mood || undefined;
        if (tags !== undefined) entry.tags = tags || [];

        await entry.save();

        const formattedEntry = {
            id: entry._id.toString(),
            title: entry.title,
            content: entry.content,
            category: entry.category,
            mood: entry.mood,
            tags: entry.tags || [],
            date: formatDate(entry.createdAt),
            time: formatTime(entry.updatedAt),
            createdAt: entry.createdAt,
            updatedAt: entry.updatedAt,
        };

        return NextResponse.json(
            { message: 'Journal entry updated successfully', entry: formattedEntry },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Update journal entry error:', error);
        return NextResponse.json(
            { error: 'An error occurred while updating journal entry' },
            { status: 500 }
        );
    }
}

// DELETE /api/journal/entries/:id - Delete journal entry
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

        const entry = await JournalEntry.findById(params.id);

        if (!entry) {
            return NextResponse.json(
                { error: 'Journal entry not found' },
                { status: 404 }
            );
        }

        // Check if user owns this entry
        if (entry.userId.toString() !== (session.user as any).id) {
            return NextResponse.json(
                { error: 'Unauthorized to delete this entry' },
                { status: 403 }
            );
        }

        await JournalEntry.findByIdAndDelete(params.id);

        return NextResponse.json(
            { message: 'Journal entry deleted successfully' },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Delete journal entry error:', error);
        return NextResponse.json(
            { error: 'An error occurred while deleting journal entry' },
            { status: 500 }
        );
    }
}

// Helper functions
function formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

function formatTime(date: Date): string {
    return new Date(date).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
}
