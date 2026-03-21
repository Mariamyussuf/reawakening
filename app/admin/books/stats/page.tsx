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
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-5xl font-bold text-purple-600 mb-4">Stats</div>
                    <p className="text-slate-700 font-semibold">Loading statistics...</p>
                </div>
            </div>
        );
    }

    if (error || !stats) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-5xl font-bold text-red-600 mb-4">Error</div>
                    <p className="text-slate-700 font-semibold">{error || "Failed to load statistics"}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
            {/* Header */}
            <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200">
                <div className="container-custom py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/admin/books" className="flex items-center space-x-2 text-slate-600 hover:text-slate-800">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span className="font-medium">Back to Books Admin</span>
                        </Link>
                        <h1 className="text-2xl font-bold text-slate-800">Book Statistics</h1>
                        <div className="w-20"></div>
                    </div>
                </div>
            </header>

            <main className="container-custom py-8">
                {/* Overview Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    <div className="card bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                        <p className="text-purple-100 text-sm mb-1">Total Books</p>
                        <p className="text-3xl font-bold">{stats.overview.totalBooks}</p>
                    </div>
                    <div className="card bg-gradient-to-br from-yellow-500 to-orange-500 text-white">
                        <p className="text-yellow-100 text-sm mb-1">Featured</p>
                        <p className="text-3xl font-bold">{stats.overview.featuredBooks}</p>
                    </div>
                    <div className="card bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                        <p className="text-green-100 text-sm mb-1">Popular</p>
                        <p className="text-3xl font-bold">{stats.overview.popularBooks}</p>
                    </div>
                    <div className="card bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                        <p className="text-blue-100 text-sm mb-1">New Releases</p>
                        <p className="text-3xl font-bold">{stats.overview.newReleases}</p>
                    </div>
                    <div className="card bg-gradient-to-br from-teal-500 to-cyan-500 text-white">
                        <p className="text-teal-100 text-sm mb-1">This Month</p>
                        <p className="text-3xl font-bold">{stats.overview.booksThisMonth}</p>
                    </div>
                    <div className="card bg-gradient-to-br from-pink-500 to-rose-500 text-white">
                        <p className="text-pink-100 text-sm mb-1">This Week</p>
                        <p className="text-3xl font-bold">{stats.overview.booksThisWeek}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Engagement Stats */}
                    <div className="card">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">Engagement Metrics</h2>
                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-slate-600">Total Views</span>
                                    <span className="text-2xl font-bold text-blue-600">
                                        {stats.engagement.totalViews.toLocaleString()}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-500">Avg: {stats.engagement.avgViews.toLocaleString()} per book</p>
                            </div>
                            <div className="p-4 bg-green-50 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-slate-600">Total Downloads</span>
                                    <span className="text-2xl font-bold text-green-600">
                                        {stats.engagement.totalDownloads.toLocaleString()}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-500">Avg: {stats.engagement.avgDownloads.toLocaleString()} per book</p>
                            </div>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="card">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">Books by Category</h2>
                        <div className="space-y-2">
                            {stats.categories.map((cat, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <span className="font-medium text-slate-700">{cat.category}</span>
                                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                                        {cat.count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Viewed */}
                    <div className="card">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">Top Viewed Books</h2>
                        <div className="space-y-3">
                            {stats.topViewed.map((book, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                                            {index + 1}
                                        </span>
                                        <span className="font-medium text-slate-700">{book.title}</span>
                                    </div>
                                    <span className="text-slate-600 font-semibold">{book.views.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Downloaded */}
                    <div className="card">
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">Top Downloaded Books</h2>
                        <div className="space-y-3">
                            {stats.topDownloaded.map((book, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <span className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-sm">
                                            {index + 1}
                                        </span>
                                        <span className="font-medium text-slate-700">{book.title}</span>
                                    </div>
                                    <span className="text-slate-600 font-semibold">{book.downloads.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
