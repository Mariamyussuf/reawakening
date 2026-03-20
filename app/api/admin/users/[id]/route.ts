import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/middleware/auth';
import { rateLimiters } from '@/lib/middleware/ratelimit';
import { ApiResponse } from '@/lib/api/response';
import { log } from '@/lib/logger';
import prisma from '@/lib/prisma';

// DELETE /api/admin/users/:id - Delete user
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    // Apply rate limiting
    const rateLimitResponse = await rateLimiters.admin(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    try {
        const session = await requireAdmin();

        // Prevent deleting yourself
        if (params.id === session.user.id) {
            return ApiResponse.error('You cannot delete your own account', 400);
        }

        const user = await prisma.user.findUnique({
            where: { id: params.id }
        });

        if (!user) {
            return ApiResponse.error('User not found', 404);
        }

        // Prevent deleting the last admin
        // Assuming role is stored as 'ADMIN' in Prisma if it was 'admin' in Mongo, or consistently lower/upper.
        // I used 'admin' (lowercase) in auth.ts callback, so I'll stick to 'admin' or check usage.
        // In api/admin/users/route.ts I used .toUpperCase().
        // Let's check schema/previous code. 
        // In lib/auth.ts: `role: user.role` (which comes from DB).
        // If I used Enums, it's usually uppercase. If String, it's whatever.
        // I'll use case-insensitive check or just string match if I can't be sure.
        // But for count, I need exact match.
        // Based on `api/admin/users/route.ts`, I used `role.toUpperCase()`.
        // I will assume uppercase 'ADMIN'.

        const role = user.role.toUpperCase(); // Normalize
        if (role === 'ADMIN') {
            const adminCount = await prisma.user.count({
                where: { role: 'ADMIN' } // Assuming Enum match or string match
            });
            // Fallback if role is lowercase strings in DB
            const adminCountLower = await prisma.user.count({
                where: { role: 'admin' }
            });

            if ((adminCount + adminCountLower) <= 1) {
                return ApiResponse.error('Cannot delete the last admin user', 400);
            }
        }

        await prisma.user.delete({
            where: { id: params.id }
        });

        return ApiResponse.success(null, 200, 'User deleted successfully');
    } catch (error: any) {
        log.error('Delete user error', error, { endpoint: '/api/admin/users/[id]', userId: params.id });
        return ApiResponse.internalError('An error occurred while deleting user');
    }
}
