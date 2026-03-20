"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useEffect, useRef } from "react";

// SVG Icons - Elegant Cross with glow and float animation
const CrossIcon = () => (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className="text-gold animate-cross">
        <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        {/* Outer ring */}
        <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.3" fill="none" />
        <circle cx="32" cy="32" r="26" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.2" fill="none" />
        {/* Cross vertical beam */}
        <rect x="29" y="12" width="6" height="40" rx="1" fill="currentColor" filter="url(#glow)"/>
        {/* Cross horizontal beam */}
        <rect x="12" y="29" width="40" height="6" rx="1" fill="currentColor" filter="url(#glow)"/>
        {/* Center accent */}
        <circle cx="32" cy="32" r="4" fill="#ECC07A" />
    </svg>
);

const BookIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
);

const BibleIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="3" width="16" height="18" rx="2"/>
        <path d="M12 7v12"/>
        <path d="M8 7h8"/>
        <path d="M8 11h8"/>
        <path d="M8 15h8"/>
    </svg>
);

const HeartIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
);

const BookmarkIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
    </svg>
);

const PeopleIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
);

const FlameIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
    </svg>
);

const ArrowIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"/>
        <polyline points="12 5 19 12 12 19"/>
    </svg>
);

const features = [
    {
        title: "Daily Devotionals",
        description: "Start each day rooted in Scripture with curated reflections and morning meditations.",
        href: "/hub/devotionals",
        icon: BookIcon,
    },
    {
        title: "Bible Reader",
        description: "Read, search, and bookmark your favorite passages with our elegant reading interface.",
        href: "/hub/bible",
        icon: BibleIcon,
    },
    {
        title: "Prayer Center",
        description: "Share prayer requests and keep a personal prayer journal for spiritual growth.",
        href: "/hub/prayer",
        icon: HeartIcon,
    },
    {
        title: "Books Library",
        description: "Access Christian books and resources to deepen your faith and understanding.",
        href: "/hub/books",
        icon: BookmarkIcon,
    },
    {
        title: "Community",
        description: "Connect with fellow believers and grow together in faith and fellowship.",
        href: "/hub/community",
        icon: PeopleIcon,
    },
    {
        title: "Conferences",
        description: "Join transformative gatherings for teaching, worship, and spiritual renewal.",
        href: "/conference",
        icon: FlameIcon,
    },
];

const stats = [
    { value: "500+", label: "Active Members" },
    { value: "12", label: "Conferences Held" },
    { value: "24/7", label: "Digital Access" },
];

const quickLinks = [
    { label: "Our Story", href: "#story" },
    { label: "Meet the Team", href: "#team" },
    { label: "Statement of Faith", href: "#faith" },
    { label: "Contact Us", href: "#contact" },
    { label: "Partner With Us", href: "#partner" },
];

// Scroll reveal hook
function useScrollReveal() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                    }
                });
            },
            { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
        );

        const el = ref.current;
        if (el) {
            observer.observe(el);
        }

        return () => {
            if (el) observer.unobserve(el);
        };
    }, []);

    return ref;
}

function RevealSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
    const ref = useScrollReveal();
    const delayClass = delay > 0 ? `stagger-${Math.min(delay, 6)}` : "";

    return (
        <div ref={ref} className={`reveal ${delayClass} ${className}`}>
            {children}
        </div>
    );
}

