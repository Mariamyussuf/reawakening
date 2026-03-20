"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

function useInView(threshold = 0.15) {
    const ref = useRef<HTMLElement>(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        if (!ref.current) return;
        const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
        obs.observe(ref.current);
        return () => obs.disconnect();
    }, [threshold]);
    return { ref, inView };
}

const features = [
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
        ),
        title: "Daily Devotionals",
        description: "Start each day rooted in Scripture. Curated reflections to guide your spiritual walk one morning at a time.",
        href: "/hub/devotionals",
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
        ),
        title: "Bible Reader",
        description: "The complete Word of God with bookmarks, reading plans, and search — your scripture library, always available.",
        href: "/hub/bible",
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
        ),
        title: "Prayer Center",
        description: "Share your heart. Pray for others. Keep a personal journal of God's faithfulness throughout your journey.",
        href: "/hub/prayer",
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
        ),
        title: "Books Library",
        description: "A curated collection of Christian books and resources to deepen your knowledge and enrich your faith.",
        href: "/hub/books",
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        title: "Community",
        description: "Connect with fellow believers, share your story, and grow together in faith, fellowship, and accountability.",
        href: "/hub/community",
    },
    {
        icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
        title: "Conferences",
        description: "Transformative gatherings set apart for teaching, worship, and prayer — fueling your fire for God.",
        href: "/conference",
    },
];

const stats = [
    { value: "500+", label: "Active Members" },
    { value: "12", label: "Conferences Held" },
    { value: "24/7", label: "Digital Access" },
];

