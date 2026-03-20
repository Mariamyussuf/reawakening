import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Resources | Reawakening Ministry",
    description: "Access curated Christian resources including devotionals, courses, prayer guides, and reading materials.",
};

// Icons
const MaterialsIcon = () => (
    <svg className="w-8 h-8 text-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const CoursesIcon = () => (
    <svg className="w-8 h-8 text-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const BooksIcon = () => (
    <svg className="w-8 h-8 text-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const CheckIcon = () => (
    <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
    </svg>
);

export default function ResourcesPage() {
    return (
        <>
            <Header />
            <main className="font-body">
                {/* Hero */}
                <section className="relative bg-deep py-20 md:py-28 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-radial-gold opacity-20" />
                    <div className="noise-overlay" />

                    <div className="container-page relative z-10 text-center">
                        <p className="eyebrow mb-4">Library</p>
                        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-cream mb-6">
                            <span className="italic text-gold">Resources</span>
                        </h1>
                        <p className="font-display italic text-xl md:text-2xl text-cream/70 max-w-2xl mx-auto">
                            Carefully curated Christian materials to support your spiritual growth
                        </p>
                    </div>
                </section>

                {/* Resource Categories */}
                <section className="bg-cream py-16 md:py-24">
                    <div className="container-page">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Materials */}
                            <Link href="/resources/materials" className="offering-card card-hover group block bg-warm-white">
                                <div className="w-14 h-14 bg-gold/10 rounded-xl flex items-center justify-center mb-5">
                                    <MaterialsIcon />
                                </div>
                                <h2 className="font-display text-2xl text-deep mb-3 group-hover:text-gold transition-colors">Materials</h2>
                                <p className="text-deep/70 text-sm leading-relaxed mb-4">
                                    Devotionals, prayer guides, study outlines, and holiday reset plans to help you stay grounded.
                                </p>
                                <span className="inline-flex items-center gap-1 text-sm font-medium text-gold group-hover:gap-2 transition-all">
                                    Browse Materials <span>→</span>
                                </span>
                            </Link>

                            {/* Courses */}
                            <Link href="/resources/courses" className="offering-card card-hover group block bg-warm-white">
                                <div className="w-14 h-14 bg-gold/10 rounded-xl flex items-center justify-center mb-5">
                                    <CoursesIcon />
                                </div>
                                <h2 className="font-display text-2xl text-deep mb-3 group-hover:text-gold transition-colors">Courses</h2>
                                <p className="text-deep/70 text-sm leading-relaxed mb-4">
                                    Lesson-based teachings on key topics. Text-first, low-data, and completely free with progress tracking.
                                </p>
                                <span className="inline-flex items-center gap-1 text-sm font-medium text-gold group-hover:gap-2 transition-all">
                                    Explore Courses <span>→</span>
                                </span>
                            </Link>

                            {/* Books & Reading */}
                            <Link href="/resources/books" className="offering-card card-hover group block bg-warm-white">
                                <div className="w-14 h-14 bg-gold/10 rounded-xl flex items-center justify-center mb-5">
                                    <BooksIcon />
                                </div>
                                <h2 className="font-display text-2xl text-deep mb-3 group-hover:text-gold transition-colors">Books & Reading</h2>
                                <p className="text-deep/70 text-sm leading-relaxed mb-4">
                                    Curated Christian reading lists, public-domain classics, and book summaries with reflection questions.
                                </p>
                                <span className="inline-flex items-center gap-1 text-sm font-medium text-gold group-hover:gap-2 transition-all">
                                    View Reading Lists <span>→</span>
                                </span>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Curation Standards */}
                <section className="bg-warm-white py-16 md:py-24">
                    <div className="container-page">
                        <div className="max-w-4xl mx-auto">
                            <p className="eyebrow mb-4 text-center">Quality</p>
                            <h2 className="font-display text-3xl md:text-4xl text-deep text-center mb-10">
                                Our Curation <span className="italic text-gold">Standards</span>
                            </h2>
                            <div className="bg-cream border border-mid/20 rounded-lg p-8 md:p-10">
                                <p className="text-deep/80 leading-relaxed mb-6">
                                    All resources on this platform are <strong>carefully curated and spiritually responsible</strong>. We take seriously the responsibility of providing content that is:
                                </p>
                                <ul className="space-y-4 text-deep/70">
                                    <li className="flex items-start gap-3">
                                        <CheckIcon />
                                        <span><strong>Biblically sound</strong> - Rooted in Scripture and orthodox Christian theology</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckIcon />
                                        <span><strong>Spiritually edifying</strong> - Designed to build up faith and encourage growth</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckIcon />
                                        <span><strong>Legally shared</strong> - No pirated or unauthorized content</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckIcon />
                                        <span><strong>Student-appropriate</strong> - Relevant and accessible for student life</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckIcon />
                                        <span><strong>Grace-centered</strong> - Encouraging without creating guilt or pressure</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Featured Resources Preview */}
                <section className="bg-cream py-16 md:py-24">
                    <div className="container-page">
                        <p className="eyebrow mb-4 text-center">Highlights</p>
                        <h2 className="font-display text-3xl md:text-4xl text-deep text-center mb-12">
                            Featured <span className="italic text-gold">Resources</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-warm-white border border-mid/20 rounded-lg p-6">
                                <span className="inline-block bg-gold/10 text-gold px-3 py-1 rounded-full text-xs font-medium tracking-wide uppercase mb-4">
                                    Devotional
                                </span>
                                <h3 className="font-display text-xl text-deep mb-3">30-Day Holiday Reset</h3>
                                <p className="text-deep/70 text-sm leading-relaxed mb-4">
                                    A daily devotional guide to help you stay spiritually grounded during the holiday season.
                                </p>
                                <Link href="/resources/materials" className="text-gold font-medium hover:text-gold-dark transition-colors text-sm">
                                    Read More →
                                </Link>
                            </div>

                            <div className="bg-warm-white border border-mid/20 rounded-lg p-6">
                                <span className="inline-block bg-gold/10 text-gold px-3 py-1 rounded-full text-xs font-medium tracking-wide uppercase mb-4">
                                    Course
                                </span>
                                <h3 className="font-display text-xl text-deep mb-3">Foundations of Faith</h3>
                                <p className="text-deep/70 text-sm leading-relaxed mb-4">
                                    A 7-lesson course covering the core beliefs of Christianity and how to live them out.
                                </p>
                                <Link href="/resources/courses" className="text-gold font-medium hover:text-gold-dark transition-colors text-sm">
                                    Start Course →
                                </Link>
                            </div>

                            <div className="bg-warm-white border border-mid/20 rounded-lg p-6">
                                <span className="inline-block bg-gold/10 text-gold px-3 py-1 rounded-full text-xs font-medium tracking-wide uppercase mb-4">
                                    Reading
                                </span>
                                <h3 className="font-display text-xl text-deep mb-3">The Pilgrim&apos;s Progress</h3>
                                <p className="text-deep/70 text-sm leading-relaxed mb-4">
                                    John Bunyan&apos;s classic allegory about the Christian journey, with study questions.
                                </p>
                                <Link href="/resources/books" className="text-gold font-medium hover:text-gold-dark transition-colors text-sm">
                                    View Details →
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="relative bg-deep py-16 md:py-24 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-radial-gold opacity-20" />

                    <div className="container-page relative z-10">
                        <div className="max-w-2xl mx-auto text-center">
                            <h2 className="font-display text-3xl md:text-4xl text-cream mb-4">
                                Can&apos;t Find What You <span className="italic text-gold">Need?</span>
                            </h2>
                            <p className="text-cream/70 mb-8">
                                We&apos;re always adding new resources. Let us know what would help you grow.
                            </p>
                            <Link href="/contact" className="btn-primary inline-block">
                                Send a Suggestion
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
