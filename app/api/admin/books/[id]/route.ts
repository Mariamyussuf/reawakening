import { NextRequest, NextResponse } from "next/server";
import { requireAdminOrLeader } from "@/lib/middleware/auth";
import { rateLimiters } from "@/lib/middleware/ratelimit";
import { validateBody } from "@/lib/validation";
import { UpdateBookSchema } from "@/lib/validation/schemas";
import { ApiResponse } from "@/lib/api/response";
import { log } from "@/lib/logger";
import prisma from "@/lib/prisma";

// PUT /api/admin/books/:id - Update book
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

        // Validate request body
        const validation = await validateBody(request, UpdateBookSchema);
        if (!validation.success) {
            return validation.response;
        }

        const updates = validation.data;

        // Handle JSON fields
        const data: any = { ...updates };
        if (updates.categories) {
            data.categories = JSON.stringify(updates.categories);
        }
        if (updates.tags) {
            data.tags = JSON.stringify(updates.tags);
        }

        const book = await prisma.book.update({
            where: { id: params.id },
            data
        });

        const formattedBook = {
            id: book.id,
            title: book.title,
            author: book.author,
            description: book.description,
            pdfUrl: book.pdfUrl,
            coverImage: book.coverImage,
            fileSize: book.fileSize,
            categories: book.categories ? JSON.parse(book.categories) : [],
            tags: book.tags ? JSON.parse(book.tags) : [],
            publishYear: book.publishYear,
            publisher: book.publisher,
            isbn: book.isbn,
            language: book.language,
            difficulty: book.difficulty,
            featured: book.featured,
            popular: book.popular,
            newRelease: book.newRelease,
            totalDownloads: book.totalDownloads,
            totalViews: book.totalViews,
            createdAt: book.createdAt,
            updatedAt: book.updatedAt,
        };

        return ApiResponse.success(formattedBook, 200, "Book updated successfully");
    } catch (error: any) {
        if (error.code === 'P2025') {
            return ApiResponse.error("Book not found", 404);
        }
        log.error("Update book error", error, { endpoint: '/api/admin/books/[id]', bookId: params.id });
        return ApiResponse.internalError(error.message || "Failed to update book");
    }
}

// DELETE /api/admin/books/:id - Delete book
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

        // TODO: Delete associated files (PDF and cover image) from filesystem
        // For now, we'll just delete from database

        try {
            await prisma.book.delete({
                where: { id: params.id }
            });
        } catch (e: any) {
            if (e.code === 'P2025') {
                return ApiResponse.error("Book not found", 404);
            }
            throw e;
        }

        return ApiResponse.success(null, 200, "Book deleted successfully");
    } catch (error: any) {
        log.error("Delete book error", error, { endpoint: '/api/admin/books/[id]', bookId: params.id });
        return ApiResponse.internalError(error.message || "Failed to delete book");
    }
}
