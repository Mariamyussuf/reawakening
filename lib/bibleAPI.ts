// Bible API client service
// Client components should use this file instead of calling external APIs directly.

export const BIBLE_VERSIONS = {
    KJV: 'de4e12af7f28f599-02',
    NIV: '592420522e16049f-01',
    ESV: '65eec8e0b60e656b-01',
    NLT: '06125adad2d5898a-01',
    MSG: '9879dbb7cfe39e4d-04',
} as const;

export type BibleVersion = keyof typeof BIBLE_VERSIONS;

export interface Book {
    id: string;
    name: string;
    abbreviation: string;
    chapters: number;
}

export interface Verse {
    id: string;
    reference: string;
    text: string;
    verseNumber: number;
}

export interface Chapter {
    id: string;
    reference: string;
    content: string;
    verses: Verse[];
    next?: {
        id: string;
        reference: string;
    };
    previous?: {
        id: string;
        reference: string;
    };
}

export const FALLBACK_BOOKS: Book[] = [
    { id: 'GEN', name: 'Genesis', abbreviation: 'Gen', chapters: 50 },
    { id: 'EXO', name: 'Exodus', abbreviation: 'Exo', chapters: 40 },
    { id: 'LEV', name: 'Leviticus', abbreviation: 'Lev', chapters: 27 },
    { id: 'NUM', name: 'Numbers', abbreviation: 'Num', chapters: 36 },
    { id: 'DEU', name: 'Deuteronomy', abbreviation: 'Deu', chapters: 34 },
    { id: 'JOS', name: 'Joshua', abbreviation: 'Jos', chapters: 24 },
    { id: 'JDG', name: 'Judges', abbreviation: 'Jdg', chapters: 21 },
    { id: 'RUT', name: 'Ruth', abbreviation: 'Rut', chapters: 4 },
    { id: '1SA', name: '1 Samuel', abbreviation: '1Sa', chapters: 31 },
    { id: '2SA', name: '2 Samuel', abbreviation: '2Sa', chapters: 24 },
    { id: '1KI', name: '1 Kings', abbreviation: '1Ki', chapters: 22 },
    { id: '2KI', name: '2 Kings', abbreviation: '2Ki', chapters: 25 },
    { id: 'PSA', name: 'Psalms', abbreviation: 'Psa', chapters: 150 },
    { id: 'PRO', name: 'Proverbs', abbreviation: 'Pro', chapters: 31 },
    { id: 'ISA', name: 'Isaiah', abbreviation: 'Isa', chapters: 66 },
    { id: 'JER', name: 'Jeremiah', abbreviation: 'Jer', chapters: 52 },
    { id: 'MAT', name: 'Matthew', abbreviation: 'Mat', chapters: 28 },
    { id: 'MRK', name: 'Mark', abbreviation: 'Mrk', chapters: 16 },
    { id: 'LUK', name: 'Luke', abbreviation: 'Luk', chapters: 24 },
    { id: 'JHN', name: 'John', abbreviation: 'Jhn', chapters: 21 },
    { id: 'ACT', name: 'Acts', abbreviation: 'Act', chapters: 28 },
    { id: 'ROM', name: 'Romans', abbreviation: 'Rom', chapters: 16 },
    { id: '1CO', name: '1 Corinthians', abbreviation: '1Co', chapters: 16 },
    { id: '2CO', name: '2 Corinthians', abbreviation: '2Co', chapters: 13 },
    { id: 'GAL', name: 'Galatians', abbreviation: 'Gal', chapters: 6 },
    { id: 'EPH', name: 'Ephesians', abbreviation: 'Eph', chapters: 6 },
    { id: 'PHP', name: 'Philippians', abbreviation: 'Php', chapters: 4 },
    { id: 'COL', name: 'Colossians', abbreviation: 'Col', chapters: 4 },
    { id: '1TH', name: '1 Thessalonians', abbreviation: '1Th', chapters: 5 },
    { id: '2TH', name: '2 Thessalonians', abbreviation: '2Th', chapters: 3 },
    { id: '1TI', name: '1 Timothy', abbreviation: '1Ti', chapters: 6 },
    { id: '2TI', name: '2 Timothy', abbreviation: '2Ti', chapters: 4 },
    { id: 'TIT', name: 'Titus', abbreviation: 'Tit', chapters: 3 },
    { id: 'HEB', name: 'Hebrews', abbreviation: 'Heb', chapters: 13 },
    { id: 'JAS', name: 'James', abbreviation: 'Jas', chapters: 5 },
    { id: '1PE', name: '1 Peter', abbreviation: '1Pe', chapters: 5 },
    { id: '2PE', name: '2 Peter', abbreviation: '2Pe', chapters: 3 },
    { id: '1JN', name: '1 John', abbreviation: '1Jn', chapters: 5 },
    { id: '2JN', name: '2 John', abbreviation: '2Jn', chapters: 1 },
    { id: '3JN', name: '3 John', abbreviation: '3Jn', chapters: 1 },
    { id: 'JUD', name: 'Jude', abbreviation: 'Jud', chapters: 1 },
    { id: 'REV', name: 'Revelation', abbreviation: 'Rev', chapters: 22 },
];

export const FALLBACK_BOOK_CHAPTERS = Object.fromEntries(
    FALLBACK_BOOKS.map((book) => [book.id, book.chapters])
) as Record<string, number>;

class BibleAPIService {
    private async fetchJSON<T>(url: string): Promise<T> {
        const response = await fetch(url, {
            cache: 'no-store',
        });

        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(errorBody || `Bible API request failed with status ${response.status}`);
        }

        return response.json() as Promise<T>;
    }

    async getBooks(version: BibleVersion = 'KJV'): Promise<Book[]> {
        try {
            const data = await this.fetchJSON<{ books: Book[] }>(`/api/bible/books?version=${version}`);
            return data.books;
        } catch (error) {
            console.error('Error fetching books:', error);
            return this.getFallbackBooks();
        }
    }

    async getChapter(
        bookId: string,
        chapterNumber: number,
        version: BibleVersion = 'KJV'
    ): Promise<Chapter> {
        const params = new URLSearchParams({
            version,
        });

        return this.fetchJSON<Chapter>(
            `/api/bible/chapters/${encodeURIComponent(bookId)}/${chapterNumber}?${params.toString()}`
        );
    }

    async search(query: string, version: BibleVersion = 'KJV', limit: number = 10) {
        try {
            const params = new URLSearchParams({
                q: query,
                version,
                limit: String(limit),
            });
            const data = await this.fetchJSON<{ results: any[] }>(`/api/bible/search?${params.toString()}`);
            return data.results;
        } catch (error) {
            console.error('Error searching Bible:', error);
            return [];
        }
    }

    async getVerseOfTheDay(version: BibleVersion = 'KJV'): Promise<Verse | null> {
        try {
            const data = await this.fetchJSON<{ verse: Verse | null }>(
                `/api/bible/verse-of-the-day?version=${version}`
            );
            return data.verse;
        } catch (error) {
            console.error('Error fetching verse of the day:', error);
            return null;
        }
    }

    private getFallbackBooks(): Book[] {
        return FALLBACK_BOOKS;
    }
}

export const bibleAPI = new BibleAPIService();
