'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

interface Bookmark {
    id: string;
    version: string;
    bookId: string;
    bookName: string;
    chapter: number;
    verse?: number;
    verseText?: string;
    reference: string;
    note?: string;
    color: string;
    createdAt: string;
    updatedAt: string;
}

export default function BookmarksPage() {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editNote, setEditNote] = useState('');
    const [editColor, setEditColor] = useState('yellow');

    useEffect(() => {
        fetchBookmarks();
    }, []);

    const fetchBookmarks = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await fetch('/api/bible/bookmarks');
            if (!response.ok) throw new Error('Failed to fetch bookmarks');
            const data = await response.json();
            setBookmarks(data.bookmarks || []);
        } catch (err: any) {
            setError(err.message || 'Failed to load bookmarks');
            console.error('Error fetching bookmarks:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this bookmark?')) return;

        try {
            const response = await fetch(`/api/bible/bookmarks/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete bookmark');

            setBookmarks(bookmarks.filter((b) => b.id !== id));
        } catch (err: any) {
            setError(err.message || 'Failed to delete bookmark');
        }
    };

    const handleEdit = (bookmark: Bookmark) => {
        setEditingId(bookmark.id);
        setEditNote(bookmark.note || '');
        setEditColor(bookmark.color);
    };

    const handleSaveEdit = async () => {
        if (!editingId) return;

        try {
            const response = await fetch(`/api/bible/bookmarks/${editingId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    note: editNote,
                    color: editColor,
                }),
            });

            if (!response.ok) throw new Error('Failed to update bookmark');

            await fetchBookmarks();
            setEditingId(null);
            setEditNote('');
        } catch (err: any) {
            setError(err.message || 'Failed to update bookmark');
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditNote('');
    };

    // Separate bookmarks and highlights (highlights are bookmarks with colors)
    const regularBookmarks = bookmarks.filter((b) => !b.color || b.color === 'yellow');
    const highlights = bookmarks.filter((b) => b.color && b.color !== 'yellow');

    const colorClasses = {
        yellow: 'bg-yellow-100 border-yellow-300',
        green: 'bg-green-100 border-green-300',
        blue: 'bg-blue-100 border-blue-300',
        pink: 'bg-pink-100 border-pink-300',
        purple: 'bg-purple-100 border-purple-300',
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900" style={{ fontFamily: 'Merriweather, serif' }}>
                                🔖 My Bookmarks & Highlights
                            </h1>
                            <p className="text-gray-600 mt-1">Your saved verses and notes</p>
                        </div>
                        <Link
                            href="/hub/bible"
                            className="px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg hover:scale-105 transition-transform"
                        >
                            ← Back
                        </Link>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">📖</div>
                        <p className="text-gray-600">Loading bookmarks...</p>
                    </div>
                ) : (
                    <>
                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-sm">Bookmarks</p>
                                        <p className="text-3xl font-bold text-gray-900">{regularBookmarks.length}</p>
                                    </div>
                                    <div className="text-4xl">🔖</div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-sm">Highlights</p>
                                        <p className="text-3xl font-bold text-gray-900">{highlights.length}</p>
                                    </div>
                                    <div className="text-4xl">✨</div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-gray-600 text-sm">Notes</p>
                                        <p className="text-3xl font-bold text-gray-900">
                                            {bookmarks.filter((b) => b.note).length}
                                        </p>
                                    </div>
                                    <div className="text-4xl">📝</div>
                                </div>
                            </div>
                        </div>

                        {/* Bookmarks Section */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Merriweather, serif' }}>
                                📚 Bookmarks
                            </h2>
                            {regularBookmarks.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No bookmarks yet. Start reading and bookmark your favorite verses!
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {regularBookmarks.map((bookmark) => (
                                        <div
                                            key={bookmark.id}
                                            className={`rounded-xl p-6 shadow-sm hover:shadow-lg transition-all border-2 ${colorClasses[bookmark.color as keyof typeof colorClasses]
                                                }`}
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <h3 className="font-bold text-orange-600 text-lg">{bookmark.reference}</h3>
                                                <span className="text-sm text-gray-500">
                                                    {new Date(bookmark.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {bookmark.verseText && (
                                                <p className="text-gray-800 leading-relaxed mb-3">{bookmark.verseText}</p>
                                            )}
                                            {editingId === bookmark.id ? (
                                                <div className="space-y-3 mb-3">
                                                    <textarea
                                                        value={editNote}
                                                        onChange={(e) => setEditNote(e.target.value)}
                                                        placeholder="Add a note..."
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                        rows={3}
                                                        maxLength={500}
                                                    />
                                                    <select
                                                        value={editColor}
                                                        onChange={(e) => setEditColor(e.target.value)}
                                                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                    >
                                                        <option value="yellow">Yellow</option>
                                                        <option value="green">Green</option>
                                                        <option value="blue">Blue</option>
                                                        <option value="pink">Pink</option>
                                                        <option value="purple">Purple</option>
                                                    </select>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={handleSaveEdit}
                                                            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={handleCancelEdit}
                                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    {bookmark.note && (
                                                        <div className="bg-white/50 rounded-lg p-3 mb-3">
                                                            <p className="text-sm text-gray-700">
                                                                <span className="font-medium">Note:</span> {bookmark.note}
                                                            </p>
                                                        </div>
                                                    )}
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleEdit(bookmark)}
                                                            className="px-4 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors text-sm border border-gray-200"
                                                        >
                                                            📝 Edit Note
                                                        </button>
                                                        <Link
                                                            href={`/hub/bible/${bookmark.bookId}/${bookmark.chapter}?version=${bookmark.version}`}
                                                            className="px-4 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors text-sm border border-gray-200"
                                                        >
                                                            📖 View
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(bookmark.id)}
                                                            className="px-4 py-2 bg-white rounded-lg hover:bg-red-50 transition-colors text-sm border border-gray-200 text-red-600"
                                                        >
                                                            🗑️ Remove
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Highlights Section */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Merriweather, serif' }}>
                                ✨ Highlights
                            </h2>
                            {highlights.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    No highlights yet. Highlight verses while reading!
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {highlights.map((highlight) => (
                                        <div
                                            key={highlight.id}
                                            className={`rounded-xl p-6 shadow-sm hover:shadow-lg transition-all border-2 ${colorClasses[highlight.color as keyof typeof colorClasses]
                                                }`}
                                        >
                                            <div className="flex items-start justify-between mb-3">
                                                <h3 className="font-bold text-orange-600 text-lg">{highlight.reference}</h3>
                                                <span className="text-sm text-gray-500">
                                                    {new Date(highlight.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                            {highlight.verseText && (
                                                <p className="text-gray-800 leading-relaxed mb-3">{highlight.verseText}</p>
                                            )}
                                            {editingId === highlight.id ? (
                                                <div className="space-y-3 mb-3">
                                                    <textarea
                                                        value={editNote}
                                                        onChange={(e) => setEditNote(e.target.value)}
                                                        placeholder="Add a note..."
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                        rows={3}
                                                        maxLength={500}
                                                    />
                                                    <select
                                                        value={editColor}
                                                        onChange={(e) => setEditColor(e.target.value)}
                                                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                                    >
                                                        <option value="yellow">Yellow</option>
                                                        <option value="green">Green</option>
                                                        <option value="blue">Blue</option>
                                                        <option value="pink">Pink</option>
                                                        <option value="purple">Purple</option>
                                                    </select>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={handleSaveEdit}
                                                            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                                                        >
                                                            Save
                                                        </button>
                                                        <button
                                                            onClick={handleCancelEdit}
                                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    {highlight.note && (
                                                        <div className="bg-white/50 rounded-lg p-3 mb-3">
                                                            <p className="text-sm text-gray-700">
                                                                <span className="font-medium">Note:</span> {highlight.note}
                                                            </p>
                                                        </div>
                                                    )}
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleEdit(highlight)}
                                                            className="px-4 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors text-sm border border-gray-200"
                                                        >
                                                            📝 {highlight.note ? 'Edit Note' : 'Add Note'}
                                                        </button>
                                                        <Link
                                                            href={`/hub/bible/${highlight.bookId}/${highlight.chapter}?version=${highlight.version}`}
                                                            className="px-4 py-2 bg-white rounded-lg hover:bg-gray-50 transition-colors text-sm border border-gray-200"
                                                        >
                                                            📖 View
                                                        </Link>
                                                        <button
                                                            onClick={() => handleDelete(highlight.id)}
                                                            className="px-4 py-2 bg-white rounded-lg hover:bg-red-50 transition-colors text-sm border border-gray-200 text-red-600"
                                                        >
                                                            🗑️ Remove
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Empty State (if no bookmarks) */}
                        {bookmarks.length === 0 && (
                            <div className="text-center py-12">
                                <div className="text-6xl mb-4">📖</div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">No bookmarks yet</h2>
                                <p className="text-gray-600 mb-6">
                                    Start reading the Bible and bookmark your favorite verses
                                </p>
                                <Link
                                    href="/hub/bible"
                                    className="inline-block px-6 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-lg hover:scale-105 transition-transform"
                                >
                                    Start Reading
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