export default function Home() {
    const [mounted, setMounted] = useState(false);
    const featuresSection = useInView(0.1);
    const missionSection = useInView(0.2);
    const ctaSection = useInView(0.2);

    useEffect(() => {
        const t = setTimeout(() => setMounted(true), 80);
        return () => clearTimeout(t);
    }, []);

    return (
        <>
            <Header />
            <main className="bg-cream-50 overflow-hidden">

                {/* ── HERO ── */}
                <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
                    {/* Dark navy background */}
                    <div className="absolute inset-0 bg-navy-gradient" />

                    {/* Pattern overlay */}
                    <div className="absolute inset-0 bg-hero-pattern opacity-100" />

                    {/* Ambient glows */}
                    <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full"
                        style={{ background: "radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)" }} />
                    <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full"
                        style={{ background: "radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)" }} />

                    <div className="container-custom relative z-10 py-24 md:py-32">
                        <div className={`text-center max-w-5xl mx-auto transition-all duration-1000 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>

                            {/* Label */}
                            <div className="inline-flex items-center gap-2.5 mb-10">
                                <div className="h-px w-8"
                                    style={{ background: "linear-gradient(90deg, transparent, #D4AF37)" }} />
                                <span className="font-sans text-xs font-semibold tracking-[0.3em] uppercase text-gold-400">
                                    Christian Student Ministry
                                </span>
                                <div className="h-px w-8"
                                    style={{ background: "linear-gradient(90deg, #D4AF37, transparent)" }} />
                            </div>

                            {/* Main heading */}
                            <h1 className="font-display text-7xl md:text-8xl lg:text-9xl font-semibold text-cream-50 leading-none mb-6"
                                style={{ letterSpacing: "-0.02em" }}>
                                Reawakening
                            </h1>

                            {/* Sub heading */}
                            <p className="font-display italic text-2xl md:text-3xl text-gold-400/90 mb-4 font-light">
                                Thoroughly equipping students
                            </p>
                            <p className="font-sans text-base md:text-lg text-navy-300 max-w-2xl mx-auto leading-relaxed mb-14">
                                A meeting set out to equip students to be on fire for God — and effectively nurture them in preserving their zeal for God both on campus and off campus.
                            </p>

                            {/* CTAs */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
                                <Link href="/hub" className="btn-primary px-10 py-4 text-base font-semibold">
                                    Enter Member Hub
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Link>
                                <Link
                                    href="/conference"
                                    className="inline-flex items-center justify-center gap-2 px-10 py-4 text-base font-semibold rounded-xl border border-cream-50/20 text-cream-100 transition-all duration-300 hover:bg-cream-50/10 font-sans"
                                >
                                    Register for Conference
                                </Link>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-6 md:gap-12 max-w-xl mx-auto pt-10 border-t border-cream-50/10">
                                {stats.map((s, i) => (
                                    <div key={i} className="text-center">
                                        <div className="font-display text-3xl md:text-4xl font-semibold text-gold-gradient mb-1">{s.value}</div>
                                        <div className="font-sans text-xs text-navy-400 tracking-wide">{s.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Bottom fade */}
                    <div className="absolute bottom-0 left-0 right-0 h-32"
                        style={{ background: "linear-gradient(to bottom, transparent, #FDFAF4)" }} />
                </section>

                {/* ── MISSION STATEMENT ── */}
                <section
                    ref={missionSection.ref as React.RefObject<HTMLElement>}
                    className="py-28 bg-cream-50"
                >
                    <div className="container-custom">
                        <div className={`max-w-4xl mx-auto transition-all duration-700 ${missionSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                            <div className="card-cream p-12 md:p-16 text-center rounded-3xl">
                                {/* Cross icon */}
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-8"
                                    style={{ background: "linear-gradient(135deg, #D4AF37, #edca66)" }}>
                                    <svg className="w-8 h-8 text-navy-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>

                                <p className="font-sans text-xs font-semibold tracking-[0.25em] uppercase text-gold-600 mb-4">What is Reawakening?</p>
                                <h2 className="font-display text-4xl md:text-5xl font-semibold text-navy-900 mb-8 leading-tight">
                                    A meeting set apart<br />
                                    <span className="text-gold-gradient">for students on fire for God</span>
                                </h2>

                                <div className="gold-line mx-auto mb-8" />

                                <p className="font-sans text-base md:text-lg text-ink-600 leading-relaxed max-w-2xl mx-auto mb-6">
                                    Reawakening supports students{" "}
                                    <span className="font-semibold text-navy-800">both on campus and off campus</span>, providing
                                    teaching, prayer, worship, and spiritual nurturing through conferences and this digital platform.
                                </p>

                                <div className="mt-10 pt-8 border-t border-cream-300/60">
                                    <p className="font-sans text-sm text-ink-500">Convener</p>
                                    <p className="font-display text-xl text-navy-900 mt-1">P. Igbagboyemi Oluwatofunmi Ojo</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── FEATURES ── */}
                <section
                    ref={featuresSection.ref as React.RefObject<HTMLElement>}
                    className="py-28"
                    style={{ background: "linear-gradient(180deg, #FDFAF4 0%, #F9F3E3 100%)" }}
                >
                    <div className="container-custom">
                        <div className={`text-center mb-16 transition-all duration-700 ${featuresSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                            <p className="font-sans text-xs font-semibold tracking-[0.25em] uppercase text-gold-600 mb-4">What we offer</p>
                            <h2 className="section-title mb-4">How We Support You</h2>
                            <p className="section-subtitle max-w-xl mx-auto">
                                Comprehensive tools and community built to sustain your spiritual growth.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {features.map((feat, i) => (
                                <Link
                                    key={i}
                                    href={feat.href}
                                    className={`group relative bg-white rounded-2xl p-7 border border-ink-100/60 transition-all duration-500 hover:-translate-y-1 overflow-hidden ${featuresSection.inView ? "animate-fade-up" : "opacity-0"}`}
                                    style={{
                                        animationDelay: `${i * 80}ms`,
                                        boxShadow: "0 2px 8px rgba(15,22,40,0.06)"
                                    }}
                                >
                                    {/* Hover gold edge */}
                                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-gold-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    {/* Icon */}
                                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-navy-900 transition-all duration-300 group-hover:scale-110"
                                        style={{ background: "linear-gradient(135deg, #D4AF37, #edca66)" }}>
                                        {feat.icon}
                                    </div>

                                    <h3 className="font-display text-xl font-semibold text-navy-900 mb-2 group-hover:text-gold-600 transition-colors">
                                        {feat.title}
                                    </h3>
                                    <p className="font-sans text-sm text-ink-500 leading-relaxed mb-5">
                                        {feat.description}
                                    </p>

                                    <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold-600 font-sans group-hover:gap-2.5 transition-all">
                                        Explore
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ── CALL TO ACTION ── */}
                <section
                    ref={ctaSection.ref as React.RefObject<HTMLElement>}
                    className="relative py-32 overflow-hidden"
                    style={{ background: "linear-gradient(145deg, #0F1628 0%, #162147 60%, #1f3060 100%)" }}
                >
                    <div className="absolute inset-0 bg-hero-pattern opacity-100" />
                    <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(212,175,55,0.10) 0%, transparent 70%)" }} />

                    <div className="container-custom relative z-10">
                        <div className={`text-center max-w-3xl mx-auto transition-all duration-700 ${ctaSection.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
                            <div className="gold-line mx-auto mb-8" style={{ width: "48px" }} />
                            <h2 className="font-display text-5xl md:text-6xl font-semibold text-cream-50 mb-6 leading-tight">
                                Ready to Begin<br />Your Journey?
                            </h2>
                            <p className="font-sans text-base text-navy-300 mb-12 leading-relaxed max-w-xl mx-auto">
                                Join us in pursuing spiritual growth, renewal, and a deeper relationship with God. You were made for more.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/conference" className="btn-primary px-10 py-4 text-base font-semibold">
                                    Register for Conference
                                </Link>
                                <Link
                                    href="/about"
                                    className="inline-flex items-center justify-center px-10 py-4 text-base font-semibold rounded-xl border border-cream-50/20 text-cream-100 hover:bg-cream-50/10 transition-all duration-300 font-sans"
                                >
                                    Learn About Us
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── SCRIPTURE QUOTE ── */}
                <section className="py-24 bg-cream-50">
                    <div className="container-custom">
                        <div className="max-w-3xl mx-auto text-center">
                            <svg className="w-10 h-10 text-gold-400 mx-auto mb-8 opacity-60" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                            </svg>
                            <blockquote className="font-display italic text-2xl md:text-3xl lg:text-4xl text-navy-900 leading-relaxed font-light mb-6">
                                A spiritually healthy extension of a student ministry, overseen with care, created to help students remain{" "}
                                <span className="not-italic font-semibold text-gold-gradient">grounded</span>{" "}
                                after exams.
                            </blockquote>
                            <div className="gold-line mx-auto" />
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
        </>
    );
}
