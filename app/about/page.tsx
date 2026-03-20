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
                <section className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-20">
                    <div className="container-custom text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">About Reawakening</h1>
                        <p className="text-xl opacity-90 max-w-2xl mx-auto">
                            A meeting set out to thoroughly equip students to be on fire for God
                        </p>
                    </div>
                </section>

                {/* Vision & Mission */}
                <section className="container-custom py-16">
                    <div className="max-w-4xl mx-auto">
                        <div className="card mb-8">
                            <h2 className="text-3xl font-bold text-slate-800 mb-4">Our Purpose</h2>
                            <p className="text-lg text-slate-600 leading-relaxed mb-4">
                                Reawakening is a meeting set out to{" "}
                                <span className="font-semibold text-emerald-600">thoroughly equip students</span> to be on fire for God and{" "}
                                <span className="font-semibold text-emerald-600">effectively nurture them</span> in preserving their fire and zeal for God{" "}
                                <span className="font-semibold text-emerald-600">both on campus and off campus</span>.
                            </p>
                        </div>

                        <div className="card mb-8">
                            <h2 className="text-3xl font-bold text-slate-800 mb-4">How We Serve</h2>
                            <p className="text-lg text-slate-600 leading-relaxed mb-4">
                                Reawakening provides students with:
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
                                    Many students experience a spiritual fire during their time on campus—attending fellowship, Bible studies, and prayer meetings. However, maintaining that fire and zeal for God can be challenging, especially when transitioning between campus life and off-campus periods.
                                </p>
                                <p className="text-slate-600 leading-relaxed mb-4">
                                    Reawakening was created to provide a <strong>ministry-focused space</strong> where students can:
                                </p>
                                <ul className="space-y-2 text-slate-600 mb-4">
                                    <li>Be thoroughly equipped to be on fire for God</li>
                                    <li>Be effectively nurtured in preserving their fire and zeal for God</li>
                                    <li>Maintain spiritual consistency both on campus and off campus</li>
                                    <li>Access resources that encourage growth and spiritual development</li>
                                    <li>Connect with a community that supports their walk with Christ</li>
                                </ul>
                                <p className="text-slate-600 leading-relaxed">
                                    This is not a startup. It&apos;s not a social platform. It&apos;s a <strong>ministry tool</strong>—a digital extension of the meetings we hold, designed to support students in being equipped and nurtured in their fire for God.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Leadership & Convener */}
                <section className="container-custom py-16">
                    <div className="max-w-4xl mx-auto">
                        <div className="card">
                            <h2 className="text-3xl font-bold text-slate-800 mb-4">Convener</h2>
                            <div className="mb-6 p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
                                <p className="text-2xl font-bold text-slate-900 mb-2">P. Igbagboyemi Oluwatofunmi Ojo</p>
                                <p className="text-lg text-slate-600">Convener, Reawakening</p>
                            </div>
                            <p className="text-lg text-slate-600 leading-relaxed mb-4">
                                Reawakening is <strong>organized, led, and overseen</strong> with spiritual accountability and a heart to see students equipped and nurtured in their walk with God.
                            </p>
                            <p className="text-slate-600 leading-relaxed mb-4">
                                The convener is responsible for:
                            </p>
                            <ul className="space-y-2 text-slate-600">
                                <li className="flex items-start">
                                    <span className="text-emerald-600 mr-2">•</span>
                                    <span>Thoroughly equipping students to be on fire for God</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-emerald-600 mr-2">•</span>
                                    <span>Effectively nurturing students in preserving their fire and zeal for God</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-emerald-600 mr-2">•</span>
                                    <span>Maintaining theological and spiritual consistency across all content</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-emerald-600 mr-2">•</span>
                                    <span>Curating resources that are biblically sound and spiritually edifying</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-emerald-600 mr-2">•</span>
                                    <span>Planning and facilitating meetings and conferences</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-emerald-600 mr-2">•</span>
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
                <section className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-16">
                    <div className="container-custom text-center">
                        <blockquote className="text-2xl md:text-3xl font-serif italic leading-relaxed max-w-3xl mx-auto">
                            &quot;Reawakening exists to thoroughly equip you to be on fire for God and effectively nurture you in preserving your fire and zeal for God—both on campus and off campus.&quot;
                        </blockquote>
                        <p className="mt-6 text-lg opacity-90">
                            — P. Igbagboyemi Oluwatofunmi Ojo, Convener
                        </p>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
