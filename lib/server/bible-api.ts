import 'server-only';

import {
    BIBLE_VERSIONS,
    FALLBACK_BOOK_CHAPTERS,
    type BibleVersion,
    type Book,
    type Chapter,
    type Verse,
} from '@/lib/bibleAPI';

const BIBLE_API_BASE = 'https://rest.api.bible/v1';
const INVALID_ENV_LITERALS = new Set(['', 'undefined', 'null']);

function normalizeEnvValue(value: string | undefined): string | undefined {
    const trimmedValue = value?.trim();

    if (!trimmedValue) {
        return undefined;
    }

    return INVALID_ENV_LITERALS.has(trimmedValue.toLowerCase()) ? undefined : trimmedValue;
}

function getBibleApiKey(): string | undefined {
    return (
        normalizeEnvValue(process.env.BIBLE_API_KEY) ??
        normalizeEnvValue(process.env.NEXT_PUBLIC_BIBLE_API_KEY)
    );
}

async function fetchBibleAPI(endpoint: string, version: BibleVersion = 'KJV') {
    const apiKey = getBibleApiKey();

    if (!apiKey) {
        throw new Error('BIBLE_API_KEY is missing.');
    }

    const versionId = BIBLE_VERSIONS[version];
    const url = `${BIBLE_API_BASE}/bibles/${versionId}${endpoint}`;

    const response = await fetch(url, {
        headers: {
            'api-key': apiKey,
        },
        cache: 'no-store',
    });

    if (!response.ok) {
        throw new Error(`Bible API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
}

function parseVerses(htmlContent: string): Verse[] {
    const verses: Verse[] = [];
    const verseRegex = /<span[^>]*class="v"[^>]*>(\d+)<\/span>([^<]*)/g;
    let match: RegExpExecArray | null;

    while ((match = verseRegex.exec(htmlContent)) !== null) {
        verses.push({
            id: `verse-${match[1]}`,
            reference: `Verse ${match[1]}`,
            text: match[2].trim(),
            verseNumber: parseInt(match[1], 10),
        });
    }

    return verses;
}

function stripHTML(html: string): string {
    return html.replace(/<[^>]*>/g, '').trim();
}

export async function getBibleBooks(version: BibleVersion = 'KJV'): Promise<Book[]> {
    const data = await fetchBibleAPI('/books', version);

    return data.data.map((book: any) => ({
        id: book.id,
        name: book.name,
        abbreviation: book.abbreviation,
        chapters:
            (Array.isArray(book.chapters) ? book.chapters.length : undefined) ??
            FALLBACK_BOOK_CHAPTERS[book.id] ??
            0,
    }));
}

export async function getBibleChapter(
    bookId: string,
    chapterNumber: number,
    version: BibleVersion = 'KJV'
): Promise<Chapter> {
    const chapterId = `${bookId}.${chapterNumber}`;
    const data = await fetchBibleAPI(`/chapters/${chapterId}`, version);

    return {
        id: data.data.id,
        reference: data.data.reference,
        content: data.data.content,
        verses: parseVerses(data.data.content),
        next: data.data.next,
        previous: data.data.previous,
    };
}

export async function searchBible(query: string, version: BibleVersion = 'KJV', limit: number = 10) {
    const data = await fetchBibleAPI(
        `/search?query=${encodeURIComponent(query)}&limit=${limit}`,
        version
    );

    return data.data.verses || [];
}

export async function getVerseOfTheDay(version: BibleVersion = 'KJV'): Promise<Verse | null> {
    const popularVerses = [
        'JHN.3.16',
        'PSA.23.1',
        'PRO.3.5-6',
        'ROM.8.28',
        'PHP.4.13',
        'JER.29.11',
        'ISA.40.31',
        'MAT.28.20',
        'PSA.46.1',
        '1CO.13.4-7',
    ];

    const dayOfYear = Math.floor(
        (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    const verseId = popularVerses[dayOfYear % popularVerses.length];
    const data = await fetchBibleAPI(`/verses/${verseId}`, version);

    return {
        id: data.data.id,
        reference: data.data.reference,
        text: stripHTML(data.data.content),
        verseNumber: 1,
    };
}
