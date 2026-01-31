import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// PUT /api/user/preferences - Update notification and privacy preferences
export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const updates = await request.json();
        const allowedFields = ['notifications', 'privacy'];

        // Filter to only allow specific fields
        const filteredUpdates: any = {};
        for (const field of allowedFields) {
            if (updates[field] !== undefined) {
                filteredUpdates[field] = updates[field];
            }
        }

        await dbConnect();

        const user = await User.findByIdAndUpdate(
            (session.user as any).id,
            { $set: filteredUpdates },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                message: 'Preferences updated successfully',
                preferences: {
                    notifications: user.notifications,
                    privacy: user.privacy,
                },
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Update preferences error:', error);
        return NextResponse.json(
            { error: 'An error occurred while updating preferences' },
            { status: 500 }
        );
    }
}
