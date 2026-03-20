"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";

interface Devotional {
    id: string;
    title: string;
    content: string;
    excerpt: string;
    author: string;
    coverImage?: string;
    publishDate: string;
    tags: string[];
    scripture?: string;
}

export default function DevotionalDetailPage({ params }: { params: { id: string } }) {
    const [devotional, setDevotional] = useState<Devotional | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadDevotional();
    }, [params.id]);

    const loadDevotional = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/devotionals/${params.id}`);
            if (!response.ok) {
                throw new Error('Failed to load devotional');
            }

            const data = await response.json();
            setDevotional(data.devotional);
        } catch (error) {
            console.error("Error loading devotional:", error);
            setError("Failed to load devotional");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen flex items-center justify-center bg-white">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                        <p className="mt-4 text-slate-600">Loading devotional...</p>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    if (error || !devotional) {
        return (
            <ProtectedRoute>
                <div className="min-h-screen flex items-center justify-center bg-white">
                    <div className="text-center">
                        <p className="text-slate-600 mb-4">{error || "Devotional not found"}</p>
                        <Link href="/hub/devotionals" className="inline-block px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                            Back to Devotionals
                        </Link>
                    </div>
                </div>
            </ProtectedRoute>
        );
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-white">
                {/* Minimal Header */}
                <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200">
                    <div className="max-w-4xl mx-auto px-6 py-4">
                        <Link href="/hub/devotionals" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors text-sm font-medium">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Devotionals
                        </Link>
                    </div>
                </header>

                <main className="max-w-3xl mx-auto px-6 py-12">
                    <article className="article-content">
                        {/* Cover Image */}
                        {devotional.coverImage && (
                            <div className="mb-12 -mx-6">
                                <img
                                    src={devotional.coverImage}
                                    alt={devotional.title}
                                    className="w-full h-[400px] object-cover"
                                />
                            </div>
                        )}

                        {/* Header Section */}
                        <header className="mb-12">
                            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
                                {devotional.title}
                            </h1>

                            <div className="flex items-center gap-4 text-slate-600 mb-6 text-base">
                                <span className="font-medium">{devotional.author}</span>
                                <span className="text-slate-400">•</span>
                                <time dateTime={devotional.publishDate}>
                                    {new Date(devotional.publishDate).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </time>
                            </div>

                            {/* Scripture Reference */}
                            {devotional.scripture && (
                                <div className="bg-orange-50 border-l-4 border-orange-500 pl-6 py-4 mb-8">
                                    <p className="text-slate-700 font-medium italic text-lg">
                                        {devotional.scripture}
                                    </p>
                                </div>
                            )}
                        </header>

                        {/* Content */}
                        <div
                            className="prose prose-lg prose-slate max-w-none 
                                prose-headings:font-bold prose-headings:text-slate-900 prose-headings:mt-12 prose-headings:mb-6
                                prose-h1:text-4xl prose-h1:mt-16 prose-h1:mb-8
                                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                                prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-5
                                prose-p:text-slate-700 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-lg
                                prose-strong:text-slate-900 prose-strong:font-semibold
                                prose-ul:my-8 prose-ul:pl-6
                                prose-ol:my-8 prose-ol:pl-6
                                prose-li:my-3 prose-li:text-lg prose-li:leading-relaxed
                                prose-blockquote:border-l-4 prose-blockquote:border-slate-300 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:my-8 prose-blockquote:text-slate-600 prose-blockquote:text-lg
                                prose-a:text-slate-900 prose-a:underline prose-a:decoration-slate-300 hover:prose-a:decoration-slate-900
                                prose-img:rounded-lg prose-img:my-12 prose-img:shadow-lg
                                prose-hr:my-12 prose-hr:border-slate-200"
                            dangerouslySetInnerHTML={{ __html: devotional.content }}
                        />

                        {/* Tags */}
                        {devotional.tags.length > 0 && (
                            <div className="mt-16 pt-8 border-t border-slate-200">
                                <div className="flex flex-wrap gap-3">
                                    {devotional.tags.map((tag, idx) => (
                                        <span
                                            key={idx}
                                            className="px-4 py-2 bg-orange-50 text-orange-700 rounded-full text-sm font-medium hover:bg-orange-100 transition-colors"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Author Footer */}
                        <div className="mt-16 pt-8 border-t border-slate-200">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                    {devotional.author.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900">{devotional.author}</p>
                                    <p className="text-sm text-slate-600">Author</p>
                                </div>
                            </div>
                        </div>
                    </article>
                </main>
            </div>

            <style jsx global>{`
                .article-content {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
                }
                
                .article-content img {
                    max-width: 100%;
                    height: auto;
                }
                
                .article-content p {
                    line-height: 1.8;
                }
                
                .article-content h1,
                .article-content h2,
                .article-content h3 {
                    line-height: 1.2;
                }
            `}</style>
        </ProtectedRoute>
    );
}
