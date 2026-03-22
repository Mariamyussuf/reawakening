import { NextRequest, NextResponse } from 'next/server';
import {
    ForbiddenError,
    UnauthorizedError,
    requireAdminOrLeader,
} from '@/lib/middleware/auth';
import { rateLimiters } from '@/lib/middleware/ratelimit';
import { validateFile, FileValidationPresets } from '@/lib/validation/file-upload';
import { ApiResponse } from '@/lib/api/response';
import { isMissingDevotionalsTableError, serializeDevotional } from '@/lib/devotionals';
import { log } from '@/lib/logger';
import prisma from '@/lib/prisma';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { sanitizeRichText, sanitizeText } from '@/lib/sanitize';

export const dynamic = 'force-dynamic';

// GET /api/admin/devotionals/:id - Get single devotional (admin)
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    // Apply rate limiting
    const rateLimitResponse = await rateLimiters.admin(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    try {
        await requireAdminOrLeader();

        const devotional = await prisma.devotional.findUnique({
            where: { id: params.id }
        });

        if (!devotional) {
            return ApiResponse.error('Devotional not found', 404);
        }

        const formattedDevotional = serializeDevotional(devotional);

        return ApiResponse.success({ devotional: formattedDevotional });
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

        log.error('Get admin devotional error', error, { endpoint: '/api/admin/devotionals/[id]', devotionalId: params.id });
        return ApiResponse.internalError('An error occurred while fetching devotional');
    }
}

// PUT /api/admin/devotionals/:id - Update devotional
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
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
        const removeCover = formData.get('removeCover') === 'true';

        const existingDevotional = await prisma.devotional.findUnique({
            where: { id: params.id }
        });

        if (!existingDevotional) {
            return ApiResponse.error('Devotional not found', 404);
        }

        const updates: any = {
            title,
            content,
            excerpt,
            author,
            status: status ? status.toUpperCase() : undefined,
            publishDate: publishDate ? new Date(publishDate) : undefined,
        };

        if (scheduledDate) {
            updates.scheduledDate = new Date(scheduledDate);
        } else if (scheduledDate === null) {
            updates.scheduledDate = null;
        }

        if (scripture !== null) {
            updates.scripture = scripture || null;
        }

        if (tagsString !== null) {
            const tags = tagsString
                ? tagsString.split(',').map((tag) => tag.trim()).filter((tag) => tag.length > 0)
                : [];
            updates.tags = JSON.stringify(tags);
        }

        // Handle cover image
        if (removeCover && existingDevotional.coverImage) {
            // Delete old cover image
            const oldImagePath = path.join(process.cwd(), 'public', existingDevotional.coverImage);
            if (existsSync(oldImagePath)) {
                try {
                    await unlink(oldImagePath);
                } catch (error) {
                    log.warn('Error deleting old cover image', { error, devotionalId: params.id });
                }
            }
            updates.coverImage = null;
        } else if (coverFile && coverFile.size > 0) {
            // Validate cover image with content checking
            const coverValidation = await validateFile(coverFile, FileValidationPresets.coverImage as any);
            if (!coverValidation.valid) {
                return ApiResponse.error(coverValidation.error || "Invalid cover image", 400);
            }

            // Delete old cover image if exists
            if (existingDevotional.coverImage) {
                const oldImagePath = path.join(process.cwd(), 'public', existingDevotional.coverImage);
                if (existsSync(oldImagePath)) {
                    try {
                        await unlink(oldImagePath);
                    } catch (error) {
                        log.warn('Error deleting old cover image', { error, devotionalId: params.id });
                    }
                }
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
            updates.coverImage = `/uploads/devotionals/${fileName}`;
        }

        const devotional = await prisma.devotional.update({
            where: { id: params.id },
            data: updates
        });

        const formattedDevotional = serializeDevotional(devotional);

        return ApiResponse.success({ devotional: formattedDevotional }, 200, 'Devotional updated successfully');
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

        log.error('Update devotional error', error, { endpoint: '/api/admin/devotionals/[id]', devotionalId: params.id });
        return ApiResponse.internalError(error.message || 'An error occurred while updating devotional');
    }
}

// DELETE /api/admin/devotionals/:id - Delete devotional
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    // Apply rate limiting
    const rateLimitResponse = await rateLimiters.admin(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    try {
        await requireAdminOrLeader();

        const devotional = await prisma.devotional.findUnique({
            where: { id: params.id }
        });

        if (!devotional) {
            return ApiResponse.error('Devotional not found', 404);
        }

        // Delete cover image if exists
        if (devotional.coverImage) {
            const imagePath = path.join(process.cwd(), 'public', devotional.coverImage);
            if (existsSync(imagePath)) {
                try {
                    await unlink(imagePath);
                } catch (error) {
                    log.warn('Error deleting cover image', { error, devotionalId: params.id });
                }
            }
        }

        await prisma.devotional.delete({
            where: { id: params.id }
        });

        return ApiResponse.success(null, 200, 'Devotional deleted successfully');
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

        log.error('Delete devotional error', error, { endpoint: '/api/admin/devotionals/[id]', devotionalId: params.id });
        return ApiResponse.internalError('An error occurred while deleting devotional');
    }
}
