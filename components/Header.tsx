"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const navigation = [
    { name: "Home", href: "/" },
    { name: "Hub", href: "/hub" },
    { name: "About", href: "/about" },
    { name: "Conference", href: "/conference" },
    { name: "Resources", href: "/resources" },
    { name: "Contact", href: "/contact" },
];

export default function Header() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    return (
        <>
            <header
                className="fixed top-0 left-0 right-0 z-50 bg-[rgba(22,40,22,0.97)] backdrop-blur-md"
            >
                <nav className="container-page">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <span className="font-display text-xl font-semibold text-gold tracking-wide">
                                REAWAKENING
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <div className="hidden lg:flex items-center gap-8">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`text-xs font-medium tracking-[0.1em] uppercase transition-colors ${
                                        pathname === item.href
                                            ? "text-cream"
                                            : "text-cream/70 hover:text-cream"
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        {/* CTA + mobile toggle */}
                        <div className="flex items-center gap-3">
                            <Link
                                href="/conference"
                                className="hidden sm:inline-flex px-5 py-2 text-xs font-semibold tracking-[0.08em] uppercase bg-gold text-deep rounded hover:bg-gold-light transition-colors"
                            >
                                Register
                            </Link>

                            <button
                                onClick={() => setMobileOpen(!mobileOpen)}
                                className="lg:hidden p-2 text-cream/70 hover:text-cream"
                                aria-label="Toggle menu"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {mobileOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </nav>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div className="lg:hidden border-t border-cream/10 bg-[rgba(22,40,22,0.98)]">
                        <div className="container-page py-4 space-y-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`block py-3 text-xs font-medium tracking-[0.1em] uppercase ${
                                        pathname === item.href
                                            ? "text-cream"
                                            : "text-cream/70"
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <div className="pt-3 mt-3 border-t border-cream/10">
                                <Link
                                    href="/conference"
                                    className="block py-3 text-xs font-semibold tracking-[0.08em] uppercase text-gold"
                                >
                                    Register for Conference
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* Spacer */}
            <div className="h-16" />
        </>
    );
}
