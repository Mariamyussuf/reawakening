import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import path from "path";
import dbConnect from "@/lib/mongodb";
import BookModel from "@/models/BookModel";

// Maximum file sizes (in bytes)
const MAX_PDF_SIZE = 50 * 1024 * 1024; // 50 MB
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: NextRequest) {
    try {
        // Check authentication and admin role
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Check if user is admin
        const userRole = (session.user as any).role;
        if (userRole !== "admin" && userRole !== "leader") {
            return NextResponse.json(
                { error: "Forbidden: Admin access required" },
                { status: 403 }
            );
        }

        const formData = await request.formData();

        const pdfFile = formData.get("pdf") as File;
        const coverFile = formData.get("cover") as File | null;
        const metadataString = formData.get("metadata") as string;

        // Validation
        if (!pdfFile) {
            return NextResponse.json(
                { error: "PDF file is required" },
                { status: 400 }
            );
        }

        if (!metadataString) {
            return NextResponse.json(
                { error: "Book metadata is required" },
                { status: 400 }
            );
        }

        // Validate file sizes
        if (pdfFile.size > MAX_PDF_SIZE) {
            return NextResponse.json(
                { error: `PDF file size exceeds maximum of ${MAX_PDF_SIZE / 1024 / 1024} MB` },
                { status: 400 }
            );
        }

        if (coverFile && coverFile.size > MAX_IMAGE_SIZE) {
            return NextResponse.json(
                { error: `Cover image size exceeds maximum of ${MAX_IMAGE_SIZE / 1024 / 1024} MB` },
                { status: 400 }
            );
        }

        // Validate file types
        if (pdfFile.type !== "application/pdf") {
            return NextResponse.json(
                { error: "Invalid file type. Only PDF files are allowed." },
                { status: 400 }
            );
        }

        if (coverFile && !coverFile.type.startsWith("image/")) {
            return NextResponse.json(
                { error: "Invalid cover image type. Only image files are allowed." },
                { status: 400 }
            );
        }

        const metadata = JSON.parse(metadataString);

        // Validate required fields
        if (!metadata.title || !metadata.author || !metadata.description) {
            return NextResponse.json(
                { error: "Title, author, and description are required" },
                { status: 400 }
            );
        }

        if (!metadata.categories || metadata.categories.length === 0) {
            return NextResponse.json(
                { error: "At least one category is required" },
                { status: 400 }
            );
        }

        await dbConnect();

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
        const book = await BookModel.create({
            title: metadata.title.trim(),
            author: metadata.author.trim(),
            description: metadata.description.trim(),
            pdfUrl: `/books/pdfs/${pdfFileName}`,
            coverImage: coverFileName ? `/images/books/covers/${coverFileName}` : undefined,
            fileSize,
            categories: metadata.categories,
            tags: metadata.tags || [],
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
        });

        const formattedBook = {
            id: book._id.toString(),
            title: book.title,
            author: book.author,
            description: book.description,
            pdfUrl: book.pdfUrl,
            coverImage: book.coverImage,
            fileSize: book.fileSize,
            categories: book.categories,
            tags: book.tags,
            createdAt: book.createdAt,
        };

        return NextResponse.json({
            success: true,
            message: "Book uploaded successfully",
            book: formattedBook,
        });

    } catch (error: any) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to upload book" },
            { status: 500 }
        );
    }
}
