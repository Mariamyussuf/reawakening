import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/middleware/auth';
import { rateLimiters } from '@/lib/middleware/ratelimit';
import { ApiResponse } from '@/lib/api/response';
import { log } from '@/lib/logger';
import prisma from '@/lib/prisma';
import { PDFGenerator } from '@/lib/pdf/generator';

export const dynamic = 'force-dynamic';

// GET /api/journal/export - Export journal entries as text, json, or PDF
export async function GET(request: NextRequest) {
    // Apply rate limiting
    const rateLimitResponse = await rateLimiters.api(request);
    if (rateLimitResponse) {
        return rateLimitResponse;
    }

    try {
        const session = await requireAuth();

        const { searchParams } = new URL(request.url);
        const format = searchParams.get('format') || 'text'; // 'text', 'json', or 'pdf'
        const category = searchParams.get('category');

        const where: any = { userId: session.user.id };

        if (category && category !== 'all') {
            where.category = category;
        }

        const entries = await prisma.journalEntry.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });

        const formattedEntries = entries.map(entry => ({
            id: entry.id,
            title: entry.title,
            content: entry.content,
            category: entry.category,
            mood: entry.mood,
            tags: entry.tags ? JSON.parse(entry.tags) : [],
            createdAt: entry.createdAt,
            updatedAt: entry.updatedAt,
        }));

        if (format === 'json') {
            return NextResponse.json(
                {
                    entries: formattedEntries,
                },
                {
                    status: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Disposition': 'attachment; filename="journal-export.json"',
                    },
                }
            );
        }

        if (format === 'pdf') {
            const pdf = new PDFGenerator({
                title: 'Prayer Journal Export',
                author: 'Reawakening Ministry',
                subject: 'Journal Entries Export',
            });

            pdf.addTitle('Prayer Journal Export');
            pdf.addMetadata('Generated', new Date().toLocaleString());
            pdf.addMetadata('Total Entries', entries.length.toString());
            if (category && category !== 'all') {
                pdf.addMetadata('Category', category);
            }
            pdf.addDivider();

            formattedEntries.forEach((entry: any, index: number) => {
                if (index > 0) {
                    pdf.addPageBreak();
                }

                pdf.addHeading(`Entry ${index + 1}`, 16);
                pdf.addMetadata('Date', new Date(entry.createdAt).toLocaleString());

                if (entry.title) {
                    pdf.addMetadata('Title', entry.title);
                }

                pdf.addMetadata('Category', entry.category);

                if (entry.mood) {
                    pdf.addMetadata('Mood', entry.mood);
                }

                if (entry.tags && entry.tags.length > 0) {
                    pdf.addMetadata('Tags', entry.tags.join(', '));
                }

                pdf.addSubheading('Content');
                pdf.addParagraph(entry.content);

                if (index < entries.length - 1) {
                    pdf.addDivider();
                }
            });

            const pdfBuffer = await pdf.generate();

            return new NextResponse(new Uint8Array(pdfBuffer), {
                status: 200,
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'attachment; filename="journal-export.pdf"',
                },
            });
        }

        // Format as text
        let textContent = `Prayer Journal Export\n`;
        textContent += `Generated: ${new Date().toLocaleString()}\n`;
        textContent += `Total Entries: ${entries.length}\n`;
        textContent += `\n${'='.repeat(50)}\n\n`;

        formattedEntries.forEach((entry: any, index: number) => {
            textContent += `Entry ${index + 1}\n`;
            textContent += `Date: ${new Date(entry.createdAt).toLocaleString()}\n`;
            if (entry.title) {
                textContent += `Title: ${entry.title}\n`;
            }
            textContent += `Category: ${entry.category}\n`;
            if (entry.mood) {
                textContent += `Mood: ${entry.mood}\n`;
            }
            if (entry.tags && entry.tags.length > 0) {
                textContent += `Tags: ${entry.tags.join(', ')}\n`;
            }
            textContent += `\n${entry.content}\n`;
            textContent += `\n${'-'.repeat(50)}\n\n`;
        });

        return new NextResponse(textContent, {
            status: 200,
            headers: {
                'Content-Type': 'text/plain',
                'Content-Disposition': 'attachment; filename="journal-export.txt"',
            },
        });
    } catch (error: any) {
        log.error('Export journal error', error, { endpoint: '/api/journal/export' });
        return ApiResponse.internalError('An error occurred while exporting journal');
    }
}
