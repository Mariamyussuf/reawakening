import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth';
import { rateLimiters } from '@/lib/middleware/ratelimit';
import { validateBody } from '@/lib/validation';
import { ChangePasswordSchema } from '@/lib/validation/schemas';
import { ApiResponse } from '@/lib/api/response';
import { log } from '@/lib/logger';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

// PUT /api/user/password - Change password
export async function PUT(request: NextRequest) {
    // Apply rate limiting (stricter for password changes)
    const rateLimitResponse = await rateLimiters.auth(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    try {
        const session = await requireAuth();

        // Validate request body
        const validation = await validateBody(request, ChangePasswordSchema);
        if (!validation.success) {
            return validation.response;
        }

        const { currentPassword, newPassword } = validation.data;
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        });

        if (!user) {
            return ApiResponse.error('User not found', 404);
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            return ApiResponse.error('Current password is incorrect', 400);
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        await prisma.user.update({
            where: { id: session.user.id },
            data: { password: hashedPassword },
        });

        return ApiResponse.success(null, 200, 'Password changed successfully');
    } catch (error: any) {
        log.error('Change password error', error, { endpoint: '/api/user/password' });
        return ApiResponse.internalError('An error occurred while changing password');
    }
}
