import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Prayer from '@/models/Prayer';
import User from '@/models/User';

// GET /api/prayers/community - Get community prayers (excluding user's own)
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

        const userId = (session.user as any).id;

        // Get community prayers (not anonymous, not user's own, optionally filter by answered)
        const prayers = await Prayer.find({
            userId: { $ne: userId },
            isAnonymous: false,
        })
            .sort({ createdAt: -1 })
            .limit(50)
            .populate('userId', 'name email')
            .lean();

        // Format response
        const formattedPrayers = prayers.map((prayer: any) => ({
            id: prayer._id.toString(),
            author: prayer.userId?.name || 'Anonymous',
            avatar: prayer.userId?.name?.charAt(0).toUpperCase() || 'A',
            title: prayer.title,
            description: prayer.description,
            category: prayer.category,
            prayerCount: prayer.prayerCount,
            date: formatDate(prayer.createdAt),
            createdAt: prayer.createdAt,
            hasPrayed: prayer.prayedBy?.some((id: any) => id.toString() === userId) || false,
        }));

        return NextResponse.json({ prayers: formattedPrayers }, { status: 200 });
    } catch (error: any) {
        console.error('Get community prayers error:', error);
        return NextResponse.json(
            { error: 'An error occurred while fetching community prayers' },
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
