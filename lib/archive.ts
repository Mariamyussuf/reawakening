import prisma from '@/lib/prisma';
import { serializeConference, type SerializedConference } from '@/lib/conferences';

export interface ArchiveOverview {
    archivedConferences: number;
    publishedDevotionals: number;
    totalBooks: number;
    latestArchivedAt: string | null;
}

export async function getArchivedConferences(): Promise<SerializedConference[]> {
    try {
        const conferences = await prisma.conference.findMany({
            where: {
                status: 'ARCHIVED',
            },
            orderBy: [
                { startDate: 'desc' },
                { createdAt: 'desc' },
            ],
        });

        return conferences.map(serializeConference);
    } catch {
        return [];
    }
}

export async function getArchiveOverview(): Promise<ArchiveOverview> {
    try {
        const [archivedConferences, publishedDevotionals, totalBooks, latestArchivedConference] = await Promise.all([
            prisma.conference.count({ where: { status: 'ARCHIVED' } }),
            prisma.devotional.count({ where: { status: 'PUBLISHED' } }),
            prisma.book.count(),
            prisma.conference.findFirst({
                where: { status: 'ARCHIVED' },
                orderBy: [
                    { startDate: 'desc' },
                    { createdAt: 'desc' },
                ],
            }),
        ]);

        return {
            archivedConferences,
            publishedDevotionals,
            totalBooks,
            latestArchivedAt: latestArchivedConference?.updatedAt.toISOString() ?? null,
        };
    } catch {
        return {
            archivedConferences: 0,
            publishedDevotionals: 0,
            totalBooks: 0,
            latestArchivedAt: null,
        };
    }
}
