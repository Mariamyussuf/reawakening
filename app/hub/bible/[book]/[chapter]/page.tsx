'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

import { bibleAPI, type BibleVersion, type Book, type Chapter } from '@/lib/bibleAPI';

export default function ChapterPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();

    const bookId = params.book as string;
    const chapterNum = parseInt(params.chapter as string, 10);
    const version = (searchParams.get('version') as BibleVersion) || 'KJV';

    const [chapter, setChapter] = useState<Chapter | null>(null);
    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);
    const [fontSize, setFontSize] = useState(16);
    const [showVerseNumbers, setShowVerseNumbers] = useState(true);
    const [bookmarks, setBookmarks] = useState<Map<string, string>>(new Map());
    const [bookmarking, setBookmarking] = useState<string | null>(null);
    const [actionMessage, setActionMessage] = useState('');

    useEffect(() => {
        void loadChapter();
        void loadBookmarks();
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

    const parseChapterTarget = (targetId?: string) => {
        if (!targetId) {
            return null;
        }

        const [targetBookId, targetChapter] = targetId.split('.');
        const parsedChapter = parseInt(targetChapter, 10);

        if (!targetBookId || Number.isNaN(parsedChapter)) {
            return null;
        }

        return {
            bookId: targetBookId,
            chapter: parsedChapter,
        };
    };

    const loadBookmarks = async () => {
        try {
            const response = await fetch(
                `/api/bible/bookmarks?bookId=${bookId}&chapter=${chapterNum}&version=${version}`
            );

            if (!response.ok) {
                return;
            }

            const data = await response.json();
            const bookmarkList = extractBookmarks(data);
            const bookmarkMap = new Map<string, string>();

            bookmarkList
                .filter((bookmark: any) => bookmark.verse)
                .forEach((bookmark: any) => {
                    bookmarkMap.set(`${bookmark.chapter}:${bookmark.verse}`, bookmark.id);
                });

            setBookmarks(bookmarkMap);
        } catch (error) {
            console.error('Error loading bookmarks:', error);
        }
    };

    const setTemporaryMessage = (message: string) => {
        setActionMessage(message);
        window.setTimeout(() => {
            setActionMessage((current) => (current === message ? '' : current));
        }, 2500);
    };

    const handleBookmark = async (verseNumber: number, verseText: string) => {
        const verseKey = `${chapterNum}:${verseNumber}`;
        const bookmarkId = bookmarks.get(verseKey);
        const isBookmarked = Boolean(bookmarkId);

        if (isBookmarked && bookmarkId) {
            setBookmarking(verseKey);

            try {
                const response = await fetch(`/api/bible/bookmarks/${bookmarkId}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setBookmarks((prev) => {
                        const nextBookmarks = new Map(prev);
                        nextBookmarks.delete(verseKey);
                        return nextBookmarks;
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

            return;
        }

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
    };

    const loadChapter = async () => {
        setLoading(true);

        try {
            const [chapterData, booksData] = await Promise.all([
                bibleAPI.getChapter(bookId, chapterNum, version),
                bibleAPI.getBooks(version),
            ]);

            setChapter(chapterData);
            setBook(booksData.find((entry) => entry.id === bookId) || null);
        } catch (error) {
            console.error('Error loading chapter:', error);
        } finally {
            setLoading(false);
        }
    };

    const navigateToTarget = (target: { bookId: string; chapter: number } | null) => {
        if (!target) {
            return;
        }

        router.push(`/hub/bible/${target.bookId}/${target.chapter}?version=${version}`);
    };

    const handleChapterBookmark = async () => {
        if (!chapter) {
            return;
        }

        const chapterKey = `${chapterNum}:chapter`;
        setBookmarking(chapterKey);

        try {
            const response = await fetch('/api/bible/bookmarks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    version,
                    bookId,
                    bookName: book?.name || bookId,
                    chapter: chapterNum,
                    reference: `${book?.name || bookId} ${chapterNum}`,
                    verseText: chapter.reference,
                    color: 'yellow',
                }),
            });

            if (response.ok) {
                setTemporaryMessage('Chapter bookmarked.');
            } else {
                const data = await response.json();
                setTemporaryMessage(data?.error || 'Could not bookmark chapter.');
            }
        } catch (error) {
            console.error('Error bookmarking chapter:', error);
            setTemporaryMessage('Could not bookmark chapter.');
        } finally {
            setBookmarking(null);
        }
    };

    const handleShare = async () => {
        const shareUrl = `${window.location.origin}/hub/bible/${bookId}/${chapterNum}?version=${version}`;
        const shareTitle = `${book?.name || bookId} ${chapterNum}`;

        try {
            if (navigator.share) {
                await navigator.share({
                    title: shareTitle,
                    text: `Read ${shareTitle} (${version}) on Reawakening.`,
                    url: shareUrl,
                });
                setTemporaryMessage('Chapter shared.');
                return;
            }

            await navigator.clipboard.writeText(shareUrl);
            setTemporaryMessage('Chapter link copied.');
        } catch (error) {
            console.error('Error sharing chapter:', error);
            setTemporaryMessage('Could not share chapter.');
        }
    };

    const previousTarget = parseChapterTarget(chapter?.previous?.id);
    const nextTarget = parseChapterTarget(chapter?.next?.id);

    return (
        <div className="min-h-screen bg-cream-50 text-navy-950">
            <div className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur-sm border-gray-200">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <Link
                            href={`/hub/bible?version=${version}`}
                            className="text-orange-600 hover:text-orange-700 font-medium"
                        >
                            {'<-'} Back to Books
                        </Link>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                                className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
                            >
                                A-
                            </button>
                            <button
                                onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                                className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
                            >
                                A+
                            </button>
                        </div>
                    </div>

                    {book && (
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => navigateToTarget(previousTarget)}
                                disabled={!previousTarget}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                    !previousTarget
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:scale-105'
                                }`}
                            >
                                {'<-'} Previous
                            </button>

                            <div className="text-center">
                                <h1
                                    className="text-2xl font-bold"
                                    style={{ fontFamily: 'Merriweather, serif' }}
                                >
                                    {book.name} {chapterNum}
                                </h1>
                                <p className="text-sm text-gray-600">
                                    {version} Translation
                                </p>
                            </div>

                            <button
                                onClick={() => navigateToTarget(nextTarget)}
                                disabled={!nextTarget}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                    !nextTarget
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:scale-105'
                                }`}
                            >
                                Next {'->'}
                            </button>
                        </div>
                    )}

                    <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-200">
                        <button
                            onClick={() => setShowVerseNumbers(!showVerseNumbers)}
                            className={`px-4 py-1 rounded ${
                                showVerseNumbers ? 'bg-orange-600 text-white' : 'bg-gray-100'
                            }`}
                        >
                            {showVerseNumbers ? 'Hide' : 'Show'} Verse Numbers
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-8">
                {actionMessage && (
                    <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-800">
                        {actionMessage}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-600 border-t-transparent" />
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
                        {chapter.verses.length > 0 ? (
                            <div className="space-y-4">
                                {chapter.verses.map((verse) => {
                                    const verseKey = `${chapterNum}:${verse.verseNumber}`;
                                    const isBookmarked = bookmarks.has(verseKey);

                                    return (
                                        <div key={verse.id} className="group relative">
                                            <p className="leading-relaxed">
                                                {showVerseNumbers && (
                                                    <sup className="text-orange-600 font-bold mr-2">
                                                        {verse.verseNumber}
                                                    </sup>
                                                )}
                                                <span>{verse.text}</span>
                                            </p>
                                            <button
                                                onClick={() =>
                                                    handleBookmark(verse.verseNumber, verse.text)
                                                }
                                                disabled={bookmarking === verseKey}
                                                className={`absolute -right-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded-lg ${
                                                    isBookmarked
                                                        ? 'text-yellow-500 opacity-100'
                                                        : 'text-gray-400 hover:text-yellow-500'
                                                }`}
                                                title={
                                                    isBookmarked
                                                        ? 'Remove bookmark'
                                                        : 'Bookmark this verse'
                                                }
                                            >
                                                {bookmarking === verseKey
                                                    ? '...'
                                                    : isBookmarked
                                                        ? '[saved]'
                                                        : '[save]'}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div dangerouslySetInnerHTML={{ __html: chapter.content }} />
                        )}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-red-600">Failed to load chapter. Please try again.</p>
                    </div>
                )}

                {chapter && (
                    <div className="mt-12 flex flex-wrap gap-4 justify-center">
                        <button
                            onClick={handleChapterBookmark}
                            disabled={bookmarking === `${chapterNum}:chapter`}
                            className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg hover:scale-105 transition-transform shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            Bookmark Chapter
                        </button>
                        <button
                            onClick={() => setTemporaryMessage('Chapter notes are coming soon.')}
                            className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg hover:scale-105 transition-transform shadow-lg"
                        >
                            Add Note Soon
                        </button>
                        <button
                            onClick={handleShare}
                            className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg hover:scale-105 transition-transform shadow-lg"
                        >
                            Share
                        </button>
                    </div>
                )}

                {book && (
                    <div className="mt-12 pt-8 border-t border-gray-200">
                        <div className="flex justify-between items-center gap-4">
                            <button
                                onClick={() => navigateToTarget(previousTarget)}
                                disabled={!previousTarget}
                                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                                    !previousTarget
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:scale-105'
                                }`}
                            >
                                {previousTarget
                                    ? `<- ${
                                          chapter?.previous?.reference ||
                                          `${book.name} ${previousTarget.chapter}`
                                      }`
                                    : '<- Previous'}
                            </button>

                            <Link
                                href={`/hub/bible?version=${version}`}
                                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-all"
                            >
                                All Books
                            </Link>

                            <button
                                onClick={() => navigateToTarget(nextTarget)}
                                disabled={!nextTarget}
                                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                                    !nextTarget
                                        ? 'opacity-50 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:scale-105'
                                }`}
                            >
                                {nextTarget
                                    ? `${
                                          chapter?.next?.reference ||
                                          `${book.name} ${nextTarget.chapter}`
                                      } ->`
                                    : 'Next ->'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
