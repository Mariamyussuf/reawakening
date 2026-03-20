import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth';
import { rateLimiters } from '@/lib/middleware/ratelimit';
import { validateBody } from '@/lib/validation';
import { UpdateJournalEntrySchema } from '@/lib/validation/schemas';
import { ApiResponse } from '@/lib/api/response';
import { log } from '@/lib/logger';
import prisma from '@/lib/prisma';

// GET /api/journal/entries/:id - Get single journal entry
export async function GET(
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

        const entry = await prisma.journalEntry.findUnique({
            where: { id: params.id }
        });

        if (!entry) {
            return ApiResponse.error('Journal entry not found', 404);
        }

        // Check if user owns this entry
        if (entry.userId !== session.user.id) {
            return ApiResponse.forbidden('Unauthorized to view this entry');
        }

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

        return ApiResponse.success({ entry: formattedEntry });
    } catch (error: any) {
        log.error('Get journal entry error', error, { endpoint: '/api/journal/entries/[id]', entryId: params.id });
        return ApiResponse.internalError('An error occurred while fetching journal entry');
    }
}

// PUT /api/journal/entries/:id - Update journal entry
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
        const validation = await validateBody(request, UpdateJournalEntrySchema);
        if (!validation.success) {
            return validation.response;
        }

        const { title, content, category, mood, tags } = validation.data;

        // Check compatibility first
        const existingEntry = await prisma.journalEntry.findUnique({
            where: { id: params.id }
        });

        if (!existingEntry) {
            return ApiResponse.error('Journal entry not found', 404);
        }

        // Check if user owns this entry
        if (existingEntry.userId !== session.user.id) {
            return ApiResponse.forbidden('Unauthorized to update this entry');
        }

        // Update fields
        const data: any = {};
        if (title !== undefined) data.title = title?.trim() || null;
        if (content !== undefined) data.content = content.trim();
        if (category !== undefined) data.category = category;
        if (mood !== undefined) data.mood = mood || null;
        if (tags !== undefined) data.tags = JSON.stringify(tags || []);

        const entry = await prisma.journalEntry.update({
            where: { id: params.id },
            data
        });

        const formattedEntry = {
            id: entry.id,
            title: entry.title,
            content: entry.content,
            category: entry.category,
            mood: entry.mood,
            tags: entry.tags ? JSON.parse(entry.tags) : [],
            date: formatDate(entry.createdAt),
            time: formatTime(entry.updatedAt),
            createdAt: entry.createdAt,
            updatedAt: entry.updatedAt,
        };

        return ApiResponse.success(formattedEntry, 200, 'Journal entry updated successfully');
    } catch (error: any) {
        log.error('Update journal entry error', error, { endpoint: '/api/journal/entries/[id]', entryId: params.id });
        return ApiResponse.internalError('An error occurred while updating journal entry');
    }
}

// DELETE /api/journal/entries/:id - Delete journal entry
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

        const entry = await prisma.journalEntry.findUnique({
            where: { id: params.id }
        });

        if (!entry) {
            return ApiResponse.error('Journal entry not found', 404);
        }

        // Check if user owns this entry
        if (entry.userId !== session.user.id) {
            return ApiResponse.forbidden('Unauthorized to delete this entry');
        }

        await prisma.journalEntry.delete({
            where: { id: params.id }
        });

        return ApiResponse.success(null, 200, 'Journal entry deleted successfully');
    } catch (error: any) {
        log.error('Delete journal entry error', error, { endpoint: '/api/journal/entries/[id]', entryId: params.id });
        return ApiResponse.internalError('An error occurred while deleting journal entry');
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
