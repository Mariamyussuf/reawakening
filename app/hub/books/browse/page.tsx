"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import BookCard from "@/components/books/BookCard";
import { bookService } from "@/lib/books/book-service";
import { Book, BookCategory } from "@/models/Book";

export default function BrowseBooksPage() {
    const searchParams = useSearchParams();
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);

    const category = searchParams.get("category");
    const sort = searchParams.get("sort");

    useEffect(() => {
        const loadBooks = async () => {
            setLoading(true);

            try {
                let results: Book[] = [];

                if (category) {
                    results = await bookService.getBooksByCategory(category as BookCategory);
                } else if (sort === "popular") {
                    results = await bookService.getPopularBooks();
                } else {
                    results = await bookService.getAllBooks();
                }

                setBooks(results);
            } catch (error) {
                console.error("Error loading browse books:", error);
                setBooks([]);
            } finally {
                setLoading(false);
            }
        };

        void loadBooks();
    }, [category, sort]);

    const title = category
        ? category
        : sort === "popular"
            ? "Popular Books"
            : "Browse Books";

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-amber-50">
            <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200">
                <div className="container-custom py-4">
                    <div className="flex items-center justify-between gap-4">
                        <Link href="/hub/books" className="flex items-center space-x-2 text-slate-600 hover:text-slate-800">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span className="font-medium">Back to Library</span>
                        </Link>
                        <h1 className="text-2xl font-bold text-slate-800 text-center">{title}</h1>
                        <div className="w-28" />
                    </div>
                </div>
            </header>

            <main className="container-custom py-8">
                {loading ? (
                    <div className="card text-center py-12">
                        <p className="text-slate-700 font-semibold">Loading books...</p>
                    </div>
                ) : books.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {books.map((book) => (
                            <BookCard key={book.id} book={book} />
                        ))}
                    </div>
                ) : (
                    <div className="card text-center py-12">
                        <p className="text-slate-700 text-lg">No books found for this view.</p>
                    </div>
                )}
            </main>
        </div>
    );
}
