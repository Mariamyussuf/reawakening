import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Archive | Reawakening Ministry",
    description: "Explore past Reawakening conferences, teachings, and materials from previous editions.",
};

export default function ArchivePage() {
    // This would typically come from a CMS or database
    const pastConferences = [
        {
            id: 1,
            year: "2025",
            period: "December - Post-Semester Exams",
            theme: "Rooted & Grounded",
            summary: "A powerful time of returning to the foundations of faith after a challenging semester.",
            materials: [
                "Opening Session: The Importance of Spiritual Roots",
                "Workshop: Building Consistent Prayer Habits",
                "Closing Message: Standing Firm in Christ",
            ],
            prayerPoints: [
                "Thanksgiving for God's faithfulness through the semester",
                "Strength to maintain spiritual discipline during holidays",
                "Wisdom for the new year ahead",
            ],
            devotionals: "14-Day Devotional: Rooted in Christ",
        },
        {
            id: 2,
            year: "2025",
            period: "July - Mid-Year Break",
            theme: "Renewed Vision",
            summary: "Helping students reset spiritually at the midpoint of the year and refocus on God's purpose.",
            materials: [
                "Teaching: Seeing with Spiritual Eyes",
                "Panel Discussion: Balancing Faith and Academics",
                "Worship Night: Encountering God's Presence",
            ],
            prayerPoints: [
                "Clarity of purpose for the second half of the year",
                "Healing from burnout and exhaustion",
                "Renewed passion for Christ",
            ],
            devotionals: "7-Day Reset: Renewing Your Mind",
        },
        {
            id: 3,
            year: "2024",
            period: "December - Post-Semester Exams",
            theme: "Anchored in Hope",
            summary: "Our first Reawakening conference, focused on finding hope and stability in Christ during transitions.",
            materials: [
                "Foundational Teaching: What is Hope?",
                "Testimony Session: Stories of God's Faithfulness",
                "Practical Workshop: Spiritual Disciplines for Holidays",
            ],
            prayerPoints: [
                "Hope in uncertain times",
                "Strength to overcome spiritual dryness",
                "Community and accountability during breaks",
            ],
            devotionals: "10-Day Journey: Hope in Christ",
        },
    ];

    return (
        <>
            <Header />
            <main className="min-h-screen">
                {/* Hero */}
                <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
                    <div className="container-custom text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Conference Archive</h1>
                        <p className="text-xl opacity-90 max-w-2xl mx-auto">
                            Explore the spiritual legacy of past Reawakening conferences
                        </p>
                    </div>
                </section>

                {/* Introduction */}
                <section className="container-custom py-16">
                    <div className="max-w-3xl mx-auto text-center">
                        <p className="text-lg text-slate-600 leading-relaxed">
                            Each Reawakening conference represents a season of spiritual renewal. This archive preserves the teachings,
                            prayer points, and devotionals from past editions, allowing you to revisit God&apos;s faithfulness and continue
                            learning from previous gatherings.
                        </p>
                    </div>
                </section>

                {/* Archive Timeline */}
                <section className="container-custom py-16">
                    <div className="max-w-4xl mx-auto space-y-8">
                        {pastConferences.map((conference, index) => (
                            <div key={conference.id} className="card hover:shadow-xl transition-all duration-300">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium mb-2">
                                            {conference.period}
                                        </span>
                                        <h2 className="text-3xl font-bold text-slate-800">{conference.theme}</h2>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-4xl font-bold text-blue-600">{conference.year}</div>
                                    </div>
                                </div>

                                <p className="text-slate-600 leading-relaxed mb-6">
                                    {conference.summary}
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    {/* Materials */}
                                    <div>
                                        <h3 className="font-bold text-slate-800 mb-3 flex items-center">
                                            <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            Teaching Materials
                                        </h3>
                                        <ul className="space-y-2">
                                            {conference.materials.map((material, idx) => (
                                                <li key={idx} className="text-slate-600 text-sm flex items-start">
                                                    <span className="text-blue-600 mr-2">•</span>
                                                    <span>{material}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Prayer Points */}
                                    <div>
                                        <h3 className="font-bold text-slate-800 mb-3 flex items-center">
                                            <svg className="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            Prayer Points
                                        </h3>
                                        <ul className="space-y-2">
                                            {conference.prayerPoints.map((point, idx) => (
                                                <li key={idx} className="text-slate-600 text-sm flex items-start">
                                                    <span className="text-purple-600 mr-2">•</span>
                                                    <span>{point}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Devotional */}
                                <div className="border-t border-slate-200 pt-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <svg className="w-5 h-5 text-pink-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                            <span className="font-medium text-slate-700">{conference.devotionals}</span>
                                        </div>
                                        <button className="text-blue-600 font-medium hover:text-blue-700 transition-colors">
                                            Download Materials →
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Legacy Statement */}
                <section className="bg-white/50 backdrop-blur-sm py-16">
                    <div className="container-custom">
                        <div className="max-w-3xl mx-auto text-center">
                            <h2 className="section-title mb-6">A Spiritual Legacy</h2>
                            <p className="text-lg text-slate-600 leading-relaxed mb-4">
                                Each conference builds on the last, creating a legacy of spiritual growth and renewal. As you explore
                                this archive, you&apos;ll see how God has been faithful through every season, every theme, and every gathering.
                            </p>
                            <p className="text-slate-600 leading-relaxed">
                                These materials remain available because God&apos;s truth is timeless. What He spoke in one season can still
                                minister to you today.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="container-custom py-16">
                    <div className="card bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center p-12">
                        <h2 className="text-3xl font-bold mb-4">Be Part of the Next Chapter</h2>
                        <p className="text-lg mb-6 opacity-90">
                            Join us for the next Reawakening conference and add your story to this legacy
                        </p>
                        <a href="/conference" className="bg-white text-blue-600 px-8 py-3 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 inline-block">
                            View Upcoming Conference
                        </a>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
