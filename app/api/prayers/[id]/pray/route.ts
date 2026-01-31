import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Prayer from '@/models/Prayer';

// POST /api/prayers/:id/pray - Increment prayer count (user prays for this request)
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

        const userId = (session.user as any).id;
        const prayer = await Prayer.findById(params.id);

        if (!prayer) {
            return NextResponse.json(
                { error: 'Prayer not found' },
                { status: 404 }
            );
        }

        // Check if user already prayed for this
        const hasPrayed = prayer.prayedBy.some(
            (id: any) => id.toString() === userId
        );

        if (hasPrayed) {
            // Remove prayer (unpray)
            prayer.prayedBy = prayer.prayedBy.filter(
                (id: any) => id.toString() !== userId
            );
            prayer.prayerCount = Math.max(0, prayer.prayerCount - 1);
        } else {
            // Add prayer
            prayer.prayedBy.push(userId);
            prayer.prayerCount += 1;
        }

        await prayer.save();

        return NextResponse.json(
            {
                message: hasPrayed ? 'Prayer removed' : 'Thank you for praying!',
                prayerCount: prayer.prayerCount,
                hasPrayed: !hasPrayed,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Pray for request error:', error);
        return NextResponse.json(
            { error: 'An error occurred while updating prayer count' },
            { status: 500 }
        );
    }
}
