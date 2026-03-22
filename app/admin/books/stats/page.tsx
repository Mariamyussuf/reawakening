"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface BookStats {
    overview: {
        totalBooks: number;
        featuredBooks: number;
        popularBooks: number;
        newReleases: number;
        booksThisMonth: number;
        booksThisWeek: number;
    };
    engagement: {
        totalViews: number;
        totalDownloads: number;
        avgViews: number;
        avgDownloads: number;
    };
    categories: Array<{ category: string; count: number }>;
    topViewed: Array<{ title: string; views: number }>;
    topDownloaded: Array<{ title: string; downloads: number }>;
}

export default function BookStatsPage() {
    const [stats, setStats] = useState<BookStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/admin/books/stats");
            if (!response.ok) throw new Error("Failed to fetch statistics");
            const data = await response.json();
            setStats(data);
        } catch (err: any) {
            setError(err.message || "Failed to load statistics");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-deep/70 font-display text-lg">Loading statistics...</p>
                </div>
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <div className="text-center">
                    <div className="text-5xl font-bold text-red-600 mb-4">Error</div>
                    <p className="text-deep/70 font-semibold">{error || "Failed to load statistics"}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream font-body">
            {/* Header */}
            <header className="border-b border-mid/20 bg-warm-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5">
                    <div className="flex items-center justify-between">
                        <Link href="/admin/books" className="flex items-center space-x-2 text-deep/60 hover:text-deep">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span className="font-medium">Back to Books Admin</span>
                        </Link>
                        <h1 className="font-display text-2xl text-deep">Book Statistics</h1>
                        <div className="w-20"></div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                {/* Overview Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    <div className="rounded-2xl border border-mid/20 bg-warm-white p-5 shadow-sm">
                        <p className="text-deep/50 text-xs uppercase tracking-wide mb-1">Total Books</p>
                        <p className="text-3xl font-display text-deep">{stats.overview.totalBooks}</p>
                    </div>
                    <div className="rounded-2xl border border-deep bg-deep p-5 shadow-sm text-cream">
                        <p className="text-gold/75 text-xs uppercase tracking-wide mb-1">Featured</p>
                        <p className="text-3xl font-display">{stats.overview.featuredBooks}</p>
                    </div>
                    <div className="rounded-2xl border border-gold/30 bg-gold/15 p-5 shadow-sm">
                        <p className="text-deep/50 text-xs uppercase tracking-wide mb-1">Popular</p>
                        <p className="text-3xl font-display text-deep">{stats.overview.popularBooks}</p>
                    </div>
                    <div className="rounded-2xl border border-mid/20 bg-warm-white p-5 shadow-sm">
                        <p className="text-deep/50 text-xs uppercase tracking-wide mb-1">New Releases</p>
                        <p className="text-3xl font-display text-deep">{stats.overview.newReleases}</p>
                    </div>
                    <div className="rounded-2xl border border-mid/20 bg-warm-white p-5 shadow-sm">
                        <p className="text-deep/50 text-xs uppercase tracking-wide mb-1">This Month</p>
                        <p className="text-3xl font-display text-deep">{stats.overview.booksThisMonth}</p>
                    </div>
                    <div className="rounded-2xl border border-mid/20 bg-warm-white p-5 shadow-sm">
                        <p className="text-deep/50 text-xs uppercase tracking-wide mb-1">This Week</p>
                        <p className="text-3xl font-display text-deep">{stats.overview.booksThisWeek}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Engagement Stats */}
                    <div className="rounded-3xl border border-mid/20 bg-warm-white p-6 shadow-sm">
                        <h2 className="text-2xl font-display text-deep mb-6">Engagement Metrics</h2>
                        <div className="space-y-4">
                            <div className="p-4 bg-cream border border-mid/15 rounded-2xl">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-deep/60">Total Views</span>
                                    <span className="text-2xl font-display text-deep">
                                        {stats.engagement.totalViews.toLocaleString()}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-500">Avg: {stats.engagement.avgViews.toLocaleString()} per book</p>
                            </div>
                            <div className="p-4 bg-cream border border-mid/15 rounded-2xl">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-deep/60">Total Downloads</span>
                                    <span className="text-2xl font-display text-deep">
                                        {stats.engagement.totalDownloads.toLocaleString()}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-500">Avg: {stats.engagement.avgDownloads.toLocaleString()} per book</p>
                            </div>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="rounded-3xl border border-mid/20 bg-warm-white p-6 shadow-sm">
                        <h2 className="text-2xl font-display text-deep mb-6">Books by Category</h2>
                        <div className="space-y-2">
                            {stats.categories.map((cat, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-cream border border-mid/15 rounded-2xl">
                                    <span className="font-medium text-deep">{cat.category}</span>
                                    <span className="px-3 py-1 bg-deep text-cream rounded-full text-sm font-semibold">
                                        {cat.count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Viewed */}
                    <div className="rounded-3xl border border-mid/20 bg-warm-white p-6 shadow-sm">
                        <h2 className="text-2xl font-display text-deep mb-6">Top Viewed Books</h2>
                        <div className="space-y-3">
                            {stats.topViewed.map((book, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-cream border border-mid/15 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <span className="w-8 h-8 bg-deep text-cream rounded-full flex items-center justify-center font-bold text-sm">
                                            {index + 1}
                                        </span>
                                        <span className="font-medium text-deep">{book.title}</span>
                                    </div>
                                    <span className="text-deep/70 font-semibold">{book.views.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Downloaded */}
                    <div className="rounded-3xl border border-mid/20 bg-warm-white p-6 shadow-sm">
                        <h2 className="text-2xl font-display text-deep mb-6">Top Downloaded Books</h2>
                        <div className="space-y-3">
                            {stats.topDownloaded.map((book, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-cream border border-mid/15 rounded-2xl">
                                    <div className="flex items-center gap-3">
                                        <span className="w-8 h-8 bg-gold/15 text-gold-dark rounded-full flex items-center justify-center font-bold text-sm">
                                            {index + 1}
                                        </span>
                                        <span className="font-medium text-deep">{book.title}</span>
                                    </div>
                                    <span className="text-deep/70 font-semibold">{book.downloads.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
