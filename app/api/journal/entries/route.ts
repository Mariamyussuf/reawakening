import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth';
import { rateLimiters } from '@/lib/middleware/ratelimit';
import { validateBody } from '@/lib/validation';
import { JournalEntrySchema } from '@/lib/validation/schemas';
import { ApiResponse } from '@/lib/api/response';
import { log } from '@/lib/logger';
import prisma from '@/lib/prisma';

// GET /api/journal/entries - Get user's journal entries
export async function GET(request: NextRequest) {
    // Apply rate limiting
    const rateLimitResponse = await rateLimiters.api(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    try {
        const session = await requireAuth();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const limit = parseInt(searchParams.get('limit') || '50');
        const skip = parseInt(searchParams.get('skip') || '0');

        const where: any = { userId: session.user.id };

        if (category && category !== 'all') {
            where.category = category;
        }

        const entries = await prisma.journalEntry.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: skip,
        });

        // Format response
        const formattedEntries = entries.map((entry) => ({
            id: entry.id,
            title: entry.title,
            content: entry.content,
            category: entry.category,
            mood: entry.mood,
            tags: entry.tags ? JSON.parse(entry.tags) : [],
            date: formatDate(entry.createdAt),
            time: formatTime(entry.createdAt),
            createdAt: entry.createdAt,
            updatedAt: entry.updatedAt,
        }));

        // Get total count for pagination
        const total = await prisma.journalEntry.count({ where });

        return ApiResponse.success({
            entries: formattedEntries,
            total,
            limit,
            skip,
        });
    } catch (error: any) {
        log.error('Get journal entries error', error, { endpoint: '/api/journal/entries' });
        return ApiResponse.internalError('An error occurred while fetching journal entries');
    }
}

// POST /api/journal/entries - Create journal entry
export async function POST(request: NextRequest) {
    // Apply rate limiting
    const rateLimitResponse = await rateLimiters.api(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    try {
        const session = await requireAuth();

        // Validate request body
        const validation = await validateBody(request, JournalEntrySchema);
        if (!validation.success) {
            return validation.response;
        }

        const { title, content, category, mood, tags } = validation.data;

        const entry = await prisma.journalEntry.create({
            data: {
                userId: session.user.id,
                title: title?.trim() || null,
                content: content.trim(),
                category: category || 'GENERAL',
                mood: mood || null,
                tags: JSON.stringify(tags || []),
            }
        });

        const formattedEntry = {
            id: entry.id,
            title: entry.title,
            content: entry.content,
            category: entry.category,
            mood: entry.mood,
            tags: entry.tags ? JSON.parse(entry.tags) : [],
            date: formatDate(entry.createdAt),
            time: formatTime(entry.createdAt),
            createdAt: entry.createdAt,
            updatedAt: entry.updatedAt,
        };

        return ApiResponse.created(formattedEntry, 'Journal entry created successfully');
    } catch (error: any) {
        log.error('Create journal entry error', error, { endpoint: '/api/journal/entries' });
        return ApiResponse.internalError('An error occurred while creating journal entry');
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
