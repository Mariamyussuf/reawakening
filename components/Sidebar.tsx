"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "next-auth/react";

const navigation = [
    { name: "Dashboard", href: "/hub" },
    { name: "Devotionals", href: "/hub/devotionals" },
    { name: "Bible", href: "/hub/bible" },
    { name: "Prayer", href: "/hub/prayer" },
    { name: "Books", href: "/hub/books" },
    { name: "Community", href: "/hub/community" },
    { name: "Settings", href: "/hub/settings" },
];

// Cross icon for logo
const CrossIcon = () => (
    <svg width="20" height="20" viewBox="0 0 48 48" fill="none" className="text-gold">
        <rect x="20" y="8" width="8" height="32" rx="1" fill="currentColor"/>
        <rect x="8" y="20" width="32" height="8" rx="1" fill="currentColor"/>
    </svg>
);

export default function Sidebar() {
    const pathname = usePathname();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
            {/* Mobile toggle */}
            <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden fixed bottom-4 right-4 z-50 w-12 h-12 rounded-lg bg-deep text-gold shadow-lift flex items-center justify-center border border-gold/30"
                aria-label="Toggle navigation"
            >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {mobileOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                </svg>
            </button>

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-[85vw] max-w-60 z-40 bg-deep border-r border-gold/20 flex flex-col transition-transform duration-200 md:w-60 md:translate-x-0 ${
                    mobileOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                {/* Logo */}
                <div className="px-4 py-4 border-b border-gold/20">
                    <Link href="/" className="flex items-center gap-2 text-gold font-display text-lg font-semibold tracking-wide" onClick={() => setMobileOpen(false)}>
                        <CrossIcon />
                        Reawakening
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-3 space-y-1">
                    {navigation.map((item) => {
                        const active = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setMobileOpen(false)}
                                className={`block px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    active
                                        ? "bg-gold/20 text-cream"
                                        : "text-cream/60 hover:bg-gold/10 hover:text-cream"
                                }`}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sign out */}
                <div className="p-3 border-t border-gold/20">
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full px-3 py-2 text-sm font-medium text-cream/60 hover:text-gold hover:bg-gold/10 rounded-md transition-colors text-left"
                    >
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-deep/50 z-30 md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}
        </>
    );
}
