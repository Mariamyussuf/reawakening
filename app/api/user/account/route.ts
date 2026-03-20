import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth';
import { rateLimiters } from '@/lib/middleware/ratelimit';
import { validateBody } from '@/lib/validation';
import { DeleteAccountSchema } from '@/lib/validation/schemas';
import { ApiResponse } from '@/lib/api/response';
import { log } from '@/lib/logger';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// DELETE /api/user/account - Delete user account
export async function DELETE(request: NextRequest) {
    // Apply rate limiting (stricter for account deletion)
    const rateLimitResponse = await rateLimiters.auth(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    try {
        const session = await requireAuth();

        // Validate request body
        const validation = await validateBody(request, DeleteAccountSchema);
        if (!validation.success) {
            return validation.response;
        }

        const { password } = validation.data;

        await dbConnect();

        // Get user with password field
        const user = await User.findById(session.user.id).select('+password');

        if (!user) {
            return ApiResponse.error('User not found', 404);
        }

        // Verify password
        const bcrypt = await import('bcryptjs');
        const isPasswordValid = await bcrypt.default.compare(password, user.password);

        if (!isPasswordValid) {
            return ApiResponse.error('Incorrect password', 400);
        }

        // Delete user account
        await User.findByIdAndDelete(session.user.id);

        return ApiResponse.success(null, 'Account deleted successfully');
    } catch (error: any) {
        log.error('Delete account error', error, { endpoint: '/api/user/account' });
        return ApiResponse.internalError('An error occurred while deleting account');
    }
}
