'use client';

import { useState } from 'react';
import Link from 'next/link';
import { bibleAPI, type BibleVersion } from '@/lib/bibleAPI';

export default function BibleSearchPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedVersion, setSelectedVersion] = useState<BibleVersion>('KJV');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setLoading(true);
        setSearched(true);
        try {
            const searchResults = await bibleAPI.search(searchQuery, selectedVersion, 20);
            setResults(searchResults);
        } catch (error) {
            console.error('Search error:', error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Merriweather, serif' }}>
                            Search the Bible
                        </h1>
                        <Link
                            href="/hub/bible"
                            className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg hover:scale-105 transition-transform"
                        >
                            Back
                        </Link>
                    </div>

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="space-y-4">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search for verses, topics, or keywords..."
                                className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg hover:scale-105 transition-transform disabled:opacity-50"
                            >
                                {loading ? 'Searching...' : 'Search'}
                            </button>
                        </div>

                        {/* Version Selector */}
                        <div className="flex flex-wrap gap-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center">
                                Translation:
                            </label>
                            {(['KJV', 'NIV', 'ESV', 'NLT', 'MSG'] as BibleVersion[]).map((version) => (
                                <button
                                    key={version}
                                    type="button"
                                    onClick={() => setSelectedVersion(version)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedVersion === version
                                        ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg'
                                        : 'bg-white text-gray-700 hover:bg-orange-50 border border-gray-200'
                                        }`}
                                >
                                    {version}
                                </button>
                            ))}
                        </div>
                    </form>
                </div>
            </div>

            {/* Results */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-600 border-t-transparent"></div>
                        <p className="mt-4 text-gray-600">Searching the Bible...</p>
                    </div>
                )}

                {!loading && searched && results.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-5xl font-bold text-orange-600 mb-4">Bible</div>
                        <p className="text-gray-600 text-lg">No results found for &quot;{searchQuery}&quot;</p>
                        <p className="text-gray-500 mt-2">Try different keywords or check your spelling</p>
                    </div>
                )}

                {!loading && results.length > 0 && (
                    <div className="space-y-4">
                        <p className="text-gray-600 mb-4">
                            Found {results.length} result{results.length !== 1 ? 's' : ''} for &quot;{searchQuery}&quot;
                        </p>
                        {results.map((result, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all border border-gray-100"
                            >
                                <h3 className="font-bold text-orange-600 mb-2">{result.reference}</h3>
                                <p className="text-gray-800 leading-relaxed">{result.text}</p>
                                <div className="mt-4 flex gap-2">
                                    <button className="px-4 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors text-sm">
                                        Bookmark
                                    </button>
                                    <button className="px-4 py-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors text-sm">
                                        Highlight
                                    </button>
                                    <button className="px-4 py-2 bg-yellow-50 text-yellow-600 rounded-lg hover:bg-yellow-100 transition-colors text-sm">
                                        Share
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!searched && (
                    <div className="text-center py-12">
                        <div className="text-5xl font-bold text-orange-600 mb-4">Search</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Search God&apos;s Word</h2>
                        <p className="text-gray-600 mb-6">
                            Enter keywords, topics, or phrases to find relevant Bible verses
                        </p>

                        {/* Popular Searches */}
                        <div className="max-w-md mx-auto">
                            <p className="text-sm font-medium text-gray-700 mb-3">Popular searches:</p>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {['love', 'faith', 'hope', 'peace', 'joy', 'prayer', 'forgiveness', 'salvation'].map(
                                    (term) => (
                                        <button
                                            key={term}
                                            onClick={() => {
                                                setSearchQuery(term);
                                                handleSearch(new Event('submit') as any);
                                            }}
                                            className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-colors text-sm"
                                        >
                                            {term}
                                        </button>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
