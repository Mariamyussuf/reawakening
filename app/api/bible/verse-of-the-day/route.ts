import { NextRequest, NextResponse } from 'next/server';

import { getVerseOfTheDay } from '@/lib/server/bible-api';
import type { BibleVersion } from '@/lib/bibleAPI';

export async function GET(request: NextRequest) {
    const version = (request.nextUrl.searchParams.get('version') as BibleVersion) || 'KJV';

    try {
        const verse = await getVerseOfTheDay(version);
        return NextResponse.json({ verse });
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || 'Failed to fetch the verse of the day.' },
            { status: 500 }
        );
    }
}
