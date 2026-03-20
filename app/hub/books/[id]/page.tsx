"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { bookService } from "@/lib/books/book-service";
import { Book } from "@/models/Book";

export default function BookDetailPage() {
    const params = useParams();
    const bookId = params.id as string;

    const [book, setBook] = useState<Book | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBook();
    }, [bookId]);

    const loadBook = async () => {
        try {
            const bookData = await bookService.getBookById(bookId);
            setBook(bookData);

            // Increment view count
            if (bookData) {
                await bookService.incrementViews(bookId);
            }
        } catch (error) {
            console.error("Error loading book:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        if (!book) return;

        // Increment download count and get PDF URL
        const result = await bookService.incrementDownloads(bookId);

        if (result) {
            // Trigger download
            const link = document.createElement("a");
            link.href = result.pdfUrl;
            link.download = `${book.title}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Update local book state with new download count
            setBook({ ...book, totalDownloads: book.totalDownloads + 1 });
        } else {
            // Fallback to original URL if API fails
            const link = document.createElement("a");
            link.href = book.pdfUrl;
            link.download = `${book.title}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">📖</div>
                    <p className="text-slate-700 font-semibold">Loading book...</p>
                </div>
            </div>
        );
    }

    if (!book) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">📚</div>
                    <p className="text-slate-700 font-semibold text-xl mb-2">Book not found</p>
                    <Link href="/hub/books" className="text-green-600 hover:text-green-700 font-medium">
                        ← Back to Library
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
            {/* Header */}
            <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200">
                <div className="container-custom py-4">
                    <Link href="/hub/books" className="flex items-center space-x-2 text-slate-600 hover:text-slate-800">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span className="font-medium">Back to Library</span>
                    </Link>
                </div>
            </header>

            <main className="container-custom py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Book Cover & Actions */}
                    <div className="lg:col-span-1">
                        <div className="card sticky top-8">
                            {/* Cover */}
                            <div className="bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg mb-6 h-96 flex items-center justify-center overflow-hidden">
                                {book.coverImage ? (
                                    <img
                                        src={book.coverImage}
                                        alt={book.title}
                                        className="max-h-full max-w-full object-contain"
                                    />
                                ) : (
                                    <div className="text-center p-6">
                                        <div className="text-8xl mb-4">📖</div>
                                        <p className="text-lg font-semibold text-slate-600">{book.title}</p>
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <Link
                                    href={`/hub/books/${book.id}/read`}
                                    className="block w-full px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold text-center hover:bg-orange-700 transition-colors"
                                >
                                    📖 Read in Browser
                                </Link>
                                <button
                                    onClick={handleDownload}
                                    className="w-full px-6 py-3 bg-slate-100 text-slate-700 rounded-lg font-semibold hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    Download PDF
                                </button>
                                <button className="w-full px-6 py-3 bg-white border-2 border-orange-600 text-orange-600 rounded-lg font-semibold hover:bg-orange-50 transition-colors flex items-center justify-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg>
                                    Save to Library
                                </button>
                            </div>

                            {/* Stats */}
                            <div className="mt-6 pt-6 border-t border-slate-200 space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600">Views</span>
                                    <span className="font-semibold text-slate-800">{book.totalViews.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600">Downloads</span>
                                    <span className="font-semibold text-slate-800">{book.totalDownloads.toLocaleString()}</span>
                                </div>
                                {book.pageCount && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-600">Pages</span>
                                        <span className="font-semibold text-slate-800">{book.pageCount}</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600">File Size</span>
                                    <span className="font-semibold text-slate-800">{book.fileSize} MB</span>
                                </div>
                                {book.averageRating && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-600">Rating</span>
                                        <span className="font-semibold text-slate-800">⭐ {book.averageRating}/5</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Book Details */}
                    <div className="lg:col-span-2">
                        <div className="card">
                            {/* Title & Author */}
                            <div className="mb-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <h1 className="text-4xl font-bold text-slate-800 mb-2">{book.title}</h1>
                                        <p className="text-xl text-slate-600">by {book.author}</p>
                                    </div>
                                    {book.featured && (
                                        <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                                            ⭐ Featured
                                        </span>
                                    )}
                                </div>

                                {/* Categories */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {book.categories.map((category, index) => (
                                        <Link
                                            key={index}
                                            href={`/hub/books/browse?category=${encodeURIComponent(category)}`}
                                            className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium hover:bg-orange-200 transition-colors"
                                        >
                                            {category}
                                        </Link>
                                    ))}
                                </div>

                                {/* Tags */}
                                {book.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {book.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-xs"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-slate-800 mb-3">About This Book</h2>
                                <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                                    {book.description}
                                </p>
                            </div>

                            {/* Metadata */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-6 bg-slate-50 rounded-lg">
                                {book.publishYear && (
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Published</p>
                                        <p className="font-semibold text-slate-800">{book.publishYear}</p>
                                    </div>
                                )}
                                {book.publisher && (
                                    <div>
                                        <p className="text-xs text-slate-500 mb-1">Publisher</p>
                                        <p className="font-semibold text-slate-800">{book.publisher}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Language</p>
                                    <p className="font-semibold text-slate-800">{book.language.toUpperCase()}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Difficulty</p>
                                    <p className="font-semibold text-slate-800 capitalize">{book.difficulty}</p>
                                </div>
                                {book.isbn && (
                                    <div className="md:col-span-2">
                                        <p className="text-xs text-slate-500 mb-1">ISBN</p>
                                        <p className="font-semibold text-slate-800">{book.isbn}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
