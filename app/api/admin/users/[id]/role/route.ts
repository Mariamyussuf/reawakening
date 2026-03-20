import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware/auth';
import { rateLimiters } from '@/lib/middleware/ratelimit';
import { validateBody } from '@/lib/validation';
import { UpdateUserRoleSchema } from '@/lib/validation/schemas';
import { ApiResponse } from '@/lib/api/response';
import { log } from '@/lib/logger';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

// PUT /api/admin/users/:id/role - Update user role
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    // Apply rate limiting
    const rateLimitResponse = await rateLimiters.admin(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    try {
        await requireAdmin();

        // Validate request body
        const validation = await validateBody(request, UpdateUserRoleSchema);
        if (!validation.success) {
            return validation.response;
        }

        const { role } = validation.data;

        // Prevent removing the last admin
        if (role !== 'admin') {
            await dbConnect();
            const currentUser = await User.findById(params.id);
            if (currentUser?.role === 'admin') {
                const adminCount = await User.countDocuments({ role: 'admin' });
                if (adminCount <= 1) {
                    return ApiResponse.error('Cannot remove the last admin user', 400);
                }
            }
        }

        await dbConnect();

        const user = await User.findByIdAndUpdate(
            params.id,
            { role },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return ApiResponse.error('User not found', 404);
        }

        return ApiResponse.success({
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                role: user.role,
            },
        }, 'User role updated successfully');
    } catch (error: any) {
        log.error('Update user role error', error, { endpoint: '/api/admin/users/[id]/role', userId: params.id });
        return ApiResponse.internalError('An error occurred while updating user role');
    }
}
