import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import JournalEntry from '@/models/JournalEntry';
import mongoose from 'mongoose';

// GET /api/journal/stats - Get journal statistics
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

        // Get total entries
        const totalEntries = await JournalEntry.countDocuments({ userId });

        // Get entries this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const thisMonth = await JournalEntry.countDocuments({
            userId,
            createdAt: { $gte: startOfMonth },
        });

        // Get answered prayers (entries with category 'answered')
        const answered = await JournalEntry.countDocuments({
            userId,
            category: 'answered',
        });

        // Calculate current streak
        const streak = await calculateStreak(userId);

        // Get entries by category
        const categoryStats = await JournalEntry.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(userId) } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
            { $sort: { count: -1 } },
        ]);

        return NextResponse.json(
            {
                totalEntries,
                thisMonth,
                answered,
                streak,
                categoryStats: categoryStats.map((stat) => ({
                    category: stat._id,
                    count: stat.count,
                })),
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Get journal stats error:', error);
        return NextResponse.json(
            { error: 'An error occurred while fetching journal statistics' },
            { status: 500 }
        );
    }
}

// Helper function to calculate streak
async function calculateStreak(userId: string): Promise<number> {
    const entries = await JournalEntry.find({ userId })
        .sort({ createdAt: -1 })
        .select('createdAt')
        .lean();

    if (entries.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    for (const entry of entries) {
        const entryDate = new Date(entry.createdAt);
        entryDate.setHours(0, 0, 0, 0);

        const diffDays = Math.floor(
            (currentDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays === streak) {
            streak++;
            currentDate.setDate(currentDate.getDate() - 1);
        } else if (diffDays > streak) {
            break;
        }
    }

    return streak;
}
