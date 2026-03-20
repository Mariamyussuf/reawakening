import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "About | Reawakening Ministry",
    description: "Learn about the vision, mission, and purpose of Reawakening - a Christian student ministry focused on spiritual renewal.",
};

// Check icon for lists
const CheckIcon = () => (
    <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
    </svg>
);

export default function AboutPage() {
    return (
        <>
            <Header />
            <main className="font-body">
                {/* Hero */}
                <section className="relative bg-deep py-20 md:py-28 overflow-hidden">
                    {/* Radial gradient */}
                    <div className="absolute inset-0 bg-gradient-radial-gold opacity-20" />
                    <div className="noise-overlay" />

                    <div className="container-page relative z-10 text-center">
                        <p className="eyebrow mb-4">About Us</p>
                        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-cream mb-6">
                            About <span className="italic text-gold">Reawakening</span>
                        </h1>
                        <p className="font-display italic text-xl md:text-2xl text-cream/70 max-w-2xl mx-auto">
                            A meeting set out to thoroughly equip students to be on fire for God
                        </p>
                    </div>
                </section>

                {/* Vision & Mission */}
                <section className="bg-cream py-16 md:py-24">
                    <div className="container-page">
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-warm-white border border-mid/20 rounded-lg p-8 md:p-10 mb-8">
                                <p className="eyebrow mb-4">Our Purpose</p>
                                <h2 className="font-display text-3xl md:text-4xl text-deep mb-6">
                                    Equipping students for a life of <span className="italic text-gold">faith and purpose</span>
                                </h2>
                                <p className="text-deep/80 leading-relaxed mb-4">
                                    Reawakening is a meeting set out to{" "}
                                    <strong>thoroughly equip students</strong> to be on fire for God and{" "}
                                    <strong>effectively nurture them</strong> in preserving their fire and zeal for God{" "}
                                    <strong>both on campus and off campus</strong>.
                                </p>
                            </div>

                            <div className="bg-warm-white border border-mid/20 rounded-lg p-8 md:p-10">
                                <p className="eyebrow mb-4">How We Serve</p>
                                <h3 className="font-display text-2xl text-deep mb-6">What we provide</h3>
                                <ul className="space-y-4 text-deep/80">
                                    <li className="flex items-start gap-3">
                                        <CheckIcon />
                                        <span><strong>Post-exam spiritual renewal</strong> through conferences centered on teaching, prayer, worship, and reflection</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckIcon />
                                        <span><strong>Daily spiritual nourishment</strong> through Bible verses and reflection prompts</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckIcon />
                                        <span><strong>Curated Christian resources</strong> that are spiritually safe and theologically sound</span>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <CheckIcon />
                                        <span><strong>Ongoing support</strong> that complements—never replaces—church life and fellowship</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why Reawakening Was Started */}
                <section className="bg-warm-white py-16 md:py-24">
                    <div className="container-page">
                        <div className="max-w-4xl mx-auto">
                            <p className="eyebrow mb-4 text-center">Our Story</p>
                            <h2 className="font-display text-3xl md:text-4xl text-deep text-center mb-10">
                                Why <span className="italic text-gold">Reawakening?</span>
                            </h2>
                            <div className="space-y-5 text-deep/80 leading-relaxed">
                                <p>
                                    Many students experience a spiritual fire during their time on campus—attending fellowship, Bible studies, and prayer meetings. However, maintaining that fire and zeal for God can be challenging, especially when transitioning between campus life and off-campus periods.
                                </p>
                                <p>
                                    Reawakening was created to provide a <strong>ministry-focused space</strong> where students can:
                                </p>
                                <ul className="space-y-3 text-deep/80 ml-4">
                                    <li className="flex items-start gap-2">
                                        <span className="text-gold">•</span>
                                        <span>Be thoroughly equipped to be on fire for God</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-gold">•</span>
                                        <span>Be effectively nurtured in preserving their fire and zeal for God</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-gold">•</span>
                                        <span>Maintain spiritual consistency both on campus and off campus</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-gold">•</span>
                                        <span>Access resources that encourage growth and spiritual development</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-gold">•</span>
                                        <span>Connect with a community that supports their walk with Christ</span>
                                    </li>
                                </ul>
                                <p>
                                    This is not a startup. It&apos;s not a social platform. It&apos;s a <strong>ministry tool</strong>—a digital extension of the meetings we hold, designed to support students in being equipped and nurtured in their fire for God.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Leadership & Convener */}
                <section className="bg-cream py-16 md:py-24">
                    <div className="container-page">
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-deep rounded-lg p-8 md:p-10 relative overflow-hidden">
                                {/* Decorative quote */}
                                <div className="font-display text-8xl text-gold/10 leading-none absolute top-4 left-6">"</div>

                                <div className="relative z-10">
                                    <p className="text-xs font-medium tracking-[0.15em] uppercase text-gold mb-4">Convener</p>
                                    <div className="mb-6 p-6 bg-deep-2 rounded-lg border border-gold/20">
                                        <p className="font-display text-2xl text-cream mb-1">P. Igbagboyemi Oluwatofunmi Ojo</p>
                                        <p className="text-cream/60">Convener, Reawakening</p>
                                    </div>
                                    <p className="text-cream/70 leading-relaxed mb-6">
                                        Reawakening is <strong className="text-cream">organized, led, and overseen</strong> with spiritual accountability and a heart to see students equipped and nurtured in their walk with God.
                                    </p>
                                    <p className="text-cream/50 text-sm mb-4">The convener is responsible for:</p>
                                    <ul className="space-y-3 text-cream/70">
                                        <li className="flex items-start gap-2">
                                            <span className="text-gold">•</span>
                                            <span>Thoroughly equipping students to be on fire for God</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-gold">•</span>
                                            <span>Effectively nurturing students in preserving their fire and zeal for God</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-gold">•</span>
                                            <span>Maintaining theological and spiritual consistency across all content</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-gold">•</span>
                                            <span>Curating resources that are biblically sound and spiritually edifying</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-gold">•</span>
                                            <span>Planning and facilitating meetings and conferences</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-gold">•</span>
                                            <span>Ensuring the platform supports—not replaces—local church involvement</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Core Values */}
                <section className="bg-warm-white py-16 md:py-24">
                    <div className="container-page">
                        <div className="max-w-4xl mx-auto">
                            <p className="eyebrow mb-4 text-center">What We Believe</p>
                            <h2 className="font-display text-3xl md:text-4xl text-deep text-center mb-12">
                                Our Core <span className="italic text-gold">Values</span>
                            </h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-cream border border-mid/20 rounded-lg p-6">
                                    <h3 className="font-display text-xl text-deep mb-2">Grace-Centered</h3>
                                    <p className="text-deep/70 text-sm leading-relaxed">
                                        We emphasize God&apos;s grace, not performance. Growth is a journey, not a competition.
                                    </p>
                                </div>
                                <div className="bg-cream border border-mid/20 rounded-lg p-6">
                                    <h3 className="font-display text-xl text-deep mb-2">Biblically Grounded</h3>
                                    <p className="text-deep/70 text-sm leading-relaxed">
                                        All teaching, resources, and content are rooted in Scripture and sound theology.
                                    </p>
                                </div>
                                <div className="bg-cream border border-mid/20 rounded-lg p-6">
                                    <h3 className="font-display text-xl text-deep mb-2">Student-Focused</h3>
                                    <p className="text-deep/70 text-sm leading-relaxed">
                                        We understand student life and create resources that fit their unique challenges.
                                    </p>
                                </div>
                                <div className="bg-cream border border-mid/20 rounded-lg p-6">
                                    <h3 className="font-display text-xl text-deep mb-2">Church-Complementary</h3>
                                    <p className="text-deep/70 text-sm leading-relaxed">
                                        We support local church involvement and never seek to replace fellowship or discipleship.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Closing Statement */}
                <section className="relative bg-deep py-16 md:py-24 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-radial-gold opacity-20" />

                    <div className="container-page relative z-10 text-center">
                        <blockquote className="font-display italic text-2xl md:text-3xl text-cream/90 leading-relaxed max-w-3xl mx-auto mb-6">
                            &quot;Reawakening exists to thoroughly equip you to be on fire for God and effectively nurture you in preserving your fire and zeal for God—both on campus and off campus.&quot;
                        </blockquote>
                        <p className="text-gold font-medium">
                            — P. Igbagboyemi Oluwatofunmi Ojo, Convener
                        </p>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="bg-cream py-16 md:py-20">
                    <div className="container-page text-center">
                        <p className="eyebrow mb-4">Get Started</p>
                        <h2 className="font-display text-3xl md:text-4xl text-deep mb-6">
                            Ready to join the <span className="italic text-gold">movement?</span>
                        </h2>
                        <p className="text-deep/70 max-w-lg mx-auto mb-8">
                            Explore our resources, register for the upcoming conference, or connect with our community.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link href="/hub" className="btn-primary">
                                Explore the Hub
                            </Link>
                            <Link href="/conference" className="btn-outline">
                                Register for Conference
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
