import { NextRequest } from 'next/server';

import { GET as getBooks } from '@/app/api/books/route';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    return getBooks(request);
}
