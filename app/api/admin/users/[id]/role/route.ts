import { NextRequest } from 'next/server';
import { requireAdmin } from '@/lib/middleware/auth';
import { rateLimiters } from '@/lib/middleware/ratelimit';
import { validateBody } from '@/lib/validation';
import { UpdateUserRoleSchema } from '@/lib/validation/schemas';
import { ApiResponse } from '@/lib/api/response';
import { log } from '@/lib/logger';
import prisma from '@/lib/prisma';

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
        const normalizedRole = role.toUpperCase();
        const currentUser = await prisma.user.findUnique({
            where: { id: params.id },
        });

        if (!currentUser) {
            return ApiResponse.error('User not found', 404);
        }

        // Prevent removing the last admin
        if (normalizedRole !== 'ADMIN') {
            if (currentUser.role.toUpperCase() === 'ADMIN') {
                const adminCount = await prisma.user.count({
                    where: { role: 'ADMIN' },
                });
                if (adminCount <= 1) {
                    return ApiResponse.error('Cannot remove the last admin user', 400);
                }
            }
        }

        const user = await prisma.user.update({
            where: { id: params.id },
            data: { role: normalizedRole },
        });

        if (!user) {
            return ApiResponse.error('User not found', 404);
        }

        return ApiResponse.success({
            user: {
                id: user.id,
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