export default function Home() {
    return (
        <>
            <Header />
            <main className="font-body">
                {/* Section 1: Hero (full viewport height) */}
                <section className="relative min-h-screen bg-deep flex items-center justify-center overflow-hidden">
                    {/* Radial gradients */}
                    <div className="absolute inset-0 bg-gradient-radial-gold" />
                    <div className="absolute inset-0 bg-gradient-radial-dark" />

                    {/* Noise overlay */}
                    <div className="noise-overlay" />

                    {/* Content */}
                    <div className="relative z-10 container-page text-center py-20">
                        {/* Cross icon with enhanced animation */}
                        <div className="animate-fade-down hero-delay-1 mb-8 flex justify-center">
                            <div className="animate-cross">
                                <CrossIcon />
                            </div>
                        </div>

                        {/* Eyebrow */}
                        <p className="animate-fade-down hero-delay-2 eyebrow mb-6">
                            Christian Student Ministry
                        </p>

                        {/* Main heading with gradient animation */}
                        <h1 className="animate-fade-down hero-delay-3 font-display text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-cream mb-6 leading-none">
                            Re<span className="italic text-gold animate-pulse-slow">awakening</span>
                        </h1>

                        {/* Subheading */}
                        <p className="animate-fade-down hero-delay-4 font-display italic text-xl md:text-2xl text-cream/80 mb-4">
                            Equipping students to grow in faith, purpose, and community
                        </p>

                        {/* Body paragraph */}
                        <p className="animate-fade-down hero-delay-5 text-cream/60 max-w-xl mx-auto mb-10 font-light">
                            Supporting students both on campus and beyond through teaching, prayer, worship, and spiritual nurturing.
                        </p>

                        {/* Buttons with hover animations */}
                        <div className="animate-fade-down hero-delay-6 flex flex-wrap justify-center gap-4">
                            <Link href="/hub" className="btn-primary transform hover:scale-105 transition-all duration-300 hover:shadow-lift">
                                Enter Member Hub
                            </Link>
                            <Link href="/conference" className="btn-outline border-cream/40 text-cream hover:bg-cream/10 hover:border-cream transform hover:scale-105 transition-all duration-300">
                                Register for Conference
                            </Link>
                        </div>
                    </div>

                    {/* Enhanced scroll indicator */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce cursor-pointer hover:text-cream/60 transition-colors">
                        <svg className="w-6 h-6 text-cream/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </div>
                </section>

                {/* Section 2: Stats bar */}
                <section className="bg-deep-2 py-12 md:py-16">
                    <div className="container-page">
                        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-0">
                            <div className="animate-fade-up stats-delay-1 flex-1 text-center md:text-right">
                                <div className="font-display text-3xl md:text-4xl text-gold mb-1">500+</div>
                                <p className="text-cream/60 text-sm">Students Equipped</p>
                            </div>
                            <div className="hidden md:block w-px h-12 bg-gold/30 mx-8"></div>
                            <div className="animate-fade-up stats-delay-2 flex-1 text-center md:text-right">
                                <div className="font-display text-3xl md:text-4xl text-gold mb-1">12</div>
                                <p className="text-cream/60 text-sm">Annual Conferences</p>
                            </div>
                            <div className="hidden md:block w-px h-12 bg-gold/30 mx-8"></div>
                            <div className="animate-fade-up stats-delay-3 flex-1 text-center md:text-right">
                                <div className="font-display text-3xl md:text-4xl text-gold mb-1">8</div>
                                <p className="text-cream/60 text-sm">Campus Chapters</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 3: About Reawakening */}
                <section className="bg-warm-white py-20 md:py-28">
                    <div className="container-page">
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                            {/* Left: Content */}
                            <RevealSection>
                                <p className="eyebrow">What is Reawakening?</p>
                                <h2 className="section-heading mb-8">
                                    A ministry <span className="italic text-gold">set apart</span> for students
                                </h2>
                                <div className="space-y-5 text-deep/80 font-light leading-relaxed">
                                    <p>
                                        Reawakening is more than an organization — it is a movement of students who are serious about their faith and hungry for authentic encounters with God. We believe that the university years are pivotal for spiritual formation.
                                    </p>
                                    <p>
                                        Through our conferences, digital resources, and campus communities, we create spaces where students can ask hard questions, find biblical answers, and build lasting relationships with fellow believers.
                                    </p>
                                    <p>
                                        Our mission is simple: to see a generation of students awakened to the beauty of Christ, grounded in Scripture, and sent out to impact their campuses and beyond.
                                    </p>
                                </div>
                            </RevealSection>

                            {/* Right: Quote card */}
                            <RevealSection delay={2} className="lg:pt-12">
                                <div className="bg-deep p-8 md:p-10 rounded-lg relative">
                                    <div className="font-display text-8xl text-gold/20 leading-none absolute top-4 left-6">"</div>
                                    <blockquote className="relative z-10">
                                        <p className="font-display italic text-xl md:text-2xl text-cream/90 leading-relaxed mb-6">
                                            We are not just building a ministry. We are building a movement of students who will carry the torch of revival to their generation.
                                        </p>
                                        <footer>
                                            <p className="text-gold-light font-medium">P. Igbagboyemi Oluwatofunmi Ojo</p>
                                            <p className="text-cream/50 text-sm">Convener, Reawakening</p>
                                        </footer>
                                    </blockquote>
                                </div>
                            </RevealSection>
                        </div>
                    </div>
                </section>

                {/* Section 4: What We Offer */}
                <section className="bg-cream py-20 md:py-28">
                    <div className="container-page">
                        <RevealSection className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
                            <p className="eyebrow">What We Offer</p>
                            <h2 className="section-heading mb-4">
                                Resources for your <span className="italic text-gold">journey</span>
                            </h2>
                            <p className="text-deep/70 font-light">
                                Everything you need to grow deeper in your faith, connect with community, and live with purpose.
                            </p>
                        </RevealSection>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {features.map((feature, index) => {
                                const Icon = feature.icon;
                                return (
                                    <RevealSection key={index} delay={index + 1}>
                                        <Link
                                            href={feature.href}
                                            className="offering-card card-hover group block h-full bg-warm-white border-mid/20"
                                        >
                                            {/* Icon container */}
                                            <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center mb-5 text-gold">
                                                <Icon />
                                            </div>

                                            {/* Title */}
                                            <h3 className="font-display text-xl text-deep mb-3 group-hover:text-gold transition-colors">
                                                {feature.title}
                                            </h3>

                                            {/* Description */}
                                            <p className="text-deep/70 text-sm font-light leading-relaxed mb-4">
                                                {feature.description}
                                            </p>

                                            {/* Link */}
                                            <span className="inline-flex items-center gap-1 text-sm font-medium text-gold group-hover:gap-2 transition-all">
                                                Explore <span className="text-gold">→</span>
                                            </span>
                                        </Link>
                                    </RevealSection>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Section 5: CTA Banner */}
                <section className="relative bg-deep py-20 md:py-28 overflow-hidden">
                    {/* Amber radial glow */}
                    <div className="absolute inset-0 bg-gradient-radial-gold opacity-30" />

                    <div className="container-page relative z-10">
                        <RevealSection className="text-center max-w-2xl mx-auto">
                            <p className="eyebrow">Join Us</p>
                            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-cream mb-6 leading-tight">
                                Ready to Begin <span className="italic text-gold">Your Journey?</span>
                            </h2>
                            <p className="text-cream/60 font-light mb-10 max-w-lg mx-auto">
                                Join us in pursuing spiritual growth and a deeper relationship with God. Whether you are curious or committed, there is a place for you here.
                            </p>
                            <div className="flex flex-wrap justify-center gap-4">
                                <Link href="/conference" className="btn-primary">
                                    Register for Conference
                                </Link>
                                <Link href="/about" className="btn-outline border-cream/40 text-cream hover:bg-cream/10 hover:border-cream">
                                    Learn More
                                </Link>
                            </div>
                        </RevealSection>
                    </div>
                </section>

                {/* Section 6: About section */}
                <section className="bg-warm-white py-20 md:py-28">
                    <div className="container-page">
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
                            {/* Left: Eyebrow, heading, quick links */}
                            <RevealSection>
                                <p className="eyebrow">About</p>
                                <h2 className="section-heading mb-8">
                                    Learn <span className="italic text-gold">About Us</span>
                                </h2>

                                {/* Quick links card */}
                                <div className="bg-cream border border-mid/20 rounded-lg p-6 md:p-8">
                                    <h3 className="font-display text-lg text-deep mb-4">Quick Links</h3>
                                    <ul className="space-y-3">
                                        {quickLinks.map((link, index) => (
                                            <li key={index}>
                                                <Link
                                                    href={link.href}
                                                    className="inline-flex items-center gap-2 text-deep/70 hover:text-gold transition-colors text-sm"
                                                >
                                                    <span className="text-gold">→</span>
                                                    {link.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </RevealSection>

                            {/* Right: Paragraphs + button */}
                            <RevealSection delay={2} className="lg:pt-16">
                                <div className="space-y-5 text-deep/80 font-light leading-relaxed mb-8">
                                    <p>
                                        Founded with a vision to reach students across campuses, Reawakening has grown into a vibrant community of believers who are passionate about Jesus and committed to seeing their peers transformed by the gospel.
                                    </p>
                                    <p>
                                        We host annual conferences that draw hundreds of students for intense times of worship, teaching, and prayer. Our digital platform extends this experience year-round, offering devotionals, Bible studies, and community forums.
                                    </p>
                                    <p>
                                        Whether you are exploring Christianity for the first time or looking to deepen your walk with God, Reawakening provides the resources, relationships, and environments you need to thrive.
                                    </p>
                                </div>
                                <Link href="/about" className="btn-primary">
                                    More About Us
                                </Link>
                            </RevealSection>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
