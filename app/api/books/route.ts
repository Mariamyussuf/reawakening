import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import BookModel from '@/models/BookModel';

// GET /api/books - Get all books with optional filters
export async function GET(request: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const featured = searchParams.get('featured') === 'true';
        const popular = searchParams.get('popular') === 'true';
        const newRelease = searchParams.get('newRelease') === 'true';
        const search = searchParams.get('search');
        const limit = parseInt(searchParams.get('limit') || '50');
        const skip = parseInt(searchParams.get('skip') || '0');
        const sortBy = searchParams.get('sortBy') || 'createdAt';
        const sortOrder = searchParams.get('sortOrder') || 'desc';

        const query: any = {};

        if (category) {
            query.categories = category;
        }

        if (featured) {
            query.featured = true;
        }

        if (popular) {
            query.popular = true;
        }

        if (newRelease) {
            query.newRelease = true;
        }

        if (search) {
            query.$text = { $search: search };
        }

        const sort: any = {};
        if (sortBy === 'views') {
            sort.totalViews = sortOrder === 'asc' ? 1 : -1;
        } else if (sortBy === 'downloads') {
            sort.totalDownloads = sortOrder === 'asc' ? 1 : -1;
        } else if (sortBy === 'rating') {
            sort.averageRating = sortOrder === 'asc' ? 1 : -1;
        } else {
            sort.createdAt = sortOrder === 'asc' ? 1 : -1;
        }

        const books = await BookModel.find(query)
            .sort(sort)
            .limit(limit)
            .skip(skip)
            .lean();

        const total = await BookModel.countDocuments(query);

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
                total,
                limit,
                skip,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Get books error:', error);
        return NextResponse.json(
            { error: 'An error occurred while fetching books' },
            { status: 500 }
        );
    }
}
