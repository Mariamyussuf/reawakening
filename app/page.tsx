import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Home() {
    return (
        <>
            <Header />
            <main className="relative overflow-hidden">
                {/* Floating Background Elements */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }}></div>
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-sky-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }}></div>
                    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-teal-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }}></div>
                </div>

                {/* Hero Section */}
                <section className="relative container-custom py-24 md:py-36">
                    <div className="text-center max-w-5xl mx-auto relative z-10">
                        <div className="inline-block mb-6 px-6 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full border border-emerald-200/50 shadow-sm">
                            <p className="text-sm font-semibold text-emerald-700 flex items-center gap-2">
                                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                                Christian Student Ministry
                            </p>
                        </div>

                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight">
                            Welcome to <br />
                            <span className="gradient-text inline-block mt-2">Reawakening</span>
                        </h1>

                        <p className="text-xl md:text-2xl lg:text-3xl text-slate-600 mb-12 leading-relaxed max-w-4xl mx-auto font-light">
                            A transformative journey of <span className="font-semibold text-emerald-600">spiritual renewal</span> and <span className="font-semibold text-emerald-600">growth</span> for students during post-exam periods
                        </p>

                        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                            <Link href="/hub" className="btn-primary group">
                                <span className="flex items-center gap-2">
                                    Enter Member Hub
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </span>
                            </Link>
                            <Link href="/conference" className="btn-secondary">
                                Register for Conference
                            </Link>
                            <Link href="/daily-verse" className="btn-secondary">
                                Today&apos;s Verse
                            </Link>
                        </div>

                        {/* Stats */}
                        <div className="mt-20 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
                            <div className="text-center">
                                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">500+</div>
                                <div className="text-sm md:text-base text-slate-600">Active Members</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">12</div>
                                <div className="text-sm md:text-base text-slate-600">Conferences Held</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">24/7</div>
                                <div className="text-sm md:text-base text-slate-600">Support Available</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* What is Reawakening */}
                <section className="relative py-24 bg-gradient-to-b from-white/50 to-transparent backdrop-blur-sm">
                    <div className="container-custom">
                        <div className="max-w-4xl mx-auto">
                            <div className="card-premium text-center">
                                <div className="relative z-10">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg mb-6">
                                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>

                                    <h2 className="section-title mb-6">What is Reawakening?</h2>

                                    <p className="text-xl md:text-2xl text-slate-700 mb-6 leading-relaxed">
                                        A <span className="font-bold gradient-text">Christian ministry program</span> designed to help students maintain spiritual discipline and clarity during holiday periods.
                                    </p>

                                    <div className="divider"></div>

                                    <p className="text-lg text-slate-600 leading-relaxed">
                                        After every exam period, we gather for a post-exam conference centered on <span className="font-semibold text-emerald-600">teaching</span>, <span className="font-semibold text-emerald-600">prayer</span>, <span className="font-semibold text-emerald-600">worship</span>, and <span className="font-semibold text-emerald-600">reflection</span>. This platform extends that impact by providing ongoing spiritual support, curated resources, and daily encouragement.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="relative container-custom py-24">
                    <div className="text-center mb-16">
                        <h2 className="section-title mb-4">How We Support You</h2>
                        <p className="section-subtitle mx-auto">
                            Comprehensive resources and community support for your spiritual journey
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Conference */}
                        <div className="card-glass group hover:scale-105 cursor-pointer">
                            <div className="icon-container bg-gradient-to-br from-emerald-500 to-green-600 mb-6 group-hover:scale-110 group-hover:rotate-3">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">Post-Exam Conferences</h3>
                            <p className="text-slate-600 mb-6 leading-relaxed">
                                Join us after every exam period for teaching, prayer, worship, and spiritual renewal in a vibrant community setting.
                            </p>
                            <Link href="/conference" className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700 transition-colors group-hover:gap-3">
                                Learn More
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>

                        {/* Daily Verse */}
                        <div className="card-glass group hover:scale-105 cursor-pointer">
                            <div className="icon-container bg-gradient-to-br from-sky-500 to-blue-600 mb-6 group-hover:scale-110 group-hover:rotate-3">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">Daily Bible Verses</h3>
                            <p className="text-slate-600 mb-6 leading-relaxed">
                                Build consistency with daily Scripture and gentle streak tracking that encourages spiritual growth and discipline.
                            </p>
                            <Link href="/daily-verse" className="inline-flex items-center gap-2 text-sky-600 font-semibold hover:text-sky-700 transition-colors group-hover:gap-3">
                                Start Today
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>

                        {/* Resources */}
                        <div className="card-glass group hover:scale-105 cursor-pointer">
                            <div className="icon-container bg-gradient-to-br from-violet-500 to-purple-600 mb-6 group-hover:scale-110 group-hover:rotate-3">
                                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-3">Curated Resources</h3>
                            <p className="text-slate-600 mb-6 leading-relaxed">
                                Access devotionals, courses, prayer guides, and Christian reading materials carefully selected for your journey.
                            </p>
                            <Link href="/resources" className="inline-flex items-center gap-2 text-violet-600 font-semibold hover:text-violet-700 transition-colors group-hover:gap-3">
                                Explore Resources
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="relative container-custom py-24">
                    <div className="relative overflow-hidden card-premium text-center p-16 md:p-20">
                        {/* Animated Background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 opacity-95"></div>
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAtMjBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>

                        <div className="relative z-10 text-white">
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Ready to Begin?</h2>
                            <p className="text-xl md:text-2xl mb-12 opacity-95 max-w-2xl mx-auto leading-relaxed">
                                Join us in pursuing spiritual growth, renewal, and a deeper relationship with God
                            </p>
                            <div className="flex flex-col sm:flex-row gap-5 justify-center">
                                <Link href="/conference" className="bg-white text-emerald-600 px-10 py-4 rounded-xl font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 hover:bg-emerald-50">
                                    Register for Conference
                                </Link>
                                <Link href="/about" className="bg-white/10 backdrop-blur-md text-white px-10 py-4 rounded-xl font-bold border-2 border-white/50 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                                    Learn More About Us
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Spiritual Emphasis */}
                <section className="relative container-custom py-24">
                    <div className="max-w-4xl mx-auto">
                        <div className="card-glass text-center p-12 md:p-16">
                            <div className="mb-8">
                                <svg className="w-12 h-12 text-emerald-600 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                </svg>
                            </div>
                            <blockquote className="text-2xl md:text-3xl lg:text-4xl text-slate-800 leading-relaxed font-light">
                                A spiritually healthy extension of a student ministry, overseen with care, created to help students remain <span className="font-bold gradient-text">grounded</span> after exams.
                            </blockquote>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
