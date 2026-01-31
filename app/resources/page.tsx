import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Resources | Reawakening Ministry",
    description: "Access curated Christian resources including devotionals, courses, prayer guides, and reading materials.",
};

export default function ResourcesPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen">
                {/* Hero */}
                <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
                    <div className="container-custom text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Resources</h1>
                        <p className="text-xl opacity-90 max-w-2xl mx-auto">
                            Carefully curated Christian materials to support your spiritual growth
                        </p>
                    </div>
                </section>

                {/* Resource Categories */}
                <section className="container-custom py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Materials */}
                        <Link href="/resources/materials" className="card group hover:scale-105">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:shadow-lg transition-all duration-300">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-3">Materials</h2>
                            <p className="text-slate-600 mb-4">
                                Devotionals, prayer guides, study outlines, and holiday reset plans to help you stay grounded.
                            </p>
                            <span className="text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
                                Browse Materials →
                            </span>
                        </Link>

                        {/* Courses */}
                        <Link href="/resources/courses" className="card group hover:scale-105">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:shadow-lg transition-all duration-300">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-3">Courses</h2>
                            <p className="text-slate-600 mb-4">
                                Lesson-based teachings on key topics. Text-first, low-data, and completely free with progress tracking.
                            </p>
                            <span className="text-purple-600 font-medium group-hover:text-purple-700 transition-colors">
                                Explore Courses →
                            </span>
                        </Link>

                        {/* Books & Reading */}
                        <Link href="/resources/books" className="card group hover:scale-105">
                            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mb-4 group-hover:shadow-lg transition-all duration-300">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-3">Books & Reading</h2>
                            <p className="text-slate-600 mb-4">
                                Curated Christian reading lists, public-domain classics, and book summaries with reflection questions.
                            </p>
                            <span className="text-pink-600 font-medium group-hover:text-pink-700 transition-colors">
                                View Reading Lists →
                            </span>
                        </Link>
                    </div>
                </section>

                {/* Curation Standards */}
                <section className="bg-white/50 backdrop-blur-sm py-16">
                    <div className="container-custom">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="section-title text-center mb-8">Our Curation Standards</h2>
                            <div className="card">
                                <p className="text-slate-600 leading-relaxed mb-6">
                                    All resources on this platform are <strong>carefully curated and spiritually responsible</strong>. We take seriously the responsibility of providing content that is:
                                </p>
                                <ul className="space-y-3 text-slate-600">
                                    <li className="flex items-start">
                                        <svg className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span><strong>Biblically sound</strong> - Rooted in Scripture and orthodox Christian theology</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span><strong>Spiritually edifying</strong> - Designed to build up faith and encourage growth</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span><strong>Legally shared</strong> - No pirated or unauthorized content</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span><strong>Student-appropriate</strong> - Relevant and accessible for student life</span>
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span><strong>Grace-centered</strong> - Encouraging without creating guilt or pressure</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured Resources Preview */}
                <section className="container-custom py-16">
                    <h2 className="section-title text-center mb-12">Featured Resources</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="card">
                            <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
                                Devotional
                            </span>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">30-Day Holiday Reset</h3>
                            <p className="text-slate-600 mb-4">
                                A daily devotional guide to help you stay spiritually grounded during the holiday season.
                            </p>
                            <Link href="/resources/materials" className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
                                Read More →
                            </Link>
                        </div>

                        <div className="card">
                            <span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
                                Course
                            </span>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Foundations of Faith</h3>
                            <p className="text-slate-600 mb-4">
                                A 7-lesson course covering the core beliefs of Christianity and how to live them out.
                            </p>
                            <Link href="/resources/courses" className="text-purple-600 font-medium hover:text-purple-700 transition-colors">
                                Start Course →
                            </Link>
                        </div>

                        <div className="card">
                            <span className="inline-block bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium mb-3">
                                Reading
                            </span>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">The Pilgrim&apos;s Progress</h3>
                            <p className="text-slate-600 mb-4">
                                John Bunyan&apos;s classic allegory about the Christian journey, with study questions.
                            </p>
                            <Link href="/resources/books" className="text-pink-600 font-medium hover:text-pink-700 transition-colors">
                                View Details →
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="container-custom py-16">
                    <div className="card bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center p-12">
                        <h2 className="text-3xl font-bold mb-4">Can&apos;t Find What You Need?</h2>
                        <p className="text-lg mb-6 opacity-90">
                            We&apos;re always adding new resources. Let us know what would help you grow.
                        </p>
                        <Link href="/contact" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 inline-block">
                            Send a Suggestion
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
