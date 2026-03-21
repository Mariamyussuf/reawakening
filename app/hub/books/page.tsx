"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { bookService } from "@/lib/books/book-service";
import { Book, BookCategory } from "@/models/Book";
import BookCard from "@/components/books/BookCard";

export default function BooksLibraryPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
    const [popularBooks, setPopularBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        loadBooks();
    }, []);

    const loadBooks = async () => {
        try {
            const [allBooks, featured, popular] = await Promise.all([
                bookService.getAllBooks(),
                bookService.getFeaturedBooks(),
                bookService.getPopularBooks(),
            ]);

            setBooks(allBooks);
            setFeaturedBooks(featured);
            setPopularBooks(popular);
        } catch (error) {
            console.error("Error loading books:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async () => {
        if (searchQuery.trim()) {
            const results = await bookService.searchBooks(searchQuery);
            setBooks(results);
        } else {
            const allBooks = await bookService.getAllBooks();
            setBooks(allBooks);
        }
    };

    const categories = bookService.getAllCategories();

    if (loading) {
        return (
            <div className="page-shell flex items-center justify-center">
                <div className="text-center">
                    <div className="text-5xl font-bold text-gold-dark mb-4">Books</div>
                    <p className="text-slate-700 font-semibold">Loading library...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-shell">
            {/* Header */}
            <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200">
                <div className="container-custom py-4">
                    <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <Link href="/hub" className="flex items-center space-x-2 text-slate-600 hover:text-slate-800">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span className="font-medium">Back to Hub</span>
                        </Link>
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Books Library</h1>
                        <div className="hidden sm:block w-20"></div>
                    </div>
                </div>
            </header>

            <main className="container-custom py-8">
                {/* Search Bar */}
                <div className="card mb-8">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                                placeholder="Search books by title, author, or topic..."
                                className="input-soft pl-12"
                            />
                            <svg className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <button
                            onClick={handleSearch}
                            className="btn-soft-primary"
                        >
                            Search
                        </button>
                    </div>
                </div>

                {/* Featured Book */}
                {featuredBooks.length > 0 && (
                    <div className="card-accent-soft mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="eyebrow-soft mb-0">Featured</span>
                            <h2 className="text-2xl font-bold">Featured Book</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-1">
                                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 h-64 flex items-center justify-center">
                                    {featuredBooks[0].coverImage ? (
                                        <img
                                            src={featuredBooks[0].coverImage}
                                            alt={featuredBooks[0].title}
                                            className="max-h-full rounded"
                                        />
                                    ) : (
                                        <div className="text-6xl font-bold">Book</div>
                                    )}
                                </div>
                            </div>
                            <div className="md:col-span-2 flex flex-col justify-center">
                                <h3 className="text-3xl font-bold mb-2">{featuredBooks[0].title}</h3>
                                <p className="text-gold-dark text-lg mb-4">by {featuredBooks[0].author}</p>
                                <p className="text-slate-700 mb-6 line-clamp-3">{featuredBooks[0].description}</p>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <Link
                                        href={`/hub/books/${featuredBooks[0].id}`}
                                        className="btn-soft-primary"
                                    >
                                        View Details
                                    </Link>
                                    <Link
                                        href={`/hub/books/${featuredBooks[0].id}/read`}
                                        className="btn-soft-secondary"
                                    >
                                        Start Reading
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Categories */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Browse by Category</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {categories.slice(0, 12).map((category) => (
                            <Link
                                key={category}
                                href={`/hub/books/browse?category=${encodeURIComponent(category)}`}
                                className="card text-center hover:shadow-lg transition-all duration-300 group"
                            >
                                <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                                    {getCategoryIcon(category)}
                                </div>
                                <p className="text-sm font-semibold text-slate-700 group-hover:text-gold-dark transition-colors">
                                    {category}
                                </p>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Popular Books */}
                {popularBooks.length > 0 && (
                    <div className="mb-8">
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-4">
                            <h2 className="text-2xl font-bold text-slate-800">Popular Books</h2>
                            <Link href="/hub/books/browse?sort=popular" className="text-gold-dark hover:text-gold font-semibold text-sm">
                                View All
                            </Link>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {popularBooks.slice(0, 4).map((book) => (
                                <BookCard key={book.id} book={book} />
                            ))}
                        </div>
                    </div>
                )}

                {/* All Books */}
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">
                        {searchQuery ? `Search Results (${books.length})` : "All Books"}
                    </h2>
                    {books.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {books.map((book) => (
                                <BookCard key={book.id} book={book} />
                            ))}
                        </div>
                    ) : (
                        <div className="card text-center py-12">
                            <div className="text-5xl font-bold text-gold-dark mb-4">Books</div>
                            <p className="text-slate-600 text-lg">No books found</p>
                            <p className="text-slate-500 text-sm mt-2">Try a different search term</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

// Helper function to get category icon
function getCategoryIcon(category: BookCategory): string {
    const icons: Record<string, string> = {
        [BookCategory.THEOLOGY]: "Theo",
        [BookCategory.DEVOTIONAL]: "Devo",
        [BookCategory.BIOGRAPHY]: "Bio",
        [BookCategory.PRAYER]: "Pray",
        [BookCategory.LEADERSHIP]: "Lead",
        [BookCategory.FAMILY]: "Fam",
        [BookCategory.YOUTH]: "Youth",
        [BookCategory.APOLOGETICS]: "Def",
        [BookCategory.CHRISTIAN_LIVING]: "Life",
        [BookCategory.BIBLE_STUDY]: "Study",
        [BookCategory.CHURCH_HISTORY]: "Hist",
        [BookCategory.MISSIONS]: "Mission",
        [BookCategory.EVANGELISM]: "Reach",
        [BookCategory.DISCIPLESHIP]: "Grow",
        [BookCategory.WOMEN]: "Women",
        [BookCategory.MEN]: "Men",
    };
    return icons[category] || "Books";
}
