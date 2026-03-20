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
        <div className="min-h-screen bg-cream-50 pb-20">
            {/* Header / Search Section */}
            <div className="bg-navy-950 pt-16 pb-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-hero-pattern opacity-100" />
                <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 70% 30%, rgba(212,175,55,0.08) 0%, transparent 70%)" }} />
                
                <div className="container-custom relative z-10">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2.5 mb-6">
                                <div className="h-px w-6 bg-gold-400" />
                                <span className="font-sans text-[10px] font-bold tracking-[0.3em] uppercase text-gold-400">Library of Truth</span>
                            </div>
                            <h1 className="font-display text-5xl md:text-6xl font-semibold text-cream-50 leading-tight">
                                Bible Reader
                            </h1>
                            <p className="font-sans text-sm text-navy-300 mt-4 leading-relaxed italic">
                                &ldquo;Thy word is a lamp unto my feet, and a light unto my path.&rdquo;
                            </p>
                        </div>
                        
                        {/* Translation Selector */}
                        <div className="flex flex-wrap gap-1.5 p-1.5 bg-navy-900/60 backdrop-blur-md rounded-2xl border border-navy-800">
                            {(['KJV', 'NIV', 'ESV', 'NLT', 'MSG'] as BibleVersion[]).map((version) => (
                                <button
                                    key={version}
                                    onClick={() => setSelectedVersion(version)}
                                    className={`px-5 py-2 rounded-xl text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
                                        selectedVersion === version
                                            ? 'bg-gold-500 text-navy-950 shadow-glow-gold'
                                            : 'text-navy-400 hover:text-cream-50'
                                    }`}
                                >
                                    {version}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Search Field */}
                    <div className="relative group max-w-3xl translate-y-1/2 mt-[-24px]">
                        <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gold-500/60 group-focus-within:text-gold-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <input
                            type="text"
                            placeholder="Search for a book (e.g. Genesis, Romans)..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border-2 border-transparent focus:border-gold-500/30 rounded-2xl py-6 pl-14 pr-6 font-sans text-sm text-navy-900 shadow-premium focus:shadow-glow-gold outline-none transition-all placeholder:text-ink-300 placeholder:italic"
                        />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container-custom mt-24">
                
                {/* Testament Filter */}
                <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2">
                    {[
                        { id: 'all', label: 'All Scrolls', count: books.length },
                        { id: 'old', label: 'Old Testament', count: oldTestamentBooks.length },
                        { id: 'new', label: 'New Testament', count: newTestamentBooks.length }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTestament(tab.id as any)}
                            className={`px-6 py-2.5 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase whitespace-nowrap transition-all duration-300 border ${
                                activeTestament === tab.id
                                    ? 'bg-navy-950 text-gold-400 border-navy-950 shadow-md'
                                    : 'bg-white text-ink-400 border-cream-200 hover:border-gold-300'
                            }`}
                        >
                            {tab.label} <span className="opacity-40 ml-1">({tab.count})</span>
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-12 h-12 border-t-2 border-gold-500 border-solid rounded-full animate-spin mb-6" />
                        <p className="font-display text-xl text-navy-900">Unrolling the Scrolls...</p>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                            {filteredBooks.map((book) => (
                                <Link
                                    key={book.id}
                                    href={`/hub/bible/${book.id}/1?version=${selectedVersion}`}
                                    className="group bg-white p-6 rounded-2xl border border-cream-200 shadow-sm hover:shadow-card-hover hover:border-gold-300/60 hover:-translate-y-1 transition-all duration-300 text-center relative overflow-hidden"
                                >
                                    <div className="absolute top-0 right-0 w-12 h-12 bg-faint-gold/5 rounded-bl-[40px] transition-all group-hover:scale-150" />
                                    
                                    <div className="font-display text-2xl font-bold text-navy-900 group-hover:text-gold-600 transition-colors mb-1">
                                        {book.name}
                                    </div>
                                    <p className="font-sans text-[10px] font-semibold tracking-widest uppercase text-ink-300 group-hover:text-ink-500 transition-colors">
                                        {book.chapters} Chapters
                                    </p>
                                    
                                    <div className="mt-6 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-1.5 h-1.5 rounded-full bg-gold-400" />
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {filteredBooks.length === 0 && (
                            <div className="text-center py-32 bg-white rounded-3xl border border-dashed border-cream-300">
                                <div className="text-4xl mb-6 grayscale opacity-20">📜</div>
                                <h3 className="font-display text-2xl text-navy-950 mb-2">Book Not Found</h3>
                                <p className="font-sans text-sm text-ink-400 italic mb-8">No scrolls match your current search.</p>
                                <button onClick={() => setSearchQuery('')} className="text-gold-600 font-bold text-xs uppercase tracking-widest underline decoration-2 underline-offset-4">Clear Search</button>
                            </div>
                        )}
                    </>
                )}

                {/* Quick Utilities */}
                <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Link href="/hub/bible/search" className="card-navy p-8 rounded-3xl group relative overflow-hidden">
                        <div className="absolute inset-0 bg-hero-pattern opacity-100" />
                        <h3 className="font-display text-2xl font-semibold text-cream-50 relative z-10 mb-2">Verse Search</h3>
                        <p className="font-sans text-xs text-navy-400 relative z-10 mb-8 uppercase tracking-widest">Find specific passages</p>
                        <div className="flex items-center gap-2 text-gold-400 font-bold text-[10px] uppercase tracking-widest relative z-10 group-hover:gap-4 transition-all">
                            Open Console <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                        </div>
                    </Link>

                    <Link href="/hub/bible/bookmarks" className="card-glass bg-white p-8 rounded-3xl group border-cream-200 hover:border-gold-300">
                        <h3 className="font-display text-2xl font-semibold text-navy-950 mb-2 italic">Saved Verses</h3>
                        <p className="font-sans text-xs text-ink-400 mb-8 uppercase tracking-widest">Your personal collection</p>
                        <div className="flex items-center gap-2 text-gold-600 font-bold text-[10px] uppercase tracking-widest group-hover:gap-4 transition-all">
                            View Bookmarks <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                        </div>
                    </Link>

                    <Link href="/daily-verse" className="card-glass bg-white p-8 rounded-3xl group border-cream-200 hover:border-gold-300">
                        <h3 className="font-display text-2xl font-semibold text-navy-950 mb-2">Today's Bread</h3>
                        <p className="font-sans text-xs text-ink-400 mb-8 uppercase tracking-widest">Inspiration for now</p>
                        <div className="flex items-center gap-2 text-gold-600 font-bold text-[10px] uppercase tracking-widest group-hover:gap-4 transition-all">
                            Read Today's Verse <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
