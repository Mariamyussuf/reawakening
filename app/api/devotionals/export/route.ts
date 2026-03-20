import { NextRequest, NextResponse } from 'next/server';
import { rateLimiters } from '@/lib/middleware/ratelimit';
import { ApiResponse } from '@/lib/api/response';
import { log } from '@/lib/logger';
import prisma from '@/lib/prisma';
import { PDFGenerator } from '@/lib/pdf/generator';

// GET /api/devotionals/export - Export devotionals as PDF
export async function GET(request: NextRequest) {
    // Apply rate limiting
    const rateLimitResponse = await rateLimiters.api(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id'); // Export single devotional
        const limit = parseInt(searchParams.get('limit') || '50');
        const tag = searchParams.get('tag');

        let devotionals = [];

        if (id) {
            // Export single devotional
            const devotional = await prisma.devotional.findFirst({
                where: {
                    id: id,
                    status: 'PUBLISHED'
                }
            });

            if (!devotional) {
                return ApiResponse.error('Devotional not found', 404);
            }

            devotionals = [devotional];
        } else {
            // Export multiple devotionals
            const where: any = { status: 'PUBLISHED' };

            if (tag) {
                where.tags = { contains: tag };
            }

            devotionals = await prisma.devotional.findMany({
                where,
                orderBy: { publishDate: 'desc' },
                take: limit,
            });
        }

        // Parse tags for all
        const formattedDevotionals = devotionals.map(d => ({
            ...d,
            tags: d.tags ? JSON.parse(d.tags) : []
        }));

        if (formattedDevotionals.length === 0) {
            return ApiResponse.error('No devotionals found', 404);
        }

        const pdf = new PDFGenerator({
            title: id ? formattedDevotionals[0].title : 'Devotionals Export',
            author: 'Reawakening Ministry',
            subject: 'Devotionals Collection',
        });

        if (id) {
            // Single devotional
            const devotional = formattedDevotionals[0];
            pdf.addTitle(devotional.title, 20);
            pdf.addMetadata('Author', devotional.author);
            pdf.addMetadata('Published', new Date(devotional.publishDate).toLocaleDateString());

            if (devotional.scripture) {
                pdf.addSubheading('Scripture');
                pdf.addParagraph(devotional.scripture, 12);
            }

            if (devotional.tags && devotional.tags.length > 0) {
                pdf.addMetadata('Tags', devotional.tags.join(', '));
            }

            pdf.addDivider();
            pdf.addSubheading('Content');
            pdf.addParagraph(devotional.content);
        } else {
            // Multiple devotionals
            pdf.addTitle('Devotionals Collection');
            pdf.addMetadata('Generated', new Date().toLocaleString());
            pdf.addMetadata('Total Devotionals', formattedDevotionals.length.toString());
            if (tag) {
                pdf.addMetadata('Tag Filter', tag);
            }
            pdf.addDivider();

            formattedDevotionals.forEach((devotional: any, index: number) => {
                if (index > 0) {
                    pdf.addPageBreak();
                }

                pdf.addHeading(devotional.title, 16);
                pdf.addMetadata('Author', devotional.author);
                pdf.addMetadata('Published', new Date(devotional.publishDate).toLocaleDateString());

                if (devotional.scripture) {
                    pdf.addSubheading('Scripture');
                    pdf.addParagraph(devotional.scripture, 12);
                }

                if (devotional.tags && devotional.tags.length > 0) {
                    pdf.addMetadata('Tags', devotional.tags.join(', '));
                }

                pdf.addSubheading('Excerpt');
                pdf.addParagraph(devotional.excerpt);

                pdf.addSubheading('Content');
                pdf.addParagraph(devotional.content);

                if (index < formattedDevotionals.length - 1) {
                    pdf.addDivider();
                }
            });
        }


        const pdfBuffer = await pdf.generate();

        const filename = id
            ? `devotional-${id}.pdf`
            : `devotionals-export-${new Date().toISOString().split('T')[0]}.pdf`;

        return new NextResponse(new Uint8Array(pdfBuffer), {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${filename}"`,
            },
        });
    } catch (error: any) {
        log.error('Export devotionals error', error, { endpoint: '/api/devotionals/export' });
        return ApiResponse.internalError('An error occurred while exporting devotionals');
    }
}
