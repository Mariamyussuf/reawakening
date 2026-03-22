"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { bookService } from "@/lib/books/book-service";
import { Book } from "@/models/Book";
import EditBookModal from "@/components/admin/EditBookModal";

export default function AdminBooksPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [selectedBooks, setSelectedBooks] = useState<Set<string>>(new Set());
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);

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
        setEditingBook(book);
        setShowEditModal(true);
    };

    const handleBulkAction = async (action: "delete" | "feature" | "unfeature") => {
        if (selectedBooks.size === 0) {
            setError("Please select at least one book");
            return;
        }

        if (action === "delete") {
            if (!confirm(`Are you sure you want to delete ${selectedBooks.size} book(s)? This action cannot be undone.`)) {
                return;
            }
        }

        try {
            const promises = Array.from(selectedBooks).map(async (bookId) => {
                if (action === "delete") {
                    return fetch(`/api/admin/books/${bookId}`, { method: "DELETE" });
                } else {
                    const book = books.find((b) => b.id === bookId);
                    return fetch(`/api/admin/books/${bookId}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ featured: action === "feature" }),
                    });
                }
            });

            await Promise.all(promises);
            setSuccess(`${action === "delete" ? "Deleted" : action === "feature" ? "Featured" : "Unfeatured"} ${selectedBooks.size} book(s) successfully!`);
            setSelectedBooks(new Set());
            await loadBooks();
        } catch (err: any) {
            setError(err.message || `Failed to ${action} books`);
        }
    };

    const toggleBookSelection = (bookId: string) => {
        setSelectedBooks((prev) => {
            const next = new Set(prev);
            if (next.has(bookId)) {
                next.delete(bookId);
            } else {
                next.add(bookId);
            }
            return next;
        });
    };

    const selectAll = () => {
        if (selectedBooks.size === books.length) {
            setSelectedBooks(new Set());
        } else {
            setSelectedBooks(new Set(books.map((b) => b.id)));
        }
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
            <div className="min-h-screen bg-cream flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-deep/70 font-display text-lg">Loading books...</p>
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
                        <Link href="/admin" className="flex items-center space-x-2 text-deep/60 hover:text-deep">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span className="font-medium">Back to Admin</span>
                        </Link>
                        <h1 className="font-display text-2xl text-deep">Books Library</h1>
                        <div className="w-20"></div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                {/* Error/Success Messages */}
                {error && (
                    <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-emerald-700">
                        {success}
                    </div>
                )}

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="rounded-2xl border border-mid/20 bg-warm-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-deep/50 text-xs uppercase tracking-wide mb-1">Total Books</p>
                                <p className="text-3xl font-display text-deep">{books.length}</p>
                            </div>
                            <div className="text-lg font-semibold text-deep/20">Books</div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-deep bg-deep p-5 shadow-sm text-cream">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gold/75 text-xs uppercase tracking-wide mb-1">Featured</p>
                                <p className="text-3xl font-display">{books.filter(b => b.featured).length}</p>
                            </div>
                            <div className="text-lg font-semibold text-cream/20">Featured</div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-gold/30 bg-gold/15 p-5 shadow-sm text-deep">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-deep/50 text-xs uppercase tracking-wide mb-1">Total Views</p>
                                <p className="text-3xl font-display">
                                    {books.reduce((sum, b) => sum + b.totalViews, 0).toLocaleString()}
                                </p>
                            </div>
                            <div className="text-lg font-semibold text-deep/20">Views</div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-mid/20 bg-warm-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-deep/50 text-xs uppercase tracking-wide mb-1">Downloads</p>
                                <p className="text-3xl font-display text-deep">
                                    {books.reduce((sum, b) => sum + b.totalDownloads, 0).toLocaleString()}
                                </p>
                            </div>
                            <div className="text-lg font-semibold text-deep/20">Downloads</div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="rounded-3xl border border-mid/20 bg-warm-white p-6 shadow-sm mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="eyebrow mb-2">Library Tools</p>
                            <h2 className="text-2xl font-display text-deep mb-1">Manage Books</h2>
                            <p className="text-deep/70">Upload, edit, and manage your book library</p>
                        </div>
                        <div className="flex gap-3">
                            <Link
                                href="/admin/books/stats"
                                className="btn-outline flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Statistics
                            </Link>
                            <Link
                                href="/admin/books/upload"
                                className="btn-primary flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Upload New Book
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bulk Actions */}
                {selectedBooks.size > 0 && (
                    <div className="rounded-3xl border border-gold/30 bg-gold/10 p-6 mb-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-deep">
                                    {selectedBooks.size} book{selectedBooks.size === 1 ? "" : "s"} selected
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleBulkAction("feature")}
                                    className="rounded-2xl bg-deep px-4 py-2 text-sm font-medium text-cream transition-colors hover:bg-deep/90"
                                >
                                    Feature Selected
                                </button>
                                <button
                                    onClick={() => handleBulkAction("unfeature")}
                                    className="rounded-2xl bg-warm-white px-4 py-2 text-sm font-medium text-deep border border-mid/20 transition-colors hover:bg-cream"
                                >
                                    Unfeature Selected
                                </button>
                                <button
                                    onClick={() => handleBulkAction("delete")}
                                    className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100"
                                >
                                    Delete Selected
                                </button>
                                <button
                                    onClick={() => setSelectedBooks(new Set())}
                                    className="rounded-2xl bg-warm-white px-4 py-2 text-sm font-medium text-deep border border-mid/20 transition-colors hover:bg-cream"
                                >
                                    Clear Selection
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Books List */}
                <div className="rounded-3xl border border-mid/20 bg-warm-white p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-display text-deep">All Books ({books.length})</h2>
                        <button
                            onClick={selectAll}
                            className="rounded-2xl bg-cream px-4 py-2 text-sm font-medium text-deep border border-mid/20 transition-colors hover:bg-warm-white"
                        >
                            {selectedBooks.size === books.length ? "Deselect All" : "Select All"}
                        </button>
                    </div>

                    {books.length > 0 ? (
                        <div className="space-y-4">
                            {books.map((book) => (
                                <div
                                    key={book.id}
                                    className={`p-4 rounded-2xl border transition-all ${
                                        selectedBooks.has(book.id)
                                            ? "bg-gold/10 border-gold/30"
                                            : "bg-cream border-mid/20 hover:shadow-lift hover:border-gold/35"
                                    }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedBooks.has(book.id)}
                                            onChange={() => toggleBookSelection(book.id)}
                                            className="mt-2 w-4 h-4 rounded border-mid/30 text-gold focus:ring-gold/30"
                                        />
                                        {/* Cover Thumbnail */}
                                        <div className="w-16 h-24 bg-warm-white border border-mid/20 rounded-xl flex-shrink-0 overflow-hidden">
                                            {book.coverImage ? (
                                                <img
                                                    src={book.coverImage}
                                                    alt={book.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-2xl">
                                                    Book
                                                </div>
                                            )}
                                        </div>

                                        {/* Book Info */}
                                        <div className="flex-1">
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <h3 className="font-display text-lg text-deep">{book.title}</h3>
                                                    <p className="text-sm text-deep/65">by {book.author}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    {book.featured && (
                                                        <span className="px-2 py-1 bg-deep text-cream rounded-full text-xs font-semibold uppercase tracking-wide">
                                                            Featured
                                                        </span>
                                                    )}
                                                    {book.newRelease && (
                                                        <span className="px-2 py-1 bg-gold/15 text-gold-dark rounded-full text-xs font-semibold uppercase tracking-wide">
                                                            New
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <p className="text-sm text-deep/70 mb-3 line-clamp-2">{book.description}</p>

                                            {/* Categories */}
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {book.categories.slice(0, 3).map((category, index) => (
                                                    <span
                                                        key={index}
                                                        className="px-2 py-1 bg-warm-white text-deep/75 border border-mid/20 rounded-full text-xs"
                                                    >
                                                        {category}
                                                    </span>
                                                ))}
                                                {book.categories.length > 3 && (
                                                    <span className="px-2 py-1 bg-warm-white text-deep/60 border border-mid/20 rounded-full text-xs">
                                                        +{book.categories.length - 3} more
                                                    </span>
                                                )}
                                            </div>

                                            {/* Stats & Actions */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4 text-xs text-deep/50">
                                                    <span>Views: {book.totalViews.toLocaleString()}</span>
                                                    <span>Downloads: {book.totalDownloads.toLocaleString()}</span>
                                                    {book.fileSize && <span>Size: {book.fileSize} MB</span>}
                                                </div>

                                                <div className="flex gap-2">
                                                    <Link
                                                        href={`/hub/books/${book.id}`}
                                                        className="px-3 py-1 bg-warm-white border border-mid/20 text-deep rounded-2xl text-sm font-medium hover:bg-cream transition-colors"
                                                    >
                                                        View
                                                    </Link>
                                                    <button
                                                        onClick={() => handleEdit(book)}
                                                        className="px-3 py-1 bg-deep text-cream rounded-2xl text-sm font-medium hover:bg-deep/90 transition-colors"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(book.id)}
                                                        className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-2xl text-sm font-medium hover:bg-red-100 transition-colors"
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
                            <div className="w-14 h-14 rounded-2xl bg-gold/10 text-gold-dark flex items-center justify-center mx-auto mb-4 text-2xl font-semibold">B</div>
                            <p className="text-deep/70 text-lg mb-4">No books uploaded yet</p>
                            <Link
                                href="/admin/books/upload"
                                className="btn-primary inline-block"
                            >
                                Upload Your First Book
                            </Link>
                        </div>
                    )}
                </div>
            </main>

            {/* Edit Book Modal */}
            <EditBookModal
                book={editingBook}
                isOpen={showEditModal}
                onClose={() => {
                    setShowEditModal(false);
                    setEditingBook(null);
                }}
                onSave={loadBooks}
            />
        </div>
    );
}
