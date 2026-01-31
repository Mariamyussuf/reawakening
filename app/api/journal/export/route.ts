import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import JournalEntry from '@/models/JournalEntry';

// GET /api/journal/export - Export journal entries as text
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
        const format = searchParams.get('format') || 'text'; // 'text' or 'json'
        const category = searchParams.get('category');

        const query: any = { userId: (session.user as any).id };

        if (category && category !== 'all') {
            query.category = category;
        }

        const entries = await JournalEntry.find(query)
            .sort({ createdAt: -1 })
            .lean();

        if (format === 'json') {
            return NextResponse.json(
                {
                    entries: entries.map((entry: any) => ({
                        id: entry._id.toString(),
                        title: entry.title,
                        content: entry.content,
                        category: entry.category,
                        mood: entry.mood,
                        tags: entry.tags,
                        createdAt: entry.createdAt,
                        updatedAt: entry.updatedAt,
                    })),
                },
                {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Disposition': 'attachment; filename="journal-export.json"',
                    },
                }
            );
        }

        // Format as text
        let textContent = `Prayer Journal Export\n`;
        textContent += `Generated: ${new Date().toLocaleString()}\n`;
        textContent += `Total Entries: ${entries.length}\n`;
        textContent += `\n${'='.repeat(50)}\n\n`;

        entries.forEach((entry: any, index: number) => {
            textContent += `Entry ${index + 1}\n`;
            textContent += `Date: ${new Date(entry.createdAt).toLocaleString()}\n`;
            if (entry.title) {
                textContent += `Title: ${entry.title}\n`;
            }
            textContent += `Category: ${entry.category}\n`;
            if (entry.mood) {
                textContent += `Mood: ${entry.mood}\n`;
            }
            if (entry.tags && entry.tags.length > 0) {
                textContent += `Tags: ${entry.tags.join(', ')}\n`;
            }
            textContent += `\n${entry.content}\n`;
            textContent += `\n${'-'.repeat(50)}\n\n`;
        });

        return new NextResponse(textContent, {
            status: 200,
            headers: {
                'Content-Type': 'text/plain',
                'Content-Disposition': 'attachment; filename="journal-export.txt"',
            },
        });
    } catch (error: any) {
        console.error('Export journal error:', error);
        return NextResponse.json(
            { error: 'An error occurred while exporting journal' },
            { status: 500 }
        );
    }
}
