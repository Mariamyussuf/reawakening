import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import BookModel from "@/models/BookModel";

// PUT /api/admin/books/:id - Update book
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Check authentication and admin role
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const userRole = (session.user as any).role;
        if (userRole !== "admin" && userRole !== "leader") {
            return NextResponse.json(
                { error: "Forbidden: Admin access required" },
                { status: 403 }
            );
        }

        const updates = await request.json();

        await dbConnect();

        const book = await BookModel.findByIdAndUpdate(
            params.id,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!book) {
            return NextResponse.json(
                { error: "Book not found" },
                { status: 404 }
            );
        }

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

        return NextResponse.json(
            { message: "Book updated successfully", book: formattedBook },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Update book error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to update book" },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/books/:id - Delete book
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Check authentication and admin role
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const userRole = (session.user as any).role;
        if (userRole !== "admin" && userRole !== "leader") {
            return NextResponse.json(
                { error: "Forbidden: Admin access required" },
                { status: 403 }
            );
        }

        await dbConnect();

        const book = await BookModel.findById(params.id);

        if (!book) {
            return NextResponse.json(
                { error: "Book not found" },
                { status: 404 }
            );
        }

        // TODO: Delete associated files (PDF and cover image) from filesystem
        // For now, we'll just delete from database
        // In production, you should also delete the files from storage

        await BookModel.findByIdAndDelete(params.id);

        return NextResponse.json(
            { message: "Book deleted successfully" },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Delete book error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to delete book" },
            { status: 500 }
        );
    }
}
