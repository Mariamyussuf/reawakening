import { NextRequest } from 'next/server';
import {
    ForbiddenError,
    UnauthorizedError,
    requireAdminOrLeader,
} from '@/lib/middleware/auth';
import { rateLimiters } from '@/lib/middleware/ratelimit';
import { validateFile, FileValidationPresets } from '@/lib/validation/file-upload';
import { ApiResponse } from '@/lib/api/response';
import {
    DEVOTIONAL_STATUSES,
    isMissingDevotionalsTableError,
    serializeDevotional,
} from '@/lib/devotionals';
import { log } from '@/lib/logger';
import prisma from '@/lib/prisma';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { sanitizeRichText, sanitizeText } from '@/lib/sanitize';

export const dynamic = 'force-dynamic';

// GET /api/admin/devotionals - Get all devotionals (including drafts)
export async function GET(request: NextRequest) {
    try {
        await requireAdminOrLeader();

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const limit = parseInt(searchParams.get('limit') || '50');
        const skip = parseInt(searchParams.get('skip') || '0');

        const where: any = {};
        if (status && status !== 'all' && DEVOTIONAL_STATUSES.includes(status.toUpperCase() as any)) {
            where.status = status.toUpperCase();
        }

        let devotionals;
        let total;

        try {
            [devotionals, total] = await Promise.all([
                prisma.devotional.findMany({
                    where,
                    orderBy: { createdAt: 'desc' },
                    take: limit,
                    skip: skip,
                }),
                prisma.devotional.count({ where }),
            ]);
        } catch (error) {
            if (isMissingDevotionalsTableError(error)) {
                return ApiResponse.success({
                    devotionals: [],
                    total: 0,
                    limit,
                    skip,
                    needsDatabaseSetup: true,
                });
            }

            throw error;
        }

        return ApiResponse.success({
            devotionals: devotionals.map(serializeDevotional),
            total,
            limit,
            skip,
        });
    } catch (error: any) {
        if (error instanceof UnauthorizedError) {
            return ApiResponse.unauthorized(error.message);
        }

        if (error instanceof ForbiddenError) {
            return ApiResponse.forbidden(error.message);
        }

        log.error('Get admin devotionals error', error, { endpoint: '/api/admin/devotionals' });
        return ApiResponse.internalError('An error occurred while fetching devotionals');
    }
}

// POST /api/admin/devotionals - Create new devotional
export async function POST(request: NextRequest) {
    // Apply rate limiting
    const rateLimitResponse = await rateLimiters.admin(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    try {
        await requireAdminOrLeader();

        const formData = await request.formData();

        const title = sanitizeText(formData.get('title') as string);
        const content = sanitizeRichText(formData.get('content') as string);
        const excerpt = sanitizeText(formData.get('excerpt') as string);
        const author = sanitizeText(formData.get('author') as string);
        const status = formData.get('status') as string;
        const publishDate = formData.get('publishDate') as string;
        const scheduledDate = formData.get('scheduledDate') as string | null;
        const scripture = formData.get('scripture') as string | null;
        const tagsString = formData.get('tags') as string;
        const coverFile = formData.get('cover') as File | null;

        // Basic validation
        if (!title || !content || !excerpt || !author) {
            return ApiResponse.error('Title, content, excerpt, and author are required', 400);
        }

        if (!status || !['draft', 'scheduled', 'published'].includes(status.toLowerCase())) {
            return ApiResponse.error('Valid status is required (draft, scheduled, or published)', 400);
        }

        let coverImagePath = null; // Prisma expects string | null for optional

        // Handle cover image upload
        if (coverFile && coverFile.size > 0) {
            // Validate cover image with content checking
            const coverValidation = await validateFile(coverFile, FileValidationPresets.coverImage as any);
            if (!coverValidation.valid) {
                return ApiResponse.error(coverValidation.error || "Invalid cover image", 400);
            }

            const bytes = await coverFile.arrayBuffer();
            const buffer = Buffer.from(bytes);

            const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'devotionals');
            if (!existsSync(uploadDir)) {
                await mkdir(uploadDir, { recursive: true });
            }

            const fileExtension = coverFile.name.split('.').pop();
            const fileName = `cover-${Date.now()}.${fileExtension}`;
            const filePath = path.join(uploadDir, fileName);

            await writeFile(filePath, buffer);
            coverImagePath = `/uploads/devotionals/${fileName}`;
        }

        // Parse tags
        const tags = tagsString
            ? tagsString.split(',').map((tag) => tag.trim()).filter((tag) => tag.length > 0)
            : [];

        const data: any = {
            title,
            content,
            excerpt,
            author,
            status: status.toUpperCase(),
            tags: JSON.stringify(tags),
            publishDate: publishDate ? new Date(publishDate) : new Date(),
            coverImage: coverImagePath || undefined,
            scripture: scripture ? sanitizeText(scripture) : undefined,
            scheduledDate: scheduledDate ? new Date(scheduledDate) : undefined
        };

        const devotional = await prisma.devotional.create({
            data
        });

        const formattedDevotional = {
            ...serializeDevotional(devotional),
            tags,
        };

        return ApiResponse.created(formattedDevotional);
    } catch (error: any) {
        if (error instanceof UnauthorizedError) {
            return ApiResponse.unauthorized(error.message);
        }

        if (error instanceof ForbiddenError) {
            return ApiResponse.forbidden(error.message);
        }

        if (isMissingDevotionalsTableError(error)) {
            return ApiResponse.error(
                'Devotionals are not available yet because the database schema has not been updated in this environment.',
                503
            );
        }

        log.error('Create devotional error', error, { endpoint: '/api/admin/devotionals' });
        return ApiResponse.internalError(error.message || 'An error occurred while creating devotional');
    }
}
