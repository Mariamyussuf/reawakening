import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// PUT /api/user/profile - Update user profile
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
        const allowedFields = ['name', 'phone', 'campus', 'bio', 'avatar'];

        // Filter to only allow specific fields
        const filteredUpdates: any = {};
        for (const field of allowedFields) {
            if (updates[field] !== undefined) {
                filteredUpdates[field] = updates[field];
            }
        }

        // Validation
        if (filteredUpdates.name && filteredUpdates.name.length > 60) {
            return NextResponse.json(
                { error: 'Name cannot be more than 60 characters' },
                { status: 400 }
            );
        }

        if (filteredUpdates.bio && filteredUpdates.bio.length > 500) {
            return NextResponse.json(
                { error: 'Bio cannot be more than 500 characters' },
                { status: 400 }
            );
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
                message: 'Profile updated successfully',
                user: {
                    id: user._id.toString(),
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    campus: user.campus,
                    bio: user.bio,
                    avatar: user.avatar,
                },
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Update profile error:', error);
        return NextResponse.json(
            { error: 'An error occurred while updating profile' },
            { status: 500 }
        );
    }
}
