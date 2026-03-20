"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

    return (
        <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200">
            <nav className="container-custom py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2 group">
                        <img
                            src="/images/logo.png"
                            alt="Reawakening Logo"
                            className="w-10 h-10 object-contain group-hover:scale-105 transition-transform duration-300"
                        />
                        <span className="text-xl font-bold text-slate-800">Reawakening</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="px-4 py-2 text-slate-700 hover:text-orange-600 font-medium rounded-lg hover:bg-orange-50 transition-all duration-200"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
                        aria-label="Toggle menu"
                    >
                        <svg
                            className="w-6 h-6 text-slate-700"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {mobileMenuOpen ? (
                                <path d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden mt-4 pb-4 space-y-2 border-t border-slate-200 pt-4">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="block px-4 py-2 text-slate-700 hover:text-orange-600 hover:bg-orange-50 rounded-lg font-medium transition-all duration-200"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>
                )}
            </nav>
        </header>
    );
}
