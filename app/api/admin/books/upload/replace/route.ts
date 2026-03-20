import { NextRequest, NextResponse } from "next/server";
import { requireAdminOrLeader } from "@/lib/middleware/auth";
import { rateLimiters } from "@/lib/middleware/ratelimit";
import { validateFile, FileValidationPresets } from "@/lib/validation/file-upload";
import { ApiResponse } from "@/lib/api/response";
import { log } from "@/lib/logger";
import { writeFile, mkdir, unlink } from "fs/promises";
import { existsSync } from "fs";
import path from "path";

export async function POST(request: NextRequest) {
    // Apply rate limiting
    const rateLimitResponse = await rateLimiters.upload(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    try {
        await requireAdminOrLeader();

        const formData = await request.formData();
        const pdfFile = formData.get("pdf") as File | null;
        const coverFile = formData.get("cover") as File | null;
        const bookId = formData.get("bookId") as string;

        if (!bookId) {
            return ApiResponse.error("Book ID is required", 400);
        }

        const result: { pdfUrl?: string; coverImage?: string } = {};

        // Ensure directories exist
        const pdfDir = path.join(process.cwd(), "public", "books", "pdfs");
        const coverDir = path.join(process.cwd(), "public", "images", "books", "covers");

        if (!existsSync(pdfDir)) {
            await mkdir(pdfDir, { recursive: true });
        }

        if (!existsSync(coverDir)) {
            await mkdir(coverDir, { recursive: true });
        }

        // Replace PDF if provided
        if (pdfFile) {
            // Validate PDF file with content checking
            const pdfValidation = await validateFile(pdfFile, FileValidationPresets.pdf);
            if (!pdfValidation.valid) {
                return ApiResponse.error(pdfValidation.error || "Invalid PDF file", 400);
            }

            const pdfBytes = await pdfFile.arrayBuffer();
            const pdfBuffer = Buffer.from(pdfBytes);
            const pdfFileName = `${bookId}.pdf`;
            const pdfPath = path.join(pdfDir, pdfFileName);

            // Delete old PDF if exists
            if (existsSync(pdfPath)) {
                await unlink(pdfPath);
            }

            await writeFile(pdfPath, pdfBuffer);
            result.pdfUrl = `/books/pdfs/${pdfFileName}`;
        }

        // Replace cover image if provided
        if (coverFile) {
            // Validate cover image with content checking
            const coverValidation = await validateFile(coverFile, FileValidationPresets.coverImage);
            if (!coverValidation.valid) {
                return ApiResponse.error(coverValidation.error || "Invalid cover image", 400);
            }

            const coverBytes = await coverFile.arrayBuffer();
            const coverBuffer = Buffer.from(coverBytes);
            const extension = coverFile.name.split(".").pop() || "jpg";
            const coverFileName = `${bookId}.${extension}`;
            const coverPath = path.join(coverDir, coverFileName);

            // Delete old cover if exists
            if (existsSync(coverPath)) {
                await unlink(coverPath);
            }

            await writeFile(coverPath, coverBuffer);
            result.coverImage = `/images/books/covers/${coverFileName}`;
        }

        return ApiResponse.success(result, 200, "Files replaced successfully");

    } catch (error: any) {
        log.error("Replace files error", error, { endpoint: '/api/admin/books/upload/replace' });
        return ApiResponse.internalError(error.message || "Failed to replace files");
    }
}
