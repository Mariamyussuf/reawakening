import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import JournalEntry from '@/models/JournalEntry';

// GET /api/journal/entries - Get user's journal entries
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
        const category = searchParams.get('category');
        const limit = parseInt(searchParams.get('limit') || '50');
        const skip = parseInt(searchParams.get('skip') || '0');

        const query: any = { userId: (session.user as any).id };

        if (category && category !== 'all') {
            query.category = category;
        }

        const entries = await JournalEntry.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)
            .lean();

        // Format response
        const formattedEntries = entries.map((entry: any) => ({
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
        }));

        // Get total count for pagination
        const total = await JournalEntry.countDocuments(query);

        return NextResponse.json(
            {
                entries: formattedEntries,
                total,
                limit,
                skip,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Get journal entries error:', error);
        return NextResponse.json(
            { error: 'An error occurred while fetching journal entries' },
            { status: 500 }
        );
    }
}

// POST /api/journal/entries - Create journal entry
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { title, content, category, mood, tags } = await request.json();

        // Validation
        if (!content || !content.trim()) {
            return NextResponse.json(
                { error: 'Please provide journal content' },
                { status: 400 }
            );
        }

        if (content.length > 5000) {
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

        await dbConnect();

        const entry = await JournalEntry.create({
            userId: (session.user as any).id,
            title: title?.trim() || undefined,
            content: content.trim(),
            category: category || 'general',
            mood: mood || undefined,
            tags: tags || [],
        });

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

        return NextResponse.json(
            { message: 'Journal entry created successfully', entry: formattedEntry },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Create journal entry error:', error);
        return NextResponse.json(
            { error: 'An error occurred while creating journal entry' },
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
