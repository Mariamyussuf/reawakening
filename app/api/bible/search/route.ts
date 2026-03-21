import { NextRequest, NextResponse } from 'next/server';

import { searchBible } from '@/lib/server/bible-api';
import type { BibleVersion } from '@/lib/bibleAPI';

export async function GET(request: NextRequest) {
    const query = request.nextUrl.searchParams.get('q')?.trim() || '';
    const version = (request.nextUrl.searchParams.get('version') as BibleVersion) || 'KJV';
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10', 10);

    if (!query) {
        return NextResponse.json({ results: [] });
    }

    try {
        const results = await searchBible(query, version, Number.isNaN(limit) ? 10 : limit);
        return NextResponse.json({ results });
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || 'Failed to search the Bible.' },
            { status: 500 }
        );
    }
}
