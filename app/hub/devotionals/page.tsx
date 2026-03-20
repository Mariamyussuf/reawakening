"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";

interface Devotional {
    id: string;
    title: string;
    excerpt: string;
    author: string;
    coverImage?: string;
    publishDate: string;
    tags: string[];
    scripture?: string;
}

export default function DevotionalsPage() {
    const [devotionals, setDevotionals] = useState<Devotional[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedTag, setSelectedTag] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        loadDevotionals();
    }, [selectedTag, searchQuery]);

    const loadDevotionals = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (selectedTag) {
                params.append('tag', selectedTag);
            }
            if (searchQuery) {
                params.append('search', searchQuery);
            }

            const response = await fetch(`/api/devotionals?${params.toString()}`);
            if (!response.ok) {
                throw new Error('Failed to load devotionals');
            }

            const data = await response.json();
            setDevotionals(data.devotionals);
        } catch (error) {
            console.error("Error loading devotionals:", error);
            setError("Failed to load devotionals");
        } finally {
            setLoading(false);
        }
    };

    // Get all unique tags
    const allTags = Array.from(
        new Set(devotionals.flatMap((d) => d.tags))
    ).sort();

    if (loading) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                        <p className="mt-4 text-slate-600">Loading devotionals...</p>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
                {/* Header */}
                <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200">
                    <div className="container-custom py-4">
                        <div className="flex items-center justify-between">
                            <Link href="/hub" className="flex items-center space-x-2 text-slate-600 hover:text-slate-800">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                <span className="font-medium">Back to Hub</span>
                            </Link>
                            <h1 className="text-2xl font-bold text-slate-800">Daily Devotionals</h1>
                            <div className="w-20"></div>
                        </div>
                    </div>
                </header>

                <main className="container-custom py-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Search and Filters */}
                    <div className="mb-8 space-y-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search devotionals..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-3 pl-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                            <svg
                                className="absolute left-3 top-3.5 w-5 h-5 text-slate-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        {allTags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setSelectedTag(null)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedTag === null
                                            ? 'bg-orange-600 text-white'
                                            : 'bg-white text-slate-700 hover:bg-slate-100'
                                        }`}
                                >
                                    All
                                </button>
                                {allTags.map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => setSelectedTag(tag)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedTag === tag
                                                ? 'bg-orange-600 text-white'
                                                : 'bg-white text-slate-700 hover:bg-slate-100'
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Devotionals Grid */}
                    {devotionals.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                            <p className="text-slate-600 mb-4">No devotionals found.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {devotionals.map((devotional) => (
                                <Link
                                    key={devotional.id}
                                    href={`/hub/devotionals/${devotional.id}`}
                                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                                >
                                    {devotional.coverImage && (
                                        <img
                                            src={devotional.coverImage}
                                            alt={devotional.title}
                                            className="w-full h-48 object-cover"
                                        />
                                    )}
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-2">
                                            {devotional.title}
                                        </h3>
                                        <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                                            {devotional.excerpt}
                                        </p>
                                        <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                                            <span>By {devotional.author}</span>
                                            <span>{new Date(devotional.publishDate).toLocaleDateString()}</span>
                                        </div>
                                        {devotional.scripture && (
                                            <p className="text-sm text-orange-600 mb-4 italic">
                                                {devotional.scripture}
                                            </p>
                                        )}
                                        {devotional.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-2">
                                                {devotional.tags.slice(0, 3).map((tag, idx) => (
                                                    <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </ProtectedRoute>
    );
}
