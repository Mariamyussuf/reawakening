import { NextRequest, NextResponse } from 'next/server';

import { getVerseOfTheDay } from '@/lib/server/bible-api';
import type { BibleVersion } from '@/lib/bibleAPI';
import { getDailyVerseDateLabel, getDailyVerseRotationItem } from '@/lib/daily-verses';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    const version = (request.nextUrl.searchParams.get('version') as BibleVersion) || 'KJV';
    const rotation = getDailyVerseRotationItem();
    const dateLabel = getDailyVerseDateLabel();

    try {
        const verse = await getVerseOfTheDay(version);
        return NextResponse.json({
            verse,
            dateLabel,
            version,
            rotation,
        });
    } catch (error: any) {
        return NextResponse.json(
            {
                verse: null,
                dateLabel,
                version,
                rotation,
                error: error?.message || 'Failed to fetch the verse of the day.',
            },
            { status: 200 }
        );
    }
}
