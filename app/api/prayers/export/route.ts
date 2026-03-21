import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth';
import { rateLimiters } from '@/lib/middleware/ratelimit';
import { ApiResponse } from '@/lib/api/response';
import { log } from '@/lib/logger';
import prisma from '@/lib/prisma';
import { PDFGenerator } from '@/lib/pdf/generator';

export const dynamic = 'force-dynamic';

// GET /api/prayers/export - Export prayers as PDF
export async function GET(request: NextRequest) {
    // Apply rate limiting (stricter for exports)
    const rateLimitResponse = await rateLimiters.api(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    try {
        const session = await requireAuth();

        const { searchParams } = new URL(request.url);
        const filter = searchParams.get('filter'); // 'all', 'active', 'answered'
        const category = searchParams.get('category');

        const where: any = { userId: session.user.id };

        if (filter === 'active') {
            where.isAnswered = false;
        } else if (filter === 'answered') {
            where.isAnswered = true;
        }

        if (category && category !== 'all') {
            where.category = category;
        }

        const prayers = await prisma.prayer.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });

        if (prayers.length === 0) {
            return ApiResponse.error('No prayers found', 404);
        }

        const pdf = new PDFGenerator({
            title: 'Prayer Requests Export',
            author: 'Reawakening Ministry',
            subject: 'Prayer Requests',
        });

        pdf.addTitle('Prayer Requests');
        pdf.addMetadata('Generated', new Date().toLocaleString());
        pdf.addMetadata('Total Prayers', prayers.length.toString());

        if (filter && filter !== 'all') {
            pdf.addMetadata('Filter', filter);
        }

        if (category && category !== 'all') {
            pdf.addMetadata('Category', category);
        }

        pdf.addDivider();

        const answeredPrayers = prayers.filter((p: any) => p.isAnswered);
        const activePrayers = prayers.filter((p: any) => !p.isAnswered);

        if (activePrayers.length > 0) {
            pdf.addHeading('Active Prayer Requests', 16);
            activePrayers.forEach((prayer: any, index: number) => {
                if (index > 0) {
                    pdf.addDivider();
                }

                pdf.addSubheading(prayer.title);
                pdf.addMetadata('Category', prayer.category || 'general');
                pdf.addMetadata('Date', new Date(prayer.createdAt).toLocaleDateString());
                pdf.addMetadata('Prayer Count', prayer.prayerCount.toString());
                pdf.addParagraph(prayer.description);
            });
        }

        if (answeredPrayers.length > 0) {
            if (activePrayers.length > 0) {
                pdf.addPageBreak();
            }
            pdf.addHeading('Answered Prayers', 16);
            answeredPrayers.forEach((prayer: any, index: number) => {
                if (index > 0) {
                    pdf.addDivider();
                }

                pdf.addSubheading(prayer.title);
                pdf.addMetadata('Category', prayer.category || 'general');
                pdf.addMetadata('Date', new Date(prayer.createdAt).toLocaleDateString());
                if (prayer.answeredDate) {
                    pdf.addMetadata('Answered', new Date(prayer.answeredDate).toLocaleDateString());
                }
                pdf.addMetadata('Prayer Count', prayer.prayerCount.toString());
                pdf.addParagraph(prayer.description);
            });
        }

        const pdfBuffer = await pdf.generate();

        const filename = `prayers-export-${new Date().toISOString().split('T')[0]}.pdf`;

        return new NextResponse(new Uint8Array(pdfBuffer), {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        });
    } catch (error: any) {
        log.error('Export prayers error', error, { endpoint: '/api/prayers/export' });
        return ApiResponse.internalError('An error occurred while exporting prayers');
    }
}
