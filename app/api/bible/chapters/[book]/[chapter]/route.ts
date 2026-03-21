import { NextRequest, NextResponse } from 'next/server';

import { getBibleChapter } from '@/lib/server/bible-api';
import type { BibleVersion } from '@/lib/bibleAPI';

export async function GET(
    request: NextRequest,
    { params }: { params: { book: string; chapter: string } }
) {
    const version = (request.nextUrl.searchParams.get('version') as BibleVersion) || 'KJV';
    const chapterNumber = parseInt(params.chapter, 10);

    if (Number.isNaN(chapterNumber) || chapterNumber < 1) {
        return NextResponse.json({ error: 'Invalid chapter number.' }, { status: 400 });
    }

    try {
        const chapter = await getBibleChapter(params.book, chapterNumber, version);
        return NextResponse.json(chapter);
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || 'Failed to fetch Bible chapter.' },
            { status: 500 }
        );
    }
}
