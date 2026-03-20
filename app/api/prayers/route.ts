import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth';
import { rateLimiters } from '@/lib/middleware/ratelimit';
import { ApiResponse } from '@/lib/api/response';
import { log } from '@/lib/logger';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/prayers - Get user's prayers
export async function GET(request: NextRequest) {
    // Apply rate limiting
    const rateLimitResponse = await rateLimiters.api(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    try {
        const session = await requireAuth();

        const { searchParams } = new URL(request.url);
        const filter = searchParams.get('filter'); // 'all', 'active', 'answered'

        const where: any = { userId: session.user.id };

        if (filter === 'active') {
            where.isAnswered = false;
        } else if (filter === 'answered') {
            where.isAnswered = true;
        }

        const prayers = await prisma.prayer.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { name: true, email: true }
                }
            }
        });

        // Format response
        const formattedPrayers = prayers.map((prayer: any) => ({
            id: prayer.id,
            title: prayer.title,
            description: prayer.description,
            category: prayer.category,
            isAnonymous: prayer.isAnonymous,
            isAnswered: prayer.isAnswered,
            answeredDate: prayer.answeredDate,
            prayerCount: prayer.prayerCount,
            date: formatDate(prayer.createdAt),
            createdAt: prayer.createdAt,
        }));

        return NextResponse.json({ prayers: formattedPrayers }, { status: 200 });
    } catch (error: any) {
        log.error('Get prayers error', error, { endpoint: '/api/prayers' });
        return NextResponse.json(
            { error: 'An error occurred while fetching prayers' },
            { status: 500 }
        );
    }
}

// POST /api/prayers - Create prayer request
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { title, description, category, isAnonymous } = await request.json();

        // Validation
        if (!title || !description) {
            return NextResponse.json(
                { error: 'Please provide title and description' },
                { status: 400 }
            );
        }

        if (title.length > 100) {
            return NextResponse.json(
                { error: 'Title cannot be more than 100 characters' },
                { status: 400 }
            );
        }

        if (description.length > 1000) {
            return NextResponse.json(
                { error: 'Description cannot be more than 1000 characters' },
                { status: 400 }
            );
        }

        const prayer = await prisma.prayer.create({
            data: {
                userId: session.user.id,
                title: title.trim(),
                description: description.trim(),
                category: category || 'GENERAL',
                isAnonymous: isAnonymous || false,
                prayedBy: '[]',
            }
        });

        const formattedPrayer = {
            id: prayer.id,
            title: prayer.title,
            description: prayer.description,
            category: prayer.category,
            isAnonymous: prayer.isAnonymous,
            isAnswered: prayer.isAnswered,
            prayerCount: prayer.prayerCount,
            date: formatDate(prayer.createdAt),
            createdAt: prayer.createdAt,
        };

        return ApiResponse.created(formattedPrayer, 'Prayer request created successfully');
    } catch (error: any) {
        log.error('Create prayer error', error, { endpoint: '/api/prayers' });
        return ApiResponse.internalError('An error occurred while creating prayer request');
    }
}

// Helper function to format date
function formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
        return days === 1 ? '1 day ago' : `${days} days ago`;
    } else if (hours > 0) {
        return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    } else if (minutes > 0) {
        return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
    } else {
        return 'Just now';
    }
}
