import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Conference | Reawakening Ministry",
    description: "Join us for our next post-exam conference focused on spiritual renewal, teaching, prayer, and worship.",
};

// Icons
const CalendarIcon = () => (
    <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

const ClockIcon = () => (
    <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const LocationIcon = () => (
    <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const TicketIcon = () => (
    <svg className="w-6 h-6 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
    </svg>
);

const BookIcon = () => (
    <svg className="w-6 h-6 text-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
);

const PrayerIcon = () => (
    <svg className="w-6 h-6 text-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const WorshipIcon = () => (
    <svg className="w-6 h-6 text-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
    </svg>
);

const FellowshipIcon = () => (
    <svg className="w-6 h-6 text-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

export default function ConferencePage() {
    // This would typically come from a CMS or database
    const upcomingConference = {
        theme: "Anchored in Hope",
        date: "March 15-16, 2026",
        time: "9:00 AM - 5:00 PM",
        venue: "Community Hall, Campus Center",
        isOnline: false,
        registrationOpen: true,
    };

    return (
        <>
            <Header />
            <main className="font-body">
                {/* Hero */}
                <section className="relative bg-deep py-20 md:py-28 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-radial-gold opacity-20" />
                    <div className="noise-overlay" />

                    <div className="container-page relative z-10 text-center">
                        <p className="eyebrow mb-4">Annual Gathering</p>
                        <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-cream mb-6">
                            Reawakening <span className="italic text-gold">Conference</span>
                        </h1>
                        <p className="font-display italic text-xl md:text-2xl text-cream/70 max-w-2xl mx-auto">
                            Post-exam spiritual renewal through teaching, prayer, worship, and reflection
                        </p>
                    </div>
                </section>

                {/* Upcoming Conference */}
                {upcomingConference.registrationOpen ? (
                    <section className="bg-cream py-16 md:py-24">
                        <div className="container-page">
                            <div className="max-w-4xl mx-auto">
                                <div className="bg-deep border border-gold/20 rounded-lg p-8 md:p-12">
                                    <div className="text-center mb-10">
                                        <span className="inline-block bg-gold/20 text-gold px-4 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase mb-4">
                                            Upcoming Conference
                                        </span>
                                        <h2 className="font-display text-4xl md:text-5xl text-cream mb-3">{upcomingConference.theme}</h2>
                                        <p className="text-cream/60">Join us for a time of spiritual renewal and growth</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                                        <div className="flex items-start space-x-4 bg-deep-2 rounded-lg p-4 border border-gold/10">
                                            <CalendarIcon />
                                            <div>
                                                <h3 className="font-display text-lg text-cream">Date</h3>
                                                <p className="text-cream/60">{upcomingConference.date}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4 bg-deep-2 rounded-lg p-4 border border-gold/10">
                                            <ClockIcon />
                                            <div>
                                                <h3 className="font-display text-lg text-cream">Time</h3>
                                                <p className="text-cream/60">{upcomingConference.time}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4 bg-deep-2 rounded-lg p-4 border border-gold/10">
                                            <LocationIcon />
                                            <div>
                                                <h3 className="font-display text-lg text-cream">Venue</h3>
                                                <p className="text-cream/60">{upcomingConference.venue}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-4 bg-deep-2 rounded-lg p-4 border border-gold/10">
                                            <TicketIcon />
                                            <div>
                                                <h3 className="font-display text-lg text-cream">Cost</h3>
                                                <p className="text-cream/60">Free (Registration Required)</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <a href="#registration" className="btn-primary inline-block">
                                            Register Now
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                ) : (
                    <section className="bg-cream py-16 md:py-24">
                        <div className="container-page">
                            <div className="max-w-2xl mx-auto text-center bg-warm-white border border-mid/20 rounded-lg p-10 md:p-12">
                                <svg className="w-16 h-16 text-mid/40 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <h2 className="font-display text-3xl text-deep mb-3">No Upcoming Conference</h2>
                                <p className="text-deep/70 mb-6">
                                    We&apos;ll announce our next conference soon. Check back here or subscribe to our updates.
                                </p>
                                <a href="/contact" className="btn-outline inline-block">
                                    Stay Updated
                                </a>
                            </div>
                        </div>
                    </section>
                )}

                {/* What to Expect */}
                <section className="bg-warm-white py-16 md:py-24">
                    <div className="container-page">
                        <div className="max-w-4xl mx-auto">
                            <p className="eyebrow mb-4 text-center">Experience</p>
                            <h2 className="font-display text-3xl md:text-4xl text-deep text-center mb-12">
                                What to <span className="italic text-gold">Expect</span>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-cream border border-mid/20 rounded-lg p-6">
                                    <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center mb-4">
                                        <BookIcon />
                                    </div>
                                    <h3 className="font-display text-xl text-deep mb-2">Biblical Teaching</h3>
                                    <p className="text-deep/70 text-sm leading-relaxed">
                                        In-depth sessions focused on Scripture, helping you understand and apply God&apos;s Word to your life.
                                    </p>
                                </div>

                                <div className="bg-cream border border-mid/20 rounded-lg p-6">
                                    <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center mb-4">
                                        <PrayerIcon />
                                    </div>
                                    <h3 className="font-display text-xl text-deep mb-2">Prayer & Reflection</h3>
                                    <p className="text-deep/70 text-sm leading-relaxed">
                                        Dedicated time for personal and corporate prayer, seeking God&apos;s direction for the season ahead.
                                    </p>
                                </div>

                                <div className="bg-cream border border-mid/20 rounded-lg p-6">
                                    <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center mb-4">
                                        <WorshipIcon />
                                    </div>
                                    <h3 className="font-display text-xl text-deep mb-2">Worship</h3>
                                    <p className="text-deep/70 text-sm leading-relaxed">
                                        Spirit-led worship that creates space for encounter with God and heartfelt praise.
                                    </p>
                                </div>

                                <div className="bg-cream border border-mid/20 rounded-lg p-6">
                                    <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center mb-4">
                                        <FellowshipIcon />
                                    </div>
                                    <h3 className="font-display text-xl text-deep mb-2">Fellowship</h3>
                                    <p className="text-deep/70 text-sm leading-relaxed">
                                        Connect with other students who share your desire to grow in faith and stay grounded.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Registration Form */}
                {upcomingConference.registrationOpen && (
                    <section id="registration" className="bg-cream py-16 md:py-24">
                        <div className="container-page">
                            <div className="max-w-2xl mx-auto">
                                <div className="bg-warm-white border border-mid/20 rounded-lg p-8 md:p-10">
                                    <p className="eyebrow mb-2 text-center">Registration</p>
                                    <h2 className="font-display text-3xl md:text-4xl text-deep mb-8 text-center">
                                        Register for the <span className="italic text-gold">Conference</span>
                                    </h2>
                                    <form className="space-y-6">
                                        <div>
                                            <label htmlFor="name" className="block text-xs font-medium tracking-wide text-deep/70 mb-2 uppercase">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                required
                                                className="w-full px-4 py-3 rounded border border-mid/30 bg-cream text-deep text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all placeholder:text-mid/50"
                                                placeholder="John Doe"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-xs font-medium tracking-wide text-deep/70 mb-2 uppercase">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                required
                                                className="w-full px-4 py-3 rounded border border-mid/30 bg-cream text-deep text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all placeholder:text-mid/50"
                                                placeholder="john@example.com"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="phone" className="block text-xs font-medium tracking-wide text-deep/70 mb-2 uppercase">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                className="w-full px-4 py-3 rounded border border-mid/30 bg-cream text-deep text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all placeholder:text-mid/50"
                                                placeholder="+234 800 000 0000"
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="institution" className="block text-xs font-medium tracking-wide text-deep/70 mb-2 uppercase">
                                                Institution/School
                                            </label>
                                            <input
                                                type="text"
                                                id="institution"
                                                name="institution"
                                                className="w-full px-4 py-3 rounded border border-mid/30 bg-cream text-deep text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all placeholder:text-mid/50"
                                                placeholder="University of..."
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="expectations" className="block text-xs font-medium tracking-wide text-deep/70 mb-2 uppercase">
                                                What are you hoping to gain?
                                            </label>
                                            <textarea
                                                id="expectations"
                                                name="expectations"
                                                rows={4}
                                                className="w-full px-4 py-3 rounded border border-mid/30 bg-cream text-deep text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all placeholder:text-mid/50 resize-none"
                                                placeholder="Share your expectations..."
                                            />
                                        </div>

                                        <button type="submit" className="btn-primary w-full">
                                            Complete Registration
                                        </button>

                                        <p className="text-sm text-deep/50 text-center">
                                            By registering, you agree to receive conference updates via email.
                                        </p>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </main>
            <Footer />
        </>
    );
}
