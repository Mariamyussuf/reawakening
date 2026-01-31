import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "About | Reawakening Ministry",
    description: "Learn about the vision, mission, and purpose of Reawakening - a Christian student ministry focused on spiritual renewal.",
};

export default function AboutPage() {
    return (
        <>
            <Header />
            <main className="min-h-screen">
                {/* Hero */}
                <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
                    <div className="container-custom text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">About Reawakening</h1>
                        <p className="text-xl opacity-90 max-w-2xl mx-auto">
                            A ministry born from a desire to help students stay spiritually grounded
                        </p>
                    </div>
                </section>

                {/* Vision & Mission */}
                <section className="container-custom py-16">
                    <div className="max-w-4xl mx-auto">
                        <div className="card mb-8">
                            <h2 className="text-3xl font-bold text-slate-800 mb-4">Our Vision</h2>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                To see students maintain spiritual discipline, clarity, and growth during holiday periods—remaining rooted in Christ even when the structure of school life fades away.
                            </p>
                        </div>

                        <div className="card mb-8">
                            <h2 className="text-3xl font-bold text-slate-800 mb-4">Our Mission</h2>
                            <p className="text-lg text-slate-600 leading-relaxed mb-4">
                                Reawakening exists to provide students with:
                            </p>
                            <ul className="space-y-3 text-slate-600">
                                <li className="flex items-start">
                                    <svg className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span><strong>Post-exam spiritual renewal</strong> through conferences centered on teaching, prayer, worship, and reflection</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span><strong>Daily spiritual nourishment</strong> through Bible verses and reflection prompts</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span><strong>Curated Christian resources</strong> that are spiritually safe and theologically sound</span>
                                </li>
                                <li className="flex items-start">
                                    <svg className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span><strong>Ongoing support</strong> that complements—never replaces—church life and fellowship</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Why Reawakening Was Started */}
                <section className="bg-white/50 backdrop-blur-sm py-16">
                    <div className="container-custom">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="section-title text-center mb-8">Why Reawakening?</h2>
                            <div className="prose prose-lg max-w-none">
                                <p className="text-slate-600 leading-relaxed mb-4">
                                    Many students experience a spiritual high during the school year—attending fellowship, Bible studies, and prayer meetings. But when exams end and holidays begin, that structure often disappears.
                                </p>
                                <p className="text-slate-600 leading-relaxed mb-4">
                                    Reawakening was born from observing this pattern and wanting to provide a <strong>grace-centered, ministry-focused space</strong> where students can:
                                </p>
                                <ul className="space-y-2 text-slate-600 mb-4">
                                    <li>Reflect on what God has done during the semester</li>
                                    <li>Reset spiritually before returning to school</li>
                                    <li>Build habits of consistency in Scripture and prayer</li>
                                    <li>Access resources that encourage growth without guilt or performance pressure</li>
                                </ul>
                                <p className="text-slate-600 leading-relaxed">
                                    This is not a startup. It&apos;s not a social platform. It&apos;s a <strong>ministry tool</strong>—a digital extension of the conferences we hold, designed to support students in their walk with Christ.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Leadership & Oversight */}
                <section className="container-custom py-16">
                    <div className="max-w-4xl mx-auto">
                        <div className="card">
                            <h2 className="text-3xl font-bold text-slate-800 mb-4">Leadership & Oversight</h2>
                            <p className="text-lg text-slate-600 leading-relaxed mb-4">
                                Reawakening is <strong>organized, led, and overseen by an individual</strong> with spiritual accountability. This is not a corporate venture or a committee-run organization.
                            </p>
                            <p className="text-slate-600 leading-relaxed mb-4">
                                The overseer is responsible for:
                            </p>
                            <ul className="space-y-2 text-slate-600">
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">•</span>
                                    <span>Maintaining theological and spiritual consistency across all content</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">•</span>
                                    <span>Curating resources that are biblically sound and spiritually edifying</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">•</span>
                                    <span>Planning and facilitating post-exam conferences</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-blue-600 mr-2">•</span>
                                    <span>Ensuring the platform supports—not replaces—local church involvement</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Core Values */}
                <section className="container-custom py-16">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="section-title text-center mb-12">Our Core Values</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="card">
                                <h3 className="text-xl font-bold text-slate-800 mb-2">Grace-Centered</h3>
                                <p className="text-slate-600">
                                    We emphasize God&apos;s grace, not performance. Growth is a journey, not a competition.
                                </p>
                            </div>
                            <div className="card">
                                <h3 className="text-xl font-bold text-slate-800 mb-2">Biblically Grounded</h3>
                                <p className="text-slate-600">
                                    All teaching, resources, and content are rooted in Scripture and sound theology.
                                </p>
                            </div>
                            <div className="card">
                                <h3 className="text-xl font-bold text-slate-800 mb-2">Student-Focused</h3>
                                <p className="text-slate-600">
                                    We understand student life and create resources that fit their unique challenges.
                                </p>
                            </div>
                            <div className="card">
                                <h3 className="text-xl font-bold text-slate-800 mb-2">Church-Complementary</h3>
                                <p className="text-slate-600">
                                    We support local church involvement and never seek to replace fellowship or discipleship.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Closing Statement */}
                <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
                    <div className="container-custom text-center">
                        <blockquote className="text-2xl md:text-3xl font-serif italic leading-relaxed max-w-3xl mx-auto">
                            &quot;This platform exists to help you stay grounded in Christ—not through guilt or pressure, but through grace, truth, and community.&quot;
                        </blockquote>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
