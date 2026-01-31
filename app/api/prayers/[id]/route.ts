import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Prayer from '@/models/Prayer';

// PUT /api/prayers/:id - Update prayer
export async function PUT(
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

        const { title, description, category } = await request.json();

        await dbConnect();

        const prayer = await Prayer.findById(params.id);

        if (!prayer) {
            return NextResponse.json(
                { error: 'Prayer not found' },
                { status: 404 }
            );
        }

        // Check if user owns this prayer
        if (prayer.userId.toString() !== (session.user as any).id) {
            return NextResponse.json(
                { error: 'Unauthorized to update this prayer' },
                { status: 403 }
            );
        }

        // Update fields
        if (title) prayer.title = title.trim();
        if (description) prayer.description = description.trim();
        if (category) prayer.category = category;

        await prayer.save();

        const formattedPrayer = {
            id: prayer._id.toString(),
            title: prayer.title,
            description: prayer.description,
            category: prayer.category,
            isAnonymous: prayer.isAnonymous,
            isAnswered: prayer.isAnswered,
            prayerCount: prayer.prayerCount,
            date: formatDate(prayer.createdAt),
            createdAt: prayer.createdAt,
        };

        return NextResponse.json(
            { message: 'Prayer updated successfully', prayer: formattedPrayer },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Update prayer error:', error);
        return NextResponse.json(
            { error: 'An error occurred while updating prayer' },
            { status: 500 }
        );
    }
}

// DELETE /api/prayers/:id - Delete prayer
export async function DELETE(
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

        const prayer = await Prayer.findById(params.id);

        if (!prayer) {
            return NextResponse.json(
                { error: 'Prayer not found' },
                { status: 404 }
            );
        }

        // Check if user owns this prayer
        if (prayer.userId.toString() !== (session.user as any).id) {
            return NextResponse.json(
                { error: 'Unauthorized to delete this prayer' },
                { status: 403 }
            );
        }

        await Prayer.findByIdAndDelete(params.id);

        return NextResponse.json(
            { message: 'Prayer deleted successfully' },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Delete prayer error:', error);
        return NextResponse.json(
            { error: 'An error occurred while deleting prayer' },
            { status: 500 }
        );
    }
}

// Helper function to format date
function formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return days === 1 ? '1 day ago' : `${days} days ago`;
    } else if (hours > 0) {
        return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    } else if (minutes > 0) {
        return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
    } else {
        return 'Just now';
    }
}
