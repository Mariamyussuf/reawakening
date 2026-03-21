import { NextRequest, NextResponse } from 'next/server';

import { getBibleBooks } from '@/lib/server/bible-api';
import type { BibleVersion } from '@/lib/bibleAPI';

export async function GET(request: NextRequest) {
    const version = (request.nextUrl.searchParams.get('version') as BibleVersion) || 'KJV';

    try {
        const books = await getBibleBooks(version);
        return NextResponse.json({ books });
    } catch (error: any) {
        return NextResponse.json(
            { error: error?.message || 'Failed to fetch Bible books.' },
            { status: 500 }
        );
    }
}
