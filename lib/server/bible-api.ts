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

const VERSE_MARKER_REGEX =
    /<(?:span|sup)\b[^>]*class="[^"]*\bv\b[^"]*"[^>]*>(\d+)<\/(?:span|sup)>/gi;
const FOOTNOTE_REGEXES = [
    /<sup\b[^>]*class="[^"]*\b(?:f|x)\b[^"]*"[^>]*>[\s\S]*?<\/sup>/gi,
    /<span\b[^>]*class="[^"]*\b(?:f|x|fr|fq|ft|fv|xo|xt)\b[^"]*"[^>]*>[\s\S]*?<\/span>/gi,
    /<div\b[^>]*class="[^"]*\b(?:footnotes?|crossrefs?)\b[^"]*"[^>]*>[\s\S]*?<\/div>/gi,
];
const HTML_ENTITY_MAP: Record<string, string> = {
    amp: '&',
    apos: "'",
    nbsp: ' ',
    quot: '"',
    lt: '<',
    gt: '>',
    ldquo: '"',
    rdquo: '"',
    lsquo: "'",
    rsquo: "'",
    mdash: '-',
    ndash: '-',
    hellip: '...',
};

function decodeHtmlEntities(text: string): string {
    return text
        .replace(/&#(\d+);/g, (_, codePoint: string) =>
            String.fromCodePoint(Number.parseInt(codePoint, 10))
        )
        .replace(/&#x([0-9a-f]+);/gi, (_, hexCodePoint: string) =>
            String.fromCodePoint(Number.parseInt(hexCodePoint, 16))
        )
        .replace(/&([a-z]+);/gi, (entity, name: string) => HTML_ENTITY_MAP[name.toLowerCase()] ?? entity);
}

function removeIgnoredHtml(html: string): string {
    return FOOTNOTE_REGEXES.reduce(
        (content, regex) => content.replace(regex, ' '),
        html
    );
}

function stripHTML(html: string): string {
    return decodeHtmlEntities(
        removeIgnoredHtml(html)
            .replace(/<br\s*\/?>/gi, ' ')
            .replace(/<\/p>/gi, ' ')
            .replace(/<[^>]*>/g, ' ')
            .replace(/\s+/g, ' ')
    ).trim();
}

function parseVerses(htmlContent: string): Verse[] {
    const verses: Verse[] = [];
    const verseMatches = Array.from(htmlContent.matchAll(VERSE_MARKER_REGEX));

    for (let index = 0; index < verseMatches.length; index += 1) {
        const match = verseMatches[index];
        const nextMatch = verseMatches[index + 1];
        const verseNumber = Number.parseInt(match[1], 10);
        const verseStart = (match.index ?? 0) + match[0].length;
        const verseEnd = nextMatch?.index ?? htmlContent.length;
        const verseHtml = htmlContent.slice(verseStart, verseEnd);
        const text = stripHTML(verseHtml);

        if (!text || Number.isNaN(verseNumber)) {
            continue;
        }

        verses.push({
            id: `verse-${verseNumber}`,
            reference: `Verse ${verseNumber}`,
            text,
            verseNumber,
        });
    }

    return verses;
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
