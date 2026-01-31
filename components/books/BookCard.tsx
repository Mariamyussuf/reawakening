import Link from "next/link";
import { Book } from "@/models/Book";

interface BookCardProps {
    book: Book;
}

export default function BookCard({ book }: BookCardProps) {
    return (
        <Link href={`/hub/books/${book.id}`}>
            <div className="card group hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
                {/* Cover Image */}
                <div className="relative h-64 bg-gradient-to-br from-slate-200 to-slate-300 rounded-lg mb-4 overflow-hidden">
                    {book.coverImage ? (
                        <img
                            src={book.coverImage}
                            alt={book.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center p-6">
                                <div className="text-6xl mb-2">📖</div>
                                <p className="text-sm font-semibold text-slate-600">{book.title}</p>
                            </div>
                        </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-2 right-2 flex flex-col gap-2">
                        {book.featured && (
                            <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full">
                                ⭐ Featured
                            </span>
                        )}
                        {book.newRelease && (
                            <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                                ✨ New
                            </span>
                        )}
                    </div>
                </div>

                {/* Book Info */}
                <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-800 mb-1 group-hover:text-green-600 transition-colors line-clamp-2">
                        {book.title}
                    </h3>
                    <p className="text-sm text-slate-600 mb-2">by {book.author}</p>
                    <p className="text-sm text-slate-500 line-clamp-2 mb-3">
                        {book.description}
                    </p>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-1 mb-3">
                        {book.categories.slice(0, 2).map((category, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                            >
                                {category}
                            </span>
                        ))}
                        {book.categories.length > 2 && (
                            <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                                +{book.categories.length - 2}
                            </span>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs text-slate-500 pt-3 border-t border-slate-200">
                        <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            <span>{book.totalViews.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>{book.totalDownloads.toLocaleString()}</span>
                        </div>
                        {book.pageCount && (
                            <div className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <span>{book.pageCount} pages</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
