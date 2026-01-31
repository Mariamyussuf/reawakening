import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import BookModel from '@/models/BookModel';

// POST /api/books/:id/view - Increment view count
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();

        const book = await BookModel.findByIdAndUpdate(
            params.id,
            { $inc: { totalViews: 1 } },
            { new: true }
        );

        if (!book) {
            return NextResponse.json(
                { error: 'Book not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: 'View count updated', totalViews: book.totalViews },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Increment view error:', error);
        return NextResponse.json(
            { error: 'An error occurred while updating view count' },
            { status: 500 }
        );
    }
}
