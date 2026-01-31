"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { bookService } from "@/lib/books/book-service";
import { Book } from "@/models/Book";

export default function AdminBooksPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        loadBooks();
    }, []);

    const loadBooks = async () => {
        try {
            setLoading(true);
            const allBooks = await bookService.getAllBooks();
            setBooks(allBooks);
        } catch (error) {
            console.error("Error loading books:", error);
            setError("Failed to load books");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (bookId: string) => {
        if (!confirm("Are you sure you want to delete this book? This action cannot be undone.")) {
            return;
        }

        try {
            const response = await fetch(`/api/admin/books/${bookId}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || "Failed to delete book");
            }

            setSuccess("Book deleted successfully!");
            await loadBooks();
        } catch (err: any) {
            setError(err.message || "Failed to delete book");
        }
    };

    const handleEdit = (book: Book) => {
        // TODO: Implement edit modal or navigate to edit page
        alert("Edit functionality coming soon! For now, you can delete and re-upload the book.");
    };

    // Clear messages after 5 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(""), 5000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => setSuccess(""), 5000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">📚</div>
                    <p className="text-slate-700 font-semibold">Loading books...</p>
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
                        <Link href="/hub" className="flex items-center space-x-2 text-slate-600 hover:text-slate-800">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span className="font-medium">Back to Hub</span>
                        </Link>
                        <h1 className="text-2xl font-bold text-slate-800">Books Admin</h1>
                        <div className="w-20"></div>
                    </div>
                </div>
            </header>

            <main className="container-custom py-8">
                {/* Error/Success Messages */}
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                        {success}
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="card bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-100 text-sm mb-1">Total Books</p>
                                <p className="text-3xl font-bold">{books.length}</p>
                            </div>
                            <div className="text-4xl opacity-20">📚</div>
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-green-500 to-emerald-500 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm mb-1">Featured</p>
                                <p className="text-3xl font-bold">{books.filter(b => b.featured).length}</p>
                            </div>
                            <div className="text-4xl opacity-20">⭐</div>
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-blue-500 to-indigo-500 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm mb-1">Total Views</p>
                                <p className="text-3xl font-bold">
                                    {books.reduce((sum, b) => sum + b.totalViews, 0).toLocaleString()}
                                </p>
                            </div>
                            <div className="text-4xl opacity-20">👁️</div>
                        </div>
                    </div>

                    <div className="card bg-gradient-to-br from-orange-500 to-red-500 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-100 text-sm mb-1">Downloads</p>
                                <p className="text-3xl font-bold">
                                    {books.reduce((sum, b) => sum + b.totalDownloads, 0).toLocaleString()}
                                </p>
                            </div>
                            <div className="text-4xl opacity-20">📥</div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="card mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-1">Manage Books</h2>
                            <p className="text-slate-600">Upload, edit, and manage your book library</p>
                        </div>
                        <Link
                            href="/admin/books/upload"
                            className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Upload New Book
                        </Link>
                    </div>
                </div>

                {/* Books List */}
                <div className="card">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6">All Books ({books.length})</h2>

                    {books.length > 0 ? (
                        <div className="space-y-4">
                            {books.map((book) => (
                                <div
                                    key={book.id}
                                    className="p-4 bg-slate-50 rounded-lg border border-slate-200 hover:shadow-md transition-all"
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Cover Thumbnail */}
                                        <div className="w-16 h-24 bg-gradient-to-br from-slate-200 to-slate-300 rounded flex-shrink-0 overflow-hidden">
                                            {book.coverImage ? (
                                                <img
                                                    src={book.coverImage}
                                                    alt={book.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-2xl">
                                                    📖
                                                </div>
                                            )}
                                        </div>

                                        {/* Book Info */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h3 className="font-bold text-lg text-slate-800">{book.title}</h3>
                                                    <p className="text-sm text-slate-600">by {book.author}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    {book.featured && (
                                                        <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-semibold">
                                                            ⭐ Featured
                                                        </span>
                                                    )}
                                                    {book.newRelease && (
                                                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-semibold">
                                                            ✨ New
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <p className="text-sm text-slate-600 mb-3 line-clamp-2">{book.description}</p>

                                            {/* Categories */}
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {book.categories.slice(0, 3).map((category, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs"
                                                    >
                                                        {category}
                                                    </span>
                                                ))}
                                                {book.categories.length > 3 && (
                                                    <span className="px-2 py-1 bg-slate-200 text-slate-600 rounded text-xs">
                                                        +{book.categories.length - 3} more
                                                    </span>
                                                )}
                                            </div>

                                            {/* Stats & Actions */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                                    <span>👁️ {book.totalViews.toLocaleString()} views</span>
                                                    <span>📥 {book.totalDownloads.toLocaleString()} downloads</span>
                                                    {book.fileSize && <span>💾 {book.fileSize} MB</span>}
                                                </div>

                                                <div className="flex gap-2">
                                                    <Link
                                                        href={`/hub/books/${book.id}`}
                                                        className="px-3 py-1 bg-white border border-slate-300 text-slate-700 rounded text-sm font-medium hover:bg-slate-50 transition-colors"
                                                    >
                                                        View
                                                    </Link>
                                                    <button
                                                        onClick={() => handleEdit(book)}
                                                        className="px-3 py-1 bg-purple-600 text-white rounded text-sm font-medium hover:bg-purple-700 transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(book.id)}
                                                        className="px-3 py-1 bg-red-600 text-white rounded text-sm font-medium hover:bg-red-700 transition-colors"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📚</div>
                            <p className="text-slate-600 text-lg mb-4">No books uploaded yet</p>
                            <Link
                                href="/admin/books/upload"
                                className="inline-block px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                            >
                                Upload Your First Book
                            </Link>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
