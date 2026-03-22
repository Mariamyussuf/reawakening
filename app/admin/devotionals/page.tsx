"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface Devotional {
    id: string;
    title: string;
    excerpt: string;
    author: string;
    coverImage?: string;
    publishDate: string;
    scheduledDate?: string;
    status: 'draft' | 'scheduled' | 'published';
    tags: string[];
    scripture?: string;
}

export default function AdminDevotionalsPage() {
    const [devotionals, setDevotionals] = useState<Devotional[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [setupRequired, setSetupRequired] = useState(false);
    const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'scheduled' | 'published'>('all');

    useEffect(() => {
        loadDevotionals();
    }, [statusFilter]);

    const extractDevotionals = (payload: any): Devotional[] => {
        if (Array.isArray(payload?.devotionals)) {
            return payload.devotionals;
        }

        if (Array.isArray(payload?.data?.devotionals)) {
            return payload.data.devotionals;
        }

        return [];
    };

    const requiresDatabaseSetup = (payload: any): boolean => {
        return Boolean(payload?.needsDatabaseSetup || payload?.data?.needsDatabaseSetup);
    };

    const loadDevotionals = async () => {
        try {
            setLoading(true);
            setError("");
            const params = new URLSearchParams();
            if (statusFilter !== 'all') {
                params.append('status', statusFilter);
            }

            const response = await fetch(`/api/admin/devotionals?${params.toString()}`, {
                cache: "no-store",
            });
            const payload = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(payload?.error || "Failed to load devotionals");
            }

            const needsDatabaseSetup = requiresDatabaseSetup(payload);
            setSetupRequired(needsDatabaseSetup);
            setDevotionals(extractDevotionals(payload));

            if (needsDatabaseSetup) {
                setError("Devotionals are not available in this environment yet. Run the latest database schema update for production.");
            }
        } catch (error: any) {
            console.error("Error loading devotionals:", error);
            setError(error?.message || "Failed to load devotionals");
            setSetupRequired(false);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (devotionalId: string) => {
        if (!confirm("Are you sure you want to delete this devotional? This action cannot be undone.")) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/devotionals/${devotionalId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to delete devotional");
            }

            setSuccess("Devotional deleted successfully!");
            await loadDevotionals();
            setTimeout(() => setSuccess(""), 3000);
        } catch (err: any) {
            setError(err.message || "Failed to delete devotional");
            setTimeout(() => setError(""), 5000);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-slate-600">Loading devotionals...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
            {/* Header */}
            <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200">
                <div className="container-custom py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/admin" className="flex items-center space-x-2 text-slate-600 hover:text-slate-800">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span className="font-medium">Back to Admin</span>
                        </Link>
                        <h1 className="text-2xl font-bold text-slate-800">Devotionals Management</h1>
                        <Link href="/admin/devotionals/create" className="btn-primary">
                            + New Devotional
                        </Link>
                    </div>
                </div>
            </header>

            <main className="container-custom py-8">
                {/* Messages */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                        {success}
                    </div>
                )}

                {/* Filters */}
                <div className="mb-6 flex gap-2">
                    <button
                        onClick={() => setStatusFilter('all')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            statusFilter === 'all'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-slate-700 hover:bg-slate-100'
                        }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setStatusFilter('draft')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            statusFilter === 'draft'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-slate-700 hover:bg-slate-100'
                        }`}
                    >
                        Drafts
                    </button>
                    <button
                        onClick={() => setStatusFilter('scheduled')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            statusFilter === 'scheduled'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-slate-700 hover:bg-slate-100'
                        }`}
                    >
                        Scheduled
                    </button>
                    <button
                        onClick={() => setStatusFilter('published')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            statusFilter === 'published'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white text-slate-700 hover:bg-slate-100'
                        }`}
                    >
                        Published
                    </button>
                </div>

                {/* Devotionals List */}
                {devotionals.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                        <p className="text-slate-600 mb-4">
                            {setupRequired ? "The devotional database is not ready in this environment yet." : "No devotionals found."}
                        </p>
                        {!setupRequired && (
                            <Link href="/admin/devotionals/create" className="btn-primary inline-block">
                                Create Your First Devotional
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {devotionals.map((devotional) => (
                            <div key={devotional.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                {devotional.coverImage && (
                                    <img
                                        src={devotional.coverImage}
                                        alt={devotional.title}
                                        className="w-full h-48 object-cover"
                                    />
                                )}
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-2">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                                            devotional.status === 'published'
                                                ? 'bg-green-100 text-green-700'
                                                : devotional.status === 'scheduled'
                                                ? 'bg-yellow-100 text-yellow-700'
                                                : 'bg-slate-100 text-slate-700'
                                        }`}>
                                            {devotional.status}
                                        </span>
                                    </div>
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
                                        <p className="text-sm text-blue-600 mb-4 italic">
                                            {devotional.scripture}
                                        </p>
                                    )}
                                    {devotional.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {devotional.tags.slice(0, 3).map((tag, idx) => (
                                                <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/admin/devotionals/${devotional.id}/edit`}
                                            className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(devotional.id)}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
