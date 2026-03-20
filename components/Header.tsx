"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const navigation = [
    { name: "Home", href: "/" },
    { name: "Member Hub", href: "/hub" },
    { name: "About", href: "/about" },
    { name: "Conference", href: "/conference" },
    { name: "Daily Verse", href: "/daily-verse" },
    { name: "Resources", href: "/resources" },
    { name: "Archive", href: "/archive" },
    { name: "Contact", href: "/contact" },
];

export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    return (
        <>
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                    scrolled
                        ? "bg-navy-900/95 backdrop-blur-xl shadow-glow-navy border-b border-gold-500/10"
                        : "bg-navy-900/80 backdrop-blur-md"
                }`}
            >
                <nav className="container-custom">
                    <div className="flex items-center justify-between h-16 md:h-20">

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gold-500/20 rounded-xl blur-sm group-hover:blur-md transition-all duration-300" />
                                <img
                                    src="/images/logo.png"
                                    alt="Reawakening"
                                    className="relative w-9 h-9 object-contain"
                                />
                            </div>
                            <div className="flex flex-col leading-none">
                                <span className="font-display text-lg font-semibold text-cream-50 tracking-wide">
                                    Reawakening
                                </span>
                                <span className="text-[10px] font-medium tracking-[0.2em] uppercase text-gold-400 font-sans">
                                    Ministry
                                </span>
                            </div>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden lg:flex items-center gap-1">
                            {navigation.map((item) => {
                                const active = pathname === item.href;
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 font-sans ${
                                            active
                                                ? "text-gold-400"
                                                : "text-cream-200 hover:text-cream-50"
                                        }`}
                                    >
                                        {active && (
                                            <span className="absolute inset-x-2 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-gold-400 to-transparent" />
                                        )}
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* CTA + mobile toggle */}
                        <div className="flex items-center gap-3">
                            <Link
                                href="/hub"
                                className="hidden md:inline-flex btn-primary text-xs px-5 py-2.5"
                            >
                                Member Hub
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>

                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                className="lg:hidden flex flex-col items-center justify-center w-10 h-10 rounded-xl border border-gold-500/20 bg-navy-800/60 gap-1.5 transition-all duration-200 hover:border-gold-500/40"
                                aria-label="Toggle menu"
                            >
                                <span className={`block w-5 h-0.5 bg-cream-200 rounded-full transition-all duration-300 ${mobileOpen ? "rotate-45 translate-y-2" : ""}`} />
                                <span className={`block w-5 h-0.5 bg-cream-200 rounded-full transition-all duration-300 ${mobileOpen ? "opacity-0 scale-x-0" : ""}`} />
                                <span className={`block w-5 h-0.5 bg-cream-200 rounded-full transition-all duration-300 ${mobileOpen ? "-rotate-45 -translate-y-2" : ""}`} />
                            </button>
                        </div>
                    </div>
                </nav>

                {/* Mobile Menu */}
                <div
                    className={`lg:hidden transition-all duration-300 overflow-hidden ${
                        mobileOpen ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                    <div className="border-t border-gold-500/10 bg-navy-950/95 backdrop-blur-xl px-5 py-6 space-y-1">
                        {navigation.map((item) => {
                            const active = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl font-sans text-sm font-medium transition-all duration-200 ${
                                        active
                                            ? "bg-gold-500/10 text-gold-400 border border-gold-500/20"
                                            : "text-cream-200 hover:bg-navy-800/60 hover:text-cream-50"
                                    }`}
                                >
                                    {active && <span className="gold-dot" />}
                                    {item.name}
                                </Link>
                            );
                        })}
                        <div className="pt-4 mt-4 border-t border-gold-500/10">
                            <Link href="/hub" className="btn-primary w-full justify-center text-sm">
                                Enter Member Hub
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Spacer */}
            <div className="h-16 md:h-20" />
        </>
    );
}
