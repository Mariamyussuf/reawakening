'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { bibleAPI, type BibleVersion, type Book } from '@/lib/bibleAPI';

export default function BiblePage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [selectedVersion, setSelectedVersion] = useState<BibleVersion>('KJV');
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [activeTestament, setActiveTestament] = useState<'old' | 'new' | 'all'>('all');

    useEffect(() => {
        loadBooks();
    }, [selectedVersion]);

    const loadBooks = async () => {
        setLoading(true);
        try {
            const booksData = await bibleAPI.getBooks(selectedVersion);
            setBooks(booksData);
        } catch (error) {
            console.error('Error loading books:', error);
        } finally {
            setLoading(false);
        }
    };

    const oldTestamentBooks = books.slice(0, 39);
    const newTestamentBooks = books.slice(39);

    const displayBooks =
        activeTestament === 'old'
            ? oldTestamentBooks
            : activeTestament === 'new'
                ? newTestamentBooks
                : books;

    const filteredBooks = displayBooks.filter((book) =>
        book.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50/30 to-amber-50/40">
            {/* Floating Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-20 right-20 w-96 h-96 bg-orange-300/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-20 w-80 h-80 bg-amber-300/10 rounded-full blur-3xl"></div>
            </div>

            {/* Header */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-orange-100/50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-4xl font-bold text-slate-900 mb-2 flex items-center gap-3">
                                <span className="text-5xl">📖</span>
                                <span className="gradient-text">Bible Reader</span>
                            </h1>
                            <p className="text-slate-600 text-lg">Read God's Word in your preferred translation</p>
                        </div>
                        <Link
                            href="/hub"
                            className="btn-secondary group"
                        >
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Hub
                            </span>
                        </Link>
                    </div>

                    {/* Version Selector */}
                    <div className="flex flex-wrap gap-3 mb-4">
                        <label className="text-sm font-bold text-slate-700 flex items-center">
                            Translation:
                        </label>
                        {(['KJV', 'NIV', 'ESV', 'NLT', 'MSG'] as BibleVersion[]).map((version) => (
                            <button
                                key={version}
                                onClick={() => setSelectedVersion(version)}
                                className={`px-5 py-2.5 rounded-xl font-semibold transition-all ${selectedVersion === version
                                    ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg scale-105'
                                    : 'bg-white/90 text-slate-700 hover:bg-orange-50 border border-slate-200 hover:border-orange-300'
                                    }`}
                            >
                                {version}
                            </button>
                        ))}
                    </div>

                    {/* Search Bar */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search for a book..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="input-field pl-12"
                        />
                        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-2xl">🔍</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
                {/* Testament Tabs */}
                <div className="flex gap-3 mb-8">
                    <button
                        onClick={() => setActiveTestament('all')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all ${activeTestament === 'all'
                            ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg'
                            : 'bg-white/90 text-slate-700 hover:bg-orange-50 border border-slate-200'
                            }`}
                    >
                        All Books ({books.length})
                    </button>
                    <button
                        onClick={() => setActiveTestament('old')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all ${activeTestament === 'old'
                            ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg'
                            : 'bg-white/90 text-slate-700 hover:bg-orange-50 border border-slate-200'
                            }`}
                    >
                        Old Testament ({oldTestamentBooks.length})
                    </button>
                    <button
                        onClick={() => setActiveTestament('new')}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all ${activeTestament === 'new'
                            ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg'
                            : 'bg-white/90 text-slate-700 hover:bg-orange-50 border border-slate-200'
                            }`}
                    >
                        New Testament ({newTestamentBooks.length})
                    </button>
                </div>

                {/* Books Grid */}
                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-orange-600 border-t-transparent mb-4"></div>
                        <p className="text-slate-600 text-lg font-medium">Loading books...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {filteredBooks.map((book) => (
                            <Link
                                key={book.id}
                                href={`/hub/bible/${book.id}/1?version=${selectedVersion}`}
                                className="group card-glass hover:scale-105 cursor-pointer"
                            >
                                <div className="text-center">
                                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📕</div>
                                    <h3 className="font-bold text-slate-900 mb-1 group-hover:text-orange-600 transition-colors">
                                        {book.name}
                                    </h3>
                                    <p className="text-sm text-slate-500">{book.chapters} chapters</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                {filteredBooks.length === 0 && !loading && (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">📚</div>
                        <p className="text-slate-500 text-xl">No books found matching "{searchQuery}"</p>
                    </div>
                )}

                {/* Quick Access Section */}
                <div className="mt-16 card-premium">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                            <span className="text-4xl">⚡</span>
                            Quick Access
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Link
                                href="/hub/bible/search"
                                className="card-glass hover:scale-105 cursor-pointer group"
                            >
                                <div className="icon-container bg-gradient-to-br from-blue-500 to-indigo-600 mb-4 group-hover:scale-110 group-hover:rotate-3">
                                    <span className="text-3xl">🔍</span>
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2 text-xl">Search Bible</h3>
                                <p className="text-sm text-slate-600">Find verses and passages</p>
                            </Link>
                            <Link
                                href="/hub/bible/bookmarks"
                                className="card-glass hover:scale-105 cursor-pointer group"
                            >
                                <div className="icon-container bg-gradient-to-br from-purple-500 to-pink-600 mb-4 group-hover:scale-110 group-hover:rotate-3">
                                    <span className="text-3xl">🔖</span>
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2 text-xl">My Bookmarks</h3>
                                <p className="text-sm text-slate-600">Saved verses & highlights</p>
                            </Link>
                            <Link
                                href="/daily-verse"
                                className="card-glass hover:scale-105 cursor-pointer group"
                            >
                                <div className="icon-container bg-gradient-to-br from-orange-500 to-amber-600 mb-4 group-hover:scale-110 group-hover:rotate-3">
                                    <span className="text-3xl">✨</span>
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2 text-xl">Verse of the Day</h3>
                                <p className="text-sm text-slate-600">Today's inspiration</p>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Popular Books */}
                <div className="mt-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-8 flex items-center gap-3">
                        <span className="text-4xl">📚</span>
                        Popular Books
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                        {['PSA', 'PRO', 'JHN', 'ROM'].map((bookId) => {
                            const book = books.find((b) => b.id === bookId);
                            if (!book) return null;
                            return (
                                <Link
                                    key={book.id}
                                    href={`/hub/bible/${book.id}/1?version=${selectedVersion}`}
                                    className="relative overflow-hidden card-premium hover:scale-105 cursor-pointer group"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-600 to-amber-600 opacity-95"></div>
                                    <div className="relative z-10 text-white text-center py-4">
                                        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">⭐</div>
                                        <h3 className="font-bold mb-1 text-xl">{book.name}</h3>
                                        <p className="text-sm opacity-90">{book.chapters} chapters</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
