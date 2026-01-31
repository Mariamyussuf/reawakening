import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import BookModel from '@/models/BookModel';

// POST /api/books/:id/download - Increment download count and return download URL
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await dbConnect();

        const book = await BookModel.findByIdAndUpdate(
            params.id,
            { $inc: { totalDownloads: 1 } },
            { new: true }
        );

        if (!book) {
            return NextResponse.json(
                { error: 'Book not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                message: 'Download count updated',
                totalDownloads: book.totalDownloads,
                pdfUrl: book.pdfUrl,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Increment download error:', error);
        return NextResponse.json(
            { error: 'An error occurred while updating download count' },
            { status: 500 }
        );
    }
}
