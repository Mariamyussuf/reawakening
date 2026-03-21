import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Books & Reading | Reawakening Resources",
    description: "Curated Christian reading lists, classics, and book summaries with reflection questions.",
};

export default function BooksPage() {
    const books = [
        {
            id: 1,
            title: "The Pilgrim's Progress",
            author: "John Bunyan",
            category: "Classic",
            description: "An allegory of the Christian journey from the City of Destruction to the Celestial City.",
            availability: "Public Domain - Free Download",
            hasStudyGuide: true,
        },
        {
            id: 2,
            title: "Mere Christianity",
            author: "C.S. Lewis",
            category: "Apologetics",
            description: "A rational explanation of Christian faith, exploring core beliefs and their implications.",
            availability: "External Link",
            hasStudyGuide: true,
        },
        {
            id: 3,
            title: "The Cost of Discipleship",
            author: "Dietrich Bonhoeffer",
            category: "Discipleship",
            description: "A powerful call to authentic Christian living and the true cost of following Jesus.",
            availability: "External Link",
            hasStudyGuide: true,
        },
        {
            id: 4,
            title: "The Pursuit of God",
            author: "A.W. Tozer",
            category: "Spiritual Growth",
            description: "A classic on developing deeper intimacy with God and hungering for His presence.",
            availability: "Public Domain - Free Download",
            hasStudyGuide: true,
        },
    ];

    const readingLists = [
        {
            title: "New Believer Essentials",
            books: ["Mere Christianity", "Basic Christianity", "The Normal Christian Life"],
        },
        {
            title: "Prayer & Devotion",
            books: ["The Pursuit of God", "The Practice of the Presence of God", "With Christ in the School of Prayer"],
        },
        {
            title: "Christian Classics",
            books: ["The Pilgrim's Progress", "Confessions", "The Imitation of Christ"],
        },
    ];

    return (
        <>
            <Header />
            <main className="min-h-screen">
                {/* Hero */}
                <section className="bg-gradient-to-r from-orange-600 to-amber-600 text-white py-20">
                    <div className="container-custom text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Books & Reading</h1>
                        <p className="text-xl opacity-90 max-w-2xl mx-auto">
                            Curated Christian literature to deepen your faith and understanding
                        </p>
                    </div>
                </section>

                {/* Featured Books */}
                <section className="container-custom py-16">
                    <h2 className="section-title text-center mb-12">Featured Books</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {books.map((book) => (
                            <div key={book.id} className="card hover:shadow-xl transition-all duration-300">
                                <div className="flex items-start justify-between mb-3">
                                    <span className="inline-block bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium">
                                        {book.category}
                                    </span>
                                    {book.hasStudyGuide && (
                                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">
                                            Study Guide Available
                                        </span>
                                    )}
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-1">{book.title}</h3>
                                <p className="text-slate-500 mb-3">by {book.author}</p>
                                <p className="text-slate-600 mb-4 leading-relaxed">
                                    {book.description}
                                </p>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-500">{book.availability}</span>
                                    <button className="text-orange-600 font-medium hover:text-orange-700 transition-colors">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Reading Lists */}
                <section className="bg-white/50 backdrop-blur-sm py-16">
                    <div className="container-custom">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="section-title text-center mb-12">Curated Reading Lists</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {readingLists.map((list, idx) => (
                                    <div key={idx} className="card">
                                        <h3 className="text-xl font-bold text-slate-800 mb-4">{list.title}</h3>
                                        <ul className="space-y-2">
                                            {list.books.map((book, bookIdx) => (
                                                <li key={bookIdx} className="text-slate-600 text-sm flex items-start">
                                                    <span className="text-orange-600 mr-2">-</span>
                                                    <span>{book}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Important Notice */}
                <section className="container-custom py-16">
                    <div className="max-w-3xl mx-auto">
                        <div className="card bg-amber-50 border-2 border-amber-200">
                            <h3 className="font-bold text-slate-800 mb-3 flex items-center">
                                <svg className="w-6 h-6 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Copyright & Attribution
                            </h3>
                            <p className="text-slate-600 leading-relaxed mb-3">
                                We respect copyright laws and intellectual property. Books marked as &quot;Public Domain&quot; are freely available
                                for download. For modern books, we provide external links to legitimate sources where you can purchase or
                                access them legally.
                            </p>
                            <p className="text-slate-600 leading-relaxed">
                                <strong>No pirated or unauthorized content is hosted or distributed through this platform.</strong>
                            </p>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
