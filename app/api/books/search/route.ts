import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import BookModel from '@/models/BookModel';

// GET /api/books/search - Search books
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');
        const limit = parseInt(searchParams.get('limit') || '20');

        if (!query || query.trim().length === 0) {
            return NextResponse.json(
                { error: 'Please provide a search query' },
                { status: 400 }
            );
        }

        // Use text search if available, otherwise use regex
        const searchQuery = BookModel.find({
            $text: { $search: query },
        })
            .limit(limit)
            .lean();

        let books;
        try {
            books = await searchQuery;
        } catch (error) {
            // Fallback to regex search if text index is not available
            const regexQuery = new RegExp(query, 'i');
            books = await BookModel.find({
                $or: [
                    { title: regexQuery },
                    { author: regexQuery },
                    { description: regexQuery },
                    { tags: { $in: [regexQuery] } },
                ],
            })
                .limit(limit)
                .lean();
        }

        // Format response
        const formattedBooks = books.map((book: any) => ({
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
        }));

        return NextResponse.json(
            {
                books: formattedBooks,
                total: formattedBooks.length,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Search books error:', error);
        return NextResponse.json(
            { error: 'An error occurred while searching books' },
            { status: 500 }
        );
    }
}
