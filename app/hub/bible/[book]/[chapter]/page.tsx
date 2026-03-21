'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { bibleAPI, type BibleVersion, type Chapter, type Book } from '@/lib/bibleAPI';

export default function ChapterPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();

    const bookId = params.book as string;
    const chapterNum = parseInt(params.chapter as string);
    const version = (searchParams.get('version') as BibleVersion) || 'KJV';

    const [chapter, setChapter] = useState<Chapter | null>(null);
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [fontSize, setFontSize] = useState(16);
    const [showVerseNumbers, setShowVerseNumbers] = useState(true);
    const [readingMode, setReadingMode] = useState<'light' | 'sepia' | 'dark'>('light');
    const [bookmarks, setBookmarks] = useState<Map<string, string>>(new Map()); // verseKey -> bookmarkId
    const [bookmarking, setBookmarking] = useState<string | null>(null);

    useEffect(() => {
        loadChapter();
        loadBookmarks();
    }, [bookId, chapterNum, version]);

    const extractBookmarks = (payload: any) => {
        if (Array.isArray(payload?.bookmarks)) {
            return payload.bookmarks;
        }

        if (Array.isArray(payload?.data?.bookmarks)) {
            return payload.data.bookmarks;
        }

        return [];
    };

    const extractBookmark = (payload: any) => {
        if (payload?.bookmark) {
            return payload.bookmark;
        }

        if (payload?.data) {
            return payload.data;
        }

        return null;
    };

    const loadBookmarks = async () => {
        try {
            const response = await fetch(`/api/bible/bookmarks?bookId=${bookId}&chapter=${chapterNum}&version=${version}`);
            if (response.ok) {
                const data = await response.json();
                const bookmarkList = extractBookmarks(data);
                const bookmarkMap = new Map<string, string>();
                bookmarkList
                    .filter((b: any) => b.verse)
                    .forEach((b: any) => {
                        bookmarkMap.set(`${b.chapter}:${b.verse}`, b.id);
                    });
                setBookmarks(bookmarkMap);
            }
        } catch (error) {
            console.error('Error loading bookmarks:', error);
        }
    };

    const handleBookmark = async (verseNumber: number, verseText: string) => {
        const verseKey = `${chapterNum}:${verseNumber}`;
        const bookmarkId = bookmarks.get(verseKey);
        const isBookmarked = !!bookmarkId;

        if (isBookmarked && bookmarkId) {
            // Remove bookmark
            setBookmarking(verseKey);
            try {
                const response = await fetch(`/api/bible/bookmarks/${bookmarkId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setBookmarks((prev) => {
                        const next = new Map(prev);
                        next.delete(verseKey);
                        return next;
                    });
                } else {
                    alert('Failed to remove bookmark');
                }
            } catch (error) {
                console.error('Error removing bookmark:', error);
                alert('Failed to remove bookmark');
            } finally {
                setBookmarking(null);
            }
        } else {
            // Create bookmark
            setBookmarking(verseKey);
            try {
                const response = await fetch('/api/bible/bookmarks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        version,
                        bookId,
                        bookName: book?.name || bookId,
                        chapter: chapterNum,
                        verse: verseNumber,
                        verseText: verseText.substring(0, 500),
                        reference: `${book?.name || bookId} ${chapterNum}:${verseNumber}`,
                        color: 'yellow',
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    const bookmark = extractBookmark(data);
                    if (bookmark?.id) {
                        setBookmarks((prev) => new Map([...prev, [verseKey, bookmark.id]]));
                    }
                } else {
                    const data = await response.json();
                    if (data.error && !data.error.includes('already exists')) {
                        alert(data.error);
                    }
                }
            } catch (error) {
                console.error('Error bookmarking verse:', error);
                alert('Failed to bookmark verse');
            } finally {
                setBookmarking(null);
            }
        }
    };

    const loadChapter = async () => {
        setLoading(true);
        try {
            const [chapterData, booksData] = await Promise.all([
                bibleAPI.getChapter(bookId, chapterNum, version),
                bibleAPI.getBooks(version),
            ]);
            setChapter(chapterData);
            const currentBook = booksData.find((b) => b.id === bookId);
            setBook(currentBook || null);
        } catch (error) {
            console.error('Error loading chapter:', error);
        } finally {
            setLoading(false);
        }
    };

    const goToChapter = (newChapter: number) => {
        router.push(`/hub/bible/${bookId}/${newChapter}?version=${version}`);
    };

    const modeStyles = {
        light: 'bg-white text-gray-900',
        sepia: 'bg-amber-50 text-amber-900',
        dark: 'bg-gray-900 text-gray-100',
    };

    return (
        <div className={`min-h-screen ${modeStyles[readingMode]}`}>
            {/* Header */}
            <div className={`sticky top-0 z-10 border-b ${readingMode === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white/95 backdrop-blur-sm border-gray-200'
                }`}>
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <Link
                            href={`/hub/bible?version=${version}`}
                            className="text-orange-600 hover:text-orange-700 font-medium"
                        >
                            ← Back to Books
                        </Link>
                        <div className="flex gap-2">
                            {/* Font Size Controls */}
                            <button
                                onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                                className={`px-3 py-1 rounded ${readingMode === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                                    }`}
                            >
                                A-
                            </button>
                            <button
                                onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                                className={`px-3 py-1 rounded ${readingMode === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                                    }`}
                            >
                                A+
                            </button>
                        </div>
                    </div>

                    {/* Chapter Navigation */}
                    {book && (
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => goToChapter(chapterNum - 1)}
                                disabled={chapterNum <= 1}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${chapterNum <= 1
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:scale-105'
                                    }`}
                            >
                                ← Previous
                            </button>

                            <div className="text-center">
                                <h1 className="text-2xl font-bold" style={{ fontFamily: 'Merriweather, serif' }}>
                                    {book.name} {chapterNum}
                                </h1>
                                <p className={`text-sm ${readingMode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                    {version} Translation
                                </p>
                            </div>

                            <button
                                onClick={() => goToChapter(chapterNum + 1)}
                                disabled={chapterNum >= book.chapters}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${chapterNum >= book.chapters
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:scale-105'
                                    }`}
                            >
                                Next →
                            </button>
                        </div>
                    )}

                    {/* Reading Options */}
                    <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-200">
                        {/* Reading Mode */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setReadingMode('light')}
                                className={`px-3 py-1 rounded ${readingMode === 'light' ? 'bg-white border-2 border-orange-600' : 'bg-gray-100'
                                    }`}
                                title="Light Mode"
                            >
                                ☀️
                            </button>
                            <button
                                onClick={() => setReadingMode('sepia')}
                                className={`px-3 py-1 rounded ${readingMode === 'sepia' ? 'bg-amber-50 border-2 border-orange-600' : 'bg-gray-100'
                                    }`}
                                title="Sepia Mode"
                            >
                                📜
                            </button>
                            <button
                                onClick={() => setReadingMode('dark')}
                                className={`px-3 py-1 rounded ${readingMode === 'dark' ? 'bg-gray-900 text-white border-2 border-orange-600' : 'bg-gray-100'
                                    }`}
                                title="Dark Mode"
                            >
                                🌙
                            </button>
                        </div>

                        {/* Verse Numbers Toggle */}
                        <button
                            onClick={() => setShowVerseNumbers(!showVerseNumbers)}
                            className={`px-4 py-1 rounded ${showVerseNumbers
                                ? 'bg-orange-600 text-white'
                                : readingMode === 'dark'
                                    ? 'bg-gray-700'
                                    : 'bg-gray-100'
                                }`}
                        >
                            {showVerseNumbers ? 'Hide' : 'Show'} Verse Numbers
                        </button>
                    </div>
                </div>
            </div>

            {/* Chapter Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-600 border-t-transparent"></div>
                        <p className="mt-4">Loading chapter...</p>
                    </div>
                ) : chapter ? (
                    <div
                        className="prose prose-lg max-w-none"
                        style={{
                            fontSize: `${fontSize}px`,
                            lineHeight: '1.8',
                            fontFamily: 'Georgia, serif',
                        }}
                    >
                        {/* Render verses */}
                        {chapter.verses.length > 0 ? (
                            <div className="space-y-4">
                                {chapter.verses.map((verse) => {
                                    const verseKey = `${chapterNum}:${verse.verseNumber}`;
                                    const isBookmarked = bookmarks.has(verseKey);
                                    return (
                                        <div key={verse.id} className="group relative">
                                            <p className="leading-relaxed">
                                                {showVerseNumbers && (
                                                    <sup className="text-orange-600 font-bold mr-2">{verse.verseNumber}</sup>
                                                )}
                                                <span>{verse.text}</span>
                                            </p>
                                            <button
                                                onClick={() => handleBookmark(verse.verseNumber, verse.text)}
                                                disabled={bookmarking === verseKey}
                                                className={`absolute -right-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg ${isBookmarked
                                                        ? 'text-yellow-500 opacity-100'
                                                        : 'text-gray-400 hover:text-yellow-500'
                                                    }`}
                                                title={isBookmarked ? 'Remove bookmark' : 'Bookmark this verse'}
                                            >
                                                {bookmarking === verseKey ? (
                                                    <span className="animate-spin">⏳</span>
                                                ) : isBookmarked ? (
                                                    '🔖'
                                                ) : (
                                                    '📖'
                                                )}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            // Fallback: render raw content if verses not parsed
                            <div dangerouslySetInnerHTML={{ __html: chapter.content }} />
                        )}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-red-600">Failed to load chapter. Please try again.</p>
                    </div>
                )}

                {/* Action Buttons */}
                {chapter && (
                    <div className="mt-12 flex flex-wrap gap-4 justify-center">
                        <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:scale-105 transition-transform shadow-lg">
                            🔖 Bookmark Chapter
                        </button>
                        <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:scale-105 transition-transform shadow-lg">
                            📝 Add Note
                        </button>
                        <button className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg hover:scale-105 transition-transform shadow-lg">
                            📤 Share
                        </button>
                    </div>
                )}

                {/* Chapter Navigation Footer */}
                {book && (
                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <div className="flex justify-between items-center">
                            <button
                                onClick={() => goToChapter(chapterNum - 1)}
                                disabled={chapterNum <= 1}
                                className={`px-6 py-3 rounded-lg font-medium transition-all ${chapterNum <= 1
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:scale-105'
                                    }`}
                            >
                                ← {book.name} {chapterNum - 1}
                            </button>

                            <Link
                                href={`/hub/bible?version=${version}`}
                                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-all"
                            >
                                📚 All Books
                            </Link>

                            <button
                                onClick={() => goToChapter(chapterNum + 1)}
                                disabled={chapterNum >= book.chapters}
                                className={`px-6 py-3 rounded-lg font-medium transition-all ${chapterNum >= book.chapters
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:scale-105'
                                    }`}
                            >
                                {book.name} {chapterNum + 1} →
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
