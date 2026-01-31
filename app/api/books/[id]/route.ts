import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import BookModel from '@/models/BookModel';

// GET /api/books/:id - Get single book
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const book = await BookModel.findById(params.id).lean();

        if (!book) {
            return NextResponse.json(
                { error: 'Book not found' },
                { status: 404 }
            );
        }

        // Format response
        const formattedBook = {
            id: book._id.toString(),
            title: book.title,
            author: book.author,
            description: book.description,
            coverImage: book.coverImage,
            pdfUrl: book.pdfUrl,
            fileSize: book.fileSize,
            pageCount: book.pageCount,
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
            averageRating: book.averageRating,
            createdAt: book.createdAt,
            updatedAt: book.updatedAt,
        };

        return NextResponse.json({ book: formattedBook }, { status: 200 });
    } catch (error: any) {
        console.error('Get book error:', error);
        return NextResponse.json(
            { error: 'An error occurred while fetching book' },
            { status: 500 }
        );
    }
}
