import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Prayer from '@/models/Prayer';

// GET /api/prayers - Get user's prayers
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await dbConnect();

        const { searchParams } = new URL(request.url);
        const filter = searchParams.get('filter'); // 'all', 'active', 'answered'

        const query: any = { userId: (session.user as any).id };

        if (filter === 'active') {
            query.isAnswered = false;
        } else if (filter === 'answered') {
            query.isAnswered = true;
        }

        const prayers = await Prayer.find(query)
            .sort({ createdAt: -1 })
            .populate('userId', 'name email')
            .lean();

        // Format response
        const formattedPrayers = prayers.map((prayer: any) => ({
            id: prayer._id.toString(),
            title: prayer.title,
            description: prayer.description,
            category: prayer.category,
            isAnonymous: prayer.isAnonymous,
            isAnswered: prayer.isAnswered,
            answeredDate: prayer.answeredDate,
            prayerCount: prayer.prayerCount,
            date: formatDate(prayer.createdAt),
            createdAt: prayer.createdAt,
        }));

        return NextResponse.json({ prayers: formattedPrayers }, { status: 200 });
    } catch (error: any) {
        console.error('Get prayers error:', error);
        return NextResponse.json(
            { error: 'An error occurred while fetching prayers' },
            { status: 500 }
        );
    }
}

// POST /api/prayers - Create prayer request
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { title, description, category, isAnonymous } = await request.json();

        // Validation
        if (!title || !description) {
            return NextResponse.json(
                { error: 'Please provide title and description' },
                { status: 400 }
            );
        }

        if (title.length > 100) {
            return NextResponse.json(
                { error: 'Title cannot be more than 100 characters' },
                { status: 400 }
            );
        }

        if (description.length > 1000) {
            return NextResponse.json(
                { error: 'Description cannot be more than 1000 characters' },
                { status: 400 }
            );
        }

        await dbConnect();

        const prayer = await Prayer.create({
            userId: (session.user as any).id,
            title: title.trim(),
            description: description.trim(),
            category: category || 'general',
            isAnonymous: isAnonymous || false,
        });

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
            { message: 'Prayer request created successfully', prayer: formattedPrayer },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Create prayer error:', error);
        return NextResponse.json(
            { error: 'An error occurred while creating prayer request' },
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
