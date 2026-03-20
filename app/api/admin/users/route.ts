import { NextRequest, NextResponse } from 'next/server';
import { requireAdminOrLeader } from '@/lib/middleware/auth';
import { rateLimiters } from '@/lib/middleware/ratelimit';
import { ApiResponse } from '@/lib/api/response';
import { log } from '@/lib/logger';
import prisma from '@/lib/prisma';

// GET /api/admin/users - Get all users
export async function GET(request: NextRequest) {
    // Apply rate limiting
    const rateLimitResponse = await rateLimiters.admin(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    try {
        await requireAdminOrLeader();

        const { searchParams } = new URL(request.url);
        const role = searchParams.get('role');
        const limit = parseInt(searchParams.get('limit') || '100');
        const skip = parseInt(searchParams.get('skip') || '0');

        const where: any = {};
        if (role && role !== 'all') {
            where.role = role.toUpperCase(); // Prisma usually uses uppercase Enums if defined as such, assuming 'USER', 'ADMIN', 'LEADER'
        }

        const users = await prisma.user.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: skip,
        });

        const total = await prisma.user.count({ where });

        const formattedUsers = users.map((user) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            joinDate: user.createdAt, // Map createdAt to joinDate if joinDate missing or same
            streak: user.streak,
            totalVerses: user.totalVerses,
            completedCourses: user.completedCourses,
            lastActive: user.lastActive,
            createdAt: user.createdAt,
        }));

        return ApiResponse.success({
            users: formattedUsers,
            total,
            limit,
            skip,
        });
    } catch (error: any) {
        log.error('Get users error', error, { endpoint: '/api/admin/users' });
        return ApiResponse.internalError('An error occurred while fetching users');
    }
}
