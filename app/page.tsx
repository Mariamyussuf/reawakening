"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Home() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const features = [
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
            title: "Daily Devotionals",
            description: "Start each day with inspiring devotionals and Scripture that guide your spiritual journey.",
            color: "emerald",
            href: "/hub/devotionals"
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                </svg>
            ),
            title: "Bible Reading",
            description: "Access the complete Bible with bookmarks, search, and reading plans to deepen your understanding.",
            color: "blue",
            href: "/hub/bible"
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
            ),
            title: "Prayer Center",
            description: "Share prayer requests, pray for others, and keep a personal prayer journal to track God's faithfulness.",
            color: "rose",
            href: "/hub/prayer"
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
            ),
            title: "Books Library",
            description: "Explore curated Christian books, devotionals, and resources to enrich your faith journey.",
            color: "purple",
            href: "/hub/books"
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zM7 10a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
            ),
            title: "Community",
            description: "Connect with fellow believers, share experiences, and grow together in faith and fellowship.",
            color: "indigo",
            href: "/hub/community"
        },
        {
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            title: "Conferences",
            description: "Join meetings designed to equip and nurture students in their fire and zeal for God through teaching, worship, and prayer.",
            color: "amber",
            href: "/conference"
        },
    ];

    const stats = [
        { value: "500+", label: "Active Members", icon: "👥" },
        { value: "12", label: "Conferences Held", icon: "🎯" },
        { value: "24/7", label: "Support Available", icon: "💚" },
    ];

    return (
        <>
            <Header />
            <main className="relative overflow-hidden bg-white">
                {/* Animated Background */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                    <div className="absolute top-20 left-10 w-96 h-96 bg-orange-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }}></div>
                    <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-amber-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '10s', animationDelay: '2s' }}></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '1s' }}></div>
                </div>

                {/* Hero Section */}
                <section className="relative min-h-[90vh] flex items-center justify-center py-20 md:py-32 z-10">
                    <div className="container-custom">
                        <div className={`text-center max-w-5xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 bg-orange-50 border border-orange-200/50 rounded-full shadow-sm">
                                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                                <span className="text-sm font-semibold text-orange-700">Christian Student Ministry</span>
                            </div>

                            {/* Main Heading */}
                            <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.1] tracking-tight">
                                Welcome to{" "}
                                <span className="gradient-text inline-block">Reawakening</span>
                            </h1>

                            {/* Subheading */}
                            <p className="text-xl md:text-2xl lg:text-3xl text-slate-600 mb-12 leading-relaxed max-w-4xl mx-auto font-light">
                                A meeting set out to{" "}
                                <span className="font-semibold text-orange-600">thoroughly equip students</span> to be on fire for God and{" "}
                                <span className="font-semibold text-orange-600">effectively nurture them</span> in preserving their fire and zeal for God{" "}
                                <span className="font-semibold text-orange-600">both on campus and off campus</span>
                            </p>

                            {/* CTA Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                                <Link 
                                    href="/hub" 
                                    className="group relative px-8 py-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                                >
                                    <span className="flex items-center gap-2">
                                        Enter Member Hub
                                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </span>
                                </Link>
                                <Link 
                                    href="/conference" 
                                    className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-semibold text-lg shadow-sm hover:shadow-md hover:border-orange-300 transition-all duration-300 hover:scale-105"
                                >
                                    Register for Conference
                                </Link>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto pt-12 border-t border-slate-200">
                                {stats.map((stat, index) => (
                                    <div key={index} className="text-center">
                                        <div className="text-4xl mb-2">{stat.icon}</div>
                                        <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">{stat.value}</div>
                                        <div className="text-sm md:text-base text-slate-600 font-medium">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* What is Reawakening */}
                <section className="relative py-24 bg-gradient-to-b from-white via-slate-50/50 to-white z-10">
                    <div className="container-custom">
                        <div className="max-w-4xl mx-auto">
                            <div className="card-premium text-center p-12 md:p-16">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl shadow-lg mb-8">
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>

                                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">What is Reawakening?</h2>

                                <p className="text-xl md:text-2xl text-slate-700 mb-8 leading-relaxed">
                                    A <span className="font-bold gradient-text">meeting set out to thoroughly equip students</span> to be on fire for God and effectively nurture them in preserving their fire and zeal for God.
                                </p>

                                <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-amber-500 mx-auto mb-8 rounded-full"></div>

                                <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-6">
                                    Reawakening is designed to support students{" "}
                                    <span className="font-semibold text-orange-600">both on campus and off campus</span>, providing{" "}
                                    <span className="font-semibold text-orange-600">teaching</span>,{" "}
                                    <span className="font-semibold text-orange-600">prayer</span>,{" "}
                                    <span className="font-semibold text-orange-600">worship</span>, and{" "}
                                    <span className="font-semibold text-orange-600">spiritual nurturing</span> through conferences and this digital platform.
                                </p>

                                <div className="mt-8 pt-8 border-t border-slate-200">
                                    <p className="text-base text-slate-500 italic">
                                        Convener: <span className="font-semibold text-slate-700 not-italic">P. Igbagboyemi Oluwatofunmi Ojo</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="relative py-24 bg-white z-10">
                    <div className="container-custom">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">How We Support You</h2>
                            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                                Comprehensive resources and community support for your spiritual journey
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {features.map((feature, index) => {
                                const colorClasses: Record<string, string> = {
                                    emerald: 'bg-gradient-to-br from-orange-500 to-orange-600',
                                    blue: 'bg-gradient-to-br from-amber-500 to-amber-600',
                                    rose: 'bg-gradient-to-br from-orange-400 to-orange-500',
                                    purple: 'bg-gradient-to-br from-yellow-500 to-orange-500',
                                    indigo: 'bg-gradient-to-br from-orange-600 to-amber-600',
                                    amber: 'bg-gradient-to-br from-amber-500 to-orange-500',
                                };
                                
                                return (
                                <Link
                                    key={index}
                                    href={feature.href}
                                    className="group relative bg-white rounded-2xl border border-slate-200 p-8 hover:border-orange-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                >
                                    <div className={`w-14 h-14 rounded-xl ${colorClasses[feature.color]} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-orange-600 transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed mb-4">
                                        {feature.description}
                                    </p>
                                    <div className="flex items-center gap-2 text-orange-600 font-semibold group-hover:gap-3 transition-all">
                                        <span>Learn more</span>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </Link>
                                );
                            })}
                        </div>
                    </div>
                </section>

                {/* Call to Action */}
                <section className="relative py-24 bg-gradient-to-br from-orange-600 via-amber-600 to-yellow-500 overflow-hidden z-10">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzRjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6bTAtMjBjMC0yLjIxIDEuNzktNCA0LTRzNCAxLjc5IDQgNC0xLjc5IDQtNCA0LTQtMS43OS00LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
                    
                    <div className="container-custom relative z-10">
                        <div className="text-center max-w-3xl mx-auto text-white">
                            <h2 className="text-5xl md:text-6xl font-bold mb-6">Ready to Begin?</h2>
                            <p className="text-xl md:text-2xl mb-12 opacity-95 leading-relaxed">
                                Join us in pursuing spiritual growth, renewal, and a deeper relationship with God
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link 
                                    href="/conference" 
                                    className="px-10 py-4 bg-white text-orange-600 rounded-xl font-bold text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105"
                                >
                                    Register for Conference
                                </Link>
                                <Link 
                                    href="/about" 
                                    className="px-10 py-4 bg-white/10 backdrop-blur-md text-white rounded-xl font-bold text-lg border-2 border-white/50 hover:bg-white/20 transition-all duration-300 hover:scale-105"
                                >
                                    Learn More About Us
                                </Link>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Spiritual Emphasis */}
                <section className="relative py-24 bg-white z-10">
                    <div className="container-custom">
                        <div className="max-w-4xl mx-auto">
                            <div className="card-glass text-center p-12 md:p-16">
                                <div className="mb-8">
                                    <svg className="w-16 h-16 text-orange-600 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                    </svg>
                                </div>
                                <blockquote className="text-2xl md:text-3xl lg:text-4xl text-slate-800 leading-relaxed font-light italic">
                                    A spiritually healthy extension of a student ministry, overseen with care, created to help students remain{" "}
                                    <span className="font-bold gradient-text not-italic">grounded</span> after exams.
                                </blockquote>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
