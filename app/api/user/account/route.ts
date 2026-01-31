import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// DELETE /api/user/account - Delete user account
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { password } = await request.json();

        if (!password) {
            return NextResponse.json(
                { error: 'Please provide your password to confirm account deletion' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Get user with password field
        const user = await User.findById((session.user as any).id).select('+password');

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Verify password
        const bcrypt = await import('bcryptjs');
        const isPasswordValid = await bcrypt.default.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: 'Incorrect password' },
                { status: 400 }
            );
        }

        // Delete user account
        await User.findByIdAndDelete((session.user as any).id);

        return NextResponse.json(
            { message: 'Account deleted successfully' },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Delete account error:', error);
        return NextResponse.json(
            { error: 'An error occurred while deleting account' },
            { status: 500 }
        );
    }
}
