// Bible API Service
// Handles all Bible API interactions

import { env } from '@/lib/env';

const BIBLE_API_BASE = 'https://api.scripture.api.bible/v1';
const API_KEY = env.BIBLE_API_KEY || '';

// Bible translation IDs from API.Bible
export const BIBLE_VERSIONS = {
    KJV: 'de4e12af7f28f599-02', // King James Version
    NIV: '592420522e16049f-01', // New International Version
    ESV: '65eec8e0b60e656b-01', // English Standard Version
    NLT: '06125adad2d5898a-01', // New Living Translation
    MSG: '9879dbb7cfe39e4d-04', // The Message
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

class BibleAPIService {
    private apiKey: string;

    constructor() {
        this.apiKey = API_KEY;
    }

    private async fetchAPI(endpoint: string, version: BibleVersion = 'KJV') {
        const versionId = BIBLE_VERSIONS[version];
        const url = `${BIBLE_API_BASE}/bibles/${versionId}${endpoint}`;

        const response = await fetch(url, {
            headers: {
                'api-key': this.apiKey,
            },
        });

        if (!response.ok) {
            throw new Error(`Bible API error: ${response.statusText}`);
        }

        return response.json();
    }

    // Get all books in the Bible
    async getBooks(version: BibleVersion = 'KJV'): Promise<Book[]> {
        try {
            const data = await this.fetchAPI('/books', version);
            return data.data.map((book: any) => ({
                id: book.id,
                name: book.name,
                abbreviation: book.abbreviation,
                chapters: book.chapters?.length || 0,
            }));
        } catch (error) {
            console.error('Error fetching books:', error);
            return this.getFallbackBooks();
        }
    }

    // Get a specific chapter
    async getChapter(
        bookId: string,
        chapterNumber: number,
        version: BibleVersion = 'KJV'
    ): Promise<Chapter> {
        try {
            const chapterId = `${bookId}.${chapterNumber}`;
            const data = await this.fetchAPI(`/chapters/${chapterId}`, version);

            return {
                id: data.data.id,
                reference: data.data.reference,
                content: data.data.content,
                verses: this.parseVerses(data.data.content),
                next: data.data.next,
                previous: data.data.previous,
            };
        } catch (error) {
            console.error('Error fetching chapter:', error);
            throw error;
        }
    }

    // Search the Bible
    async search(query: string, version: BibleVersion = 'KJV', limit: number = 10) {
        try {
            const data = await this.fetchAPI(
                `/search?query=${encodeURIComponent(query)}&limit=${limit}`,
                version
            );
            return data.data.verses || [];
        } catch (error) {
            console.error('Error searching Bible:', error);
            return [];
        }
    }

    // Get verse of the day (using a simple algorithm)
    async getVerseOfTheDay(version: BibleVersion = 'KJV'): Promise<Verse | null> {
        // Popular verses for VOTD rotation
        const popularVerses = [
            'JHN.3.16', // John 3:16
            'PSA.23.1', // Psalm 23:1
            'PRO.3.5-6', // Proverbs 3:5-6
            'ROM.8.28', // Romans 8:28
            'PHP.4.13', // Philippians 4:13
            'JER.29.11', // Jeremiah 29:11
            'ISA.40.31', // Isaiah 40:31
            'MAT.28.20', // Matthew 28:20
            'PSA.46.1', // Psalm 46:1
            '1CO.13.4-7', // 1 Corinthians 13:4-7
        ];

        // Use day of year to rotate through verses
        const dayOfYear = Math.floor(
            (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
        );
        const verseIndex = dayOfYear % popularVerses.length;
        const verseId = popularVerses[verseIndex];

        try {
            const data = await this.fetchAPI(`/verses/${verseId}`, version);
            return {
                id: data.data.id,
                reference: data.data.reference,
                text: this.stripHTML(data.data.content),
                verseNumber: 1,
            };
        } catch (error) {
            console.error('Error fetching verse of the day:', error);
            return null;
        }
    }

    // Helper: Parse verses from HTML content
    private parseVerses(htmlContent: string): Verse[] {
        // This is a simplified parser - in production, use a proper HTML parser
        const verses: Verse[] = [];
        const verseRegex = /<span[^>]*class="v"[^>]*>(\d+)<\/span>([^<]*)/g;
        let match;

        while ((match = verseRegex.exec(htmlContent)) !== null) {
            verses.push({
                id: `verse-${match[1]}`,
                reference: `Verse ${match[1]}`,
                text: match[2].trim(),
                verseNumber: parseInt(match[1]),
            });
        }

        return verses;
    }

    // Helper: Strip HTML tags
    private stripHTML(html: string): string {
        return html.replace(/<[^>]*>/g, '').trim();
    }

    // Fallback books list (in case API fails)
    private getFallbackBooks(): Book[] {
        return [
            // Old Testament
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
            // New Testament
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
    }
}

export const bibleAPI = new BibleAPIService();
