import { NextRequest, NextResponse } from "next/server";
import { requireAdminOrLeader } from "@/lib/middleware/auth";
import { rateLimiters } from "@/lib/middleware/ratelimit";
import { validateFile, FileValidationPresets } from "@/lib/validation/file-upload";
import { ApiResponse } from "@/lib/api/response";
import { log } from "@/lib/logger";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
    // Apply rate limiting for uploads
    const rateLimitResponse = await rateLimiters.upload(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    try {
        await requireAdminOrLeader();

        const formData = await request.formData();

        const pdfFile = formData.get("pdf") as File;
        const coverFile = formData.get("cover") as File | null;
        const metadataString = formData.get("metadata") as string;

        // Validation
        if (!pdfFile) {
            return ApiResponse.error("PDF file is required", 400);
        }

        if (!metadataString) {
            return ApiResponse.error("Book metadata is required", 400);
        }

        // Validate PDF file with content checking
        const pdfValidation = await validateFile(pdfFile, FileValidationPresets.pdf);
        if (!pdfValidation.valid) {
            return ApiResponse.error(pdfValidation.error || "Invalid PDF file", 400);
        }

        // Validate cover image if provided
        if (coverFile) {
            const coverValidation = await validateFile(coverFile, FileValidationPresets.coverImage);
            if (!coverValidation.valid) {
                return ApiResponse.error(coverValidation.error || "Invalid cover image", 400);
            }
        }

        const metadata = JSON.parse(metadataString);

        // Validate required fields
        if (!metadata.title || !metadata.author || !metadata.description) {
            return ApiResponse.error("Title, author, and description are required", 400);
        }

        if (!metadata.categories || metadata.categories.length === 0) {
            return ApiResponse.error("At least one category is required", 400);
        }

        // Generate unique ID for the book
        const bookId = `book-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        // Ensure directories exist
        const pdfDir = path.join(process.cwd(), "public", "books", "pdfs");
        const coverDir = path.join(process.cwd(), "public", "images", "books", "covers");

        if (!existsSync(pdfDir)) {
            await mkdir(pdfDir, { recursive: true });
        }

        if (!existsSync(coverDir)) {
            await mkdir(coverDir, { recursive: true });
        }

        // Save PDF file
        const pdfBytes = await pdfFile.arrayBuffer();
        const pdfBuffer = Buffer.from(pdfBytes);
        const pdfFileName = `${bookId}.pdf`;
        const pdfPath = path.join(pdfDir, pdfFileName);
        await writeFile(pdfPath, pdfBuffer);

        // Save cover image if provided
        let coverFileName = null;
        if (coverFile) {
            const coverBytes = await coverFile.arrayBuffer();
            const coverBuffer = Buffer.from(coverBytes);
            const extension = coverFile.name.split(".").pop() || "jpg";
            coverFileName = `${bookId}.${extension}`;
            const coverPath = path.join(coverDir, coverFileName);
            await writeFile(coverPath, coverBuffer);
        }

        // Calculate file size in MB
        const fileSize = parseFloat((pdfFile.size / 1024 / 1024).toFixed(2));

        // Save to database
        const book = await prisma.book.create({
            data: {
                title: metadata.title.trim(),
                author: metadata.author.trim(),
                description: metadata.description.trim(),
                pdfUrl: `/books/pdfs/${pdfFileName}`,
                coverImage: coverFileName ? `/images/books/covers/${coverFileName}` : undefined,
                fileSize,
                categories: JSON.stringify(metadata.categories),
                tags: JSON.stringify(metadata.tags || []),
                publishYear: metadata.publishYear || undefined,
                publisher: metadata.publisher?.trim() || undefined,
                isbn: metadata.isbn?.trim() || undefined,
                language: metadata.language || "en",
                difficulty: metadata.difficulty || "intermediate",
                featured: metadata.featured || false,
                popular: metadata.popular || false,
                newRelease: metadata.newRelease || false,
                totalDownloads: 0,
                totalViews: 0,
            }
        });

        const formattedBook = {
            id: book.id,
            title: book.title,
            author: book.author,
            description: book.description,
            pdfUrl: book.pdfUrl,
            coverImage: book.coverImage,
            fileSize: book.fileSize,
            categories: metadata.categories, // Return original, not JSON string
            tags: metadata.tags || [], // Return original
            createdAt: book.createdAt,
        };

        return ApiResponse.created(formattedBook, "Book uploaded successfully");

    } catch (error: any) {
        log.error("Upload error", error, { endpoint: '/api/admin/books/upload' });
        return ApiResponse.internalError(error.message || "Failed to upload book");
    }
}
