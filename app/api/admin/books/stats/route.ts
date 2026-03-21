import { NextRequest, NextResponse } from 'next/server';
import { requireAdminOrLeader } from '@/lib/middleware/auth';
import { rateLimiters } from '@/lib/middleware/ratelimit';
import { ApiResponse } from '@/lib/api/response';
import { log } from '@/lib/logger';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/admin/books/stats - Get book statistics
export async function GET(request: NextRequest) {
    // Apply rate limiting
    const rateLimitResponse = await rateLimiters.admin(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    try {
        await requireAdminOrLeader();

        // Get total counts
        const totalBooks = await prisma.book.count();
        const featuredBooks = await prisma.book.count({ where: { featured: true } });
        const popularBooks = await prisma.book.count({ where: { popular: true } });
        const newReleases = await prisma.book.count({ where: { newRelease: true } });

        // Get total views and downloads
        const aggregations = await prisma.book.aggregate({
            _sum: {
                totalViews: true,
                totalDownloads: true
            },
            _avg: {
                totalViews: true,
                totalDownloads: true
            }
        });

        // Get books by category (Manual aggregation required for SQLite JSON)
        // Fetch all categories
        const booksWithCategories = await prisma.book.findMany({
            select: { categories: true }
        });

        const categoryMap = new Map<string, number>();
        booksWithCategories.forEach(book => {
            try {
                const cats = book.categories ? JSON.parse(book.categories) : [];
                cats.forEach((cat: string) => {
                    categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
                });
            } catch (e) {
                // Ignore parsing errors
            }
        });

        const categoryStats = Array.from(categoryMap.entries())
            .map(([category, count]) => ({ _id: category, count }))
            .sort((a, b) => b.count - a.count);

        // Get top books by views
        const topViewed = await prisma.book.findMany({
            orderBy: { totalViews: 'desc' },
            take: 5,
            select: { title: true, totalViews: true }
        });

        // Get top books by downloads
        const topDownloaded = await prisma.book.findMany({
            orderBy: { totalDownloads: 'desc' },
            take: 5,
            select: { title: true, totalDownloads: true }
        });

        // Get books added this month
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        const booksThisMonth = await prisma.book.count({
            where: { createdAt: { gte: startOfMonth } }
        });

        // Get books added this week
        const startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - 7);
        const booksThisWeek = await prisma.book.count({
            where: { createdAt: { gte: startOfWeek } }
        });

        return ApiResponse.success({
            overview: {
                totalBooks,
                featuredBooks,
                popularBooks,
                newReleases,
                booksThisMonth,
                booksThisWeek,
            },
            engagement: {
                totalViews: aggregations._sum.totalViews || 0,
                totalDownloads: aggregations._sum.totalDownloads || 0,
                avgViews: Math.round(aggregations._avg.totalViews || 0),
                avgDownloads: Math.round(aggregations._avg.totalDownloads || 0),
            },
            categories: categoryStats.map((stat) => ({
                category: stat._id,
                count: stat.count,
            })),
            topViewed: topViewed.map((book) => ({
                title: book.title,
                views: book.totalViews,
            })),
            topDownloaded: topDownloaded.map((book) => ({
                title: book.title,
                downloads: book.totalDownloads,
            })),
        });
    } catch (error: any) {
        log.error('Get book stats error', error, { endpoint: '/api/admin/books/stats' });
        return ApiResponse.internalError('An error occurred while fetching statistics');
    }
}
